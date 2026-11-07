import { describe, expect, it } from 'vitest';
import type { CurrentHotelProgress } from '../contexts/GameContext';
import type { TempBookingFormData } from '../data/hotels-data/hotelTypes';
import { evaluateConditions } from './evaluateConditions';
import { resolveActionTarget } from './resolveActionTarget';
import { resolveChainTarget } from './resolveChainTarget';
import { chainAction, chainStep, loadCatalogChain } from './catalogChains.fixtures';

/**
 * Dolphin King Hotel (id 5) — реальные цепочки из серверного каталога.
 * Механика отеля: вход в бронирование заперт ключом от номера (капча),
 * без ключа консьерж выставляет модалку; safe-бронирование требует
 * артефактов (strange-watch в инвентаре, radio в lost & found),
 * номер 1408 и мини-бар, но НЕ термо-процедуры.
 */
const chain = loadCatalogChain('5');

function tempForm(overrides: Partial<TempBookingFormData> = {}): TempBookingFormData {
  return {
    guests: 1,
    rooms: 1,
    roomType: 'room-1408',
    checkInDate: null,
    checkOutDate: null,
    mealType: 'mini-bar-whiskey',
    needTransfer: false,
    checkInTime: '14:00',
    selectedServices: [],
    ...overrides,
  };
}

function progress(overrides: Partial<CurrentHotelProgress> = {}): CurrentHotelProgress {
  return {
    lostAndFoundItems: ['radio'],
    tempBookingForm: tempForm(),
    ...overrides,
  } as CurrentHotelProgress;
}

describe('Dolphin — консьерж запирает бронирование ключом', () => {
  it('book-now-btn без room-key ведёт на шаг conciergeRequired', () => {
    const action = chainAction(chain, 'hotelPage', 'book-now-btn');
    const result = resolveActionTarget({ action, inventory: [], progress: null });
    expect(result.nextStep).toBe('conciergeRequired');
    expect(result.modal).toBeNull();
  });

  it('шаг conciergeRequired открывает модалку, не покидая hotelPage', () => {
    const result = resolveChainTarget({
      chain,
      currentStepId: 'hotelPage',
      nextStepId: 'conciergeRequired',
    });
    expect(result.activeStep).toBe('hotelPage');
    expect(result.activeModal?.id).toBe('concierge-required');
  });

  it('book-now-btn c room-key в инвентаре открывает форму бронирования', () => {
    const action = chainAction(chain, 'hotelPage', 'book-now-btn');
    const result = resolveActionTarget({ action, inventory: ['room-key'], progress: null });
    expect(result.nextStep).toBe('bookingForm');
    expect(result.modal).toBeNull();
  });

  it('у Dolphin выбор номера тоже требует ключа — ведёт к консьержу', () => {
    // Контраст со Stay-Ceil: там room-card-book пустает сразу в bookingForm.
    const action = chainAction(chain, 'roomCard', 'room-card-book');
    const result = resolveActionTarget({ action, inventory: [], progress: null });
    expect(result.nextStep).toBe('conciergeRequired');
  });

  it('провал капчи — модалка captcha-fail с возвратом на главную', () => {
    const result = resolveChainTarget({
      chain,
      currentStepId: 'hotelPage',
      nextStepId: 'captchaFail',
    });
    expect(result.activeStep).toBe('hotelPage');
    expect(result.activeModal?.id).toBe('captcha-fail');
    expect(result.activeModal?.nextStep).toBe('homePage');
  });

  it('успешная капча выдаёт room-key в инвентарь (params, а не модалка)', () => {
    const transitions = chainStep(chain, 'captcha').transitions!;
    expect(transitions.success.nextStep).toBe('hotelPage');
    expect(transitions.success.params?.addToInventory).toBe('room-key');
  });
});

describe('Dolphin — safe-бронирование требует артефакты и правильный номер', () => {
  const submitSafe = chainStep(chain, 'bookingForm').transitions!.submitSafe;

  it('странная форма + radio из lost & found + номер 1408 + мини-бар = safe', () => {
    const matched = evaluateConditions(submitSafe.conditions, ['strange-watch'], progress());
    expect(matched).toBe(true);
    // Ветка submitSafe помечает бронирование как безопасное
    expect(submitSafe.params?.bookingResult).toBe('safe');
  });

  it('без strange-watch в инвентаре safe-ветка не срабатывает', () => {
    const matched = evaluateConditions(submitSafe.conditions, [], progress());
    expect(matched).toBe(false);
  });

  it('radio должен быть найден в lost & found, инвентаря недостаточно', () => {
    const matched = evaluateConditions(
      submitSafe.conditions,
      ['strange-watch', 'radio'],
      progress({ lostAndFoundItems: [] })
    );
    expect(matched).toBe(false);
  });

  it('термо-процедура в доп. услугах ломает safe-ветку → небезопасно', () => {
    const matched = evaluateConditions(
      submitSafe.conditions,
      ['strange-watch'],
      progress({ tempBookingForm: tempForm({ selectedServices: ['thermal-treatment'] }) })
    );
    expect(matched).toBe(false);
    // Fallback-ветка submitUnsafe без условий помечает как unsafe
    const submitUnsafe = chainStep(chain, 'bookingForm').transitions!.submitUnsafe;
    expect(evaluateConditions(submitUnsafe.conditions, ['strange-watch'], progress())).toBe(true);
    expect(submitUnsafe.params?.bookingResult).toBe('unsafe');
  });

  it('чужой тип номера (не 1408) — тоже небезопасное бронирование', () => {
    const matched = evaluateConditions(
      submitSafe.conditions,
      ['strange-watch'],
      progress({ tempBookingForm: tempForm({ roomType: 'paradis-suite' }) })
    );
    expect(matched).toBe(false);
  });

  it('safe-бронирование открывает призовую модалку', () => {
    const prizeEntry = chainStep(chain, 'prizeModal').conditions ?? [];
    expect(evaluateConditions(prizeEntry, ['strange-watch'], progress({ bookingResult: 'safe' }))).toBe(true);
    expect(evaluateConditions(prizeEntry, ['strange-watch'], progress({ bookingResult: 'unsafe' }))).toBe(false);
  });
});
