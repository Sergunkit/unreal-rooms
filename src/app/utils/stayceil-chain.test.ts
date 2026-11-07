import { describe, expect, it } from 'vitest';
import type { CurrentHotelProgress } from '../contexts/GameContext';
import type { TempBookingFormData } from '../data/hotels-data/hotelTypes';
import { evaluateConditions } from './evaluateConditions';
import { resolveActionTarget } from './resolveActionTarget';
import { resolveChainTarget } from './resolveChainTarget';
import { chainAction, chainStep, loadCatalogChain } from './catalogChains.fixtures';

/**
 * The Stay-Ceil Inn (id 10) — реальные цепочки из серверного каталога.
 * Механика отеля отличается от Dolphin: капча ведёт не к ключу, а к
 * выбору этажа (лифт), отмена возвращает к капче; опасен этаж 14,
 * safe-бронирование — номер rehab на любом другом этаже. Выбор номера
 * НЕ заперт консьержем.
 */
const chain = loadCatalogChain('10');

function tempForm(overrides: Partial<TempBookingFormData> = {}): TempBookingFormData {
  return {
    guests: 1,
    rooms: 1,
    roomType: 'rehab',
    checkInDate: null,
    checkOutDate: null,
    mealType: '',
    needTransfer: false,
    checkInTime: '14:00',
    selectedServices: [],
    ...overrides,
  };
}

function progress(overrides: Partial<CurrentHotelProgress> = {}): CurrentHotelProgress {
  return {
    floor: 13,
    tempBookingForm: tempForm(),
    ...overrides,
  } as CurrentHotelProgress;
}

describe('Stay-Ceil — капча и лифт вместо ключа', () => {
  it('клик по лифту на галерее запускает капчу', () => {
    const action = chainAction(chain, 'hotelPage', 'elevator-click');
    expect(action.galleryData?.type).toBe('capcha-get');
    const result = resolveActionTarget({ action, inventory: [], progress: null });
    expect(result.nextStep).toBe('captcha');
  });

  it('успешная капча ведёт на выбор этажа — БЕЗ награды в инвентарь', () => {
    const transitions = chainStep(chain, 'captcha').transitions!;
    expect(transitions.success.nextStep).toBe('floorSelect');
    // Контраст с Dolphin: там success выдаёт room-key через params.addToInventory
    expect(transitions.success.params?.addToInventory).toBeUndefined();
  });

  it('провал капчи — модалка captcha-failed без автовозврата на главную', () => {
    const result = resolveChainTarget({
      chain,
      currentStepId: 'captcha',
      nextStepId: 'captchaFailed',
    });
    expect(result.activeStep).toBe('captcha');
    expect(result.activeModal?.id).toBe('captcha-failed');
    // У Dolphin captcha-fail сразу отправляет на homePage — здесь игрок остаётся
    expect(result.activeModal?.nextStep).toBeUndefined();
  });

  it('отмена выбора этажа возвращает к капче (цикл-ретрай)', () => {
    const transitions = chainStep(chain, 'floorSelect').transitions!;
    expect(transitions.confirm.nextStep).toBe('bookingForm');
    expect(transitions.cancel.nextStep).toBe('captcha');
  });
});

describe('Stay-Ceil — выбор номера без консьержа', () => {
  it('room-card-book пустает в форму бронирования без ключа', () => {
    const action = chainAction(chain, 'roomCard', 'room-card-book');
    const result = resolveActionTarget({ action, inventory: [], progress: null });
    expect(result.nextStep).toBe('bookingForm');
    expect(result.modal).toBeNull();
  });

  it('у Stay-Ceil нет шага conciergeRequired', () => {
    expect(chain.steps.conciergeRequired).toBeUndefined();
  });
});

describe('Stay-Ceil — этаж 14 опасен, rehab безопасен', () => {
  const submitSafe = chainStep(chain, 'bookingForm').transitions!.submitSafe;
  const submitUnsafe = chainStep(chain, 'bookingForm').transitions!.submitUnsafe;

  it('номер rehab на этаже 13 — safe-бронирование', () => {
    expect(evaluateConditions(submitSafe.conditions, [], progress({ floor: 13 }))).toBe(true);
    expect(submitSafe.params?.bookingResult).toBe('safe');
  });

  it('этаж 14 ломает safe-ветку → бронирование небезопасно', () => {
    expect(evaluateConditions(submitSafe.conditions, [], progress({ floor: 14 }))).toBe(false);
    expect(evaluateConditions(submitUnsafe.conditions, [], progress({ floor: 14 }))).toBe(true);
    expect(submitUnsafe.params?.bookingResult).toBe('unsafe');
  });

  it('не-rehab номер небезопасен на любом этаже', () => {
    expect(
      evaluateConditions(
        submitSafe.conditions,
        [],
        progress({ floor: 13, tempBookingForm: tempForm({ roomType: 'standard' }) })
      )
    ).toBe(false);
  });

  it('бронирование без выбранного этажа не проходит safe-ветку', () => {
    expect(evaluateConditions(submitSafe.conditions, [], progress({ floor: undefined }))).toBe(false);
  });
});
