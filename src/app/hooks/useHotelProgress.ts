import { useCallback, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type {
  TempBookingFormData,
  LockedFormField,
  InitialBookingState,
} from '../data/hotels-data/hotelTypes';

import { getChainForHotel } from '../utils/getChainForHotel';
import { evaluateConditions } from '../utils/evaluateConditions';

export function useHotelProgress(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress } = useGame();
  const currentProgress = playerStatus.currentHotelProgress;
  const inventory = playerStatus.inventory;
  const chain = hotelId ? getChainForHotel(hotelId) : null;

  const activeBookingStateAndLocks = useMemo(() => {
    if (!hotel || !currentProgress || !chain || currentProgress.hotelId !== hotel.id.toString()) {
      return {
        lockedFields: [] as LockedFormField[],
        stateName: 'initial',
        baseState: {},
      };
    }

    const activeStepId = currentProgress?.activeStep;
    const currentStep = activeStepId ? chain.steps[activeStepId] : null;
    const formConfig = currentStep?.formConfig;

    let baseState: Partial<InitialBookingState> = {};
    let stateName = 'initial';

    if (formConfig && hotel.bookingStates) {
      baseState = hotel.bookingStates[formConfig.initialStateId] ?? {};
      stateName = formConfig.initialStateId;

      if (formConfig.conditionalStates) {
        for (const condState of formConfig.conditionalStates) {
          const conditionMet = evaluateConditions(condState.condition, inventory, currentProgress);

          if (conditionMet) {
            baseState = { ...baseState, ...hotel.bookingStates[condState.stateId] };
            stateName = condState.stateId;
            break;
          }
        }
      }
    }

    let lockedFields = (baseState as InitialBookingState).lockedFields ?? [];

    // Coin-based unlock for NY-Continental
    const hasCoin = inventory?.includes('gold-coin') ?? false;
    if (hasCoin) {
      lockedFields = lockedFields.filter((f) => f !== 'paymentMethod');
    }

    console.log(
      '[useHotelProgress] Step:',
      activeStepId,
      'State Name:',
      stateName,
      'Base State:',
      baseState,
      'Locked Fields:',
      lockedFields
    );

    return { lockedFields, stateName, baseState };
  }, [hotel, chain, currentProgress, inventory]);

  const defaultBookingState = useMemo(() => {
    const base = activeBookingStateAndLocks.baseState;
    if (!base) return null;

    const roomType = base.roomType ?? hotel?.roomTypes?.[0]?.value ?? '';

    let checkInDate = base.checkInDate ?? null;
    let checkOutDate = base.checkOutDate ?? null;
    if (base.dateRange && (!checkInDate || !checkOutDate)) {
      checkInDate = checkInDate ?? base.dateRange.from;
      checkOutDate = checkOutDate ?? base.dateRange.to;
    }

    return {
      floor: base.defaultFloor ?? 14,
      roomType,
      tempBookingForm: {
        guests: base.guests ?? 1,
        rooms: base.rooms ?? 1,
        roomType,
        checkInDate,
        checkOutDate,
        mealType: base.mealType ?? '',
        needTransfer: base.needTransfer ?? false,
        checkInTime: base.checkInTime ?? '14:00',
        selectedServices: base.selectedServices ?? [],
        promoCode: base.promoCode,
        paymentMethod: base.paymentMethod as 'cash' | 'card' | undefined,
      },
    };
  }, [hotel, activeBookingStateAndLocks]);

  const computeRoomNumber = useCallback(
    (floor: number, roomType: string) => {
      const { baseState } = activeBookingStateAndLocks;
      const template = baseState?.roomNumberTemplate ?? '{floor}{suffix}';
      const suffix = baseState?.suffixByRoomType?.[roomType] ?? '';
      return template.replace('{floor}', String(floor)).replace('{suffix}', suffix);
    },
    [activeBookingStateAndLocks]
  );

  const floor = currentProgress?.floor ?? defaultBookingState?.floor ?? 14;
  const roomType =
    currentProgress?.tempBookingForm?.roomType ?? defaultBookingState?.roomType ?? '';
  const roomNumber = currentProgress?.roomNumber ?? computeRoomNumber(floor, roomType);
  const tempBookingForm = currentProgress?.tempBookingForm ?? defaultBookingState?.tempBookingForm;
  const lockedFields = activeBookingStateAndLocks.lockedFields;

  // Обновление этажа
  const setFloor = useCallback(
    (floor: number) => {
      if (!hotelId || !currentProgress) return;
      const roomNumber = computeRoomNumber(floor, roomType);
      setCurrentHotelProgress({
        ...currentProgress,
        hotelId,
        floor,
        roomNumber,
      });
    },
    [hotelId, currentProgress, roomType, computeRoomNumber, setCurrentHotelProgress]
  );

  // Обновление roomType
  const setRoomType = useCallback(
    (roomType: string) => {
      if (!hotelId || !currentProgress) return;
      const roomNumber = computeRoomNumber(
        currentProgress?.floor ?? defaultBookingState?.floor ?? 14,
        roomType
      );
      const existingForm = currentProgress.tempBookingForm || defaultBookingState?.tempBookingForm;
      const newTempForm: TempBookingFormData = {
        guests: existingForm?.guests ?? 1,
        rooms: existingForm?.rooms ?? 1,
        roomType,
        checkInDate: existingForm?.checkInDate ?? null,
        checkOutDate: existingForm?.checkOutDate ?? null,
        mealType: existingForm?.mealType ?? '',
        needTransfer: existingForm?.needTransfer ?? false,
        checkInTime: existingForm?.checkInTime ?? '14:00',
        selectedServices: existingForm?.selectedServices ?? [],
        promoCode: existingForm?.promoCode,
        paymentMethod: existingForm?.paymentMethod,
      };
      setCurrentHotelProgress({
        ...currentProgress,
        hotelId,
        tempBookingForm: newTempForm,
        roomNumber,
      });
    },
    [hotelId, currentProgress, computeRoomNumber, setCurrentHotelProgress, defaultBookingState]
  );

  // Обновление tempBookingForm
  const setTempBookingForm = useCallback(
    (tempBookingForm: TempBookingFormData) => {
      if (!hotelId || !currentProgress) return;
      const roomType = tempBookingForm.roomType || currentProgress.tempBookingForm?.roomType || '';
      const roomNumber = computeRoomNumber(
        currentProgress?.floor ?? defaultBookingState?.floor ?? 14,
        roomType
      );
      setCurrentHotelProgress({
        ...currentProgress,
        hotelId,
        tempBookingForm,
        roomNumber,
      });
    },
    [hotelId, currentProgress, computeRoomNumber, setCurrentHotelProgress, defaultBookingState]
  );

  return {
    hotel,
    floor,
    roomNumber,
    roomType,
    tempBookingForm,
    lockedFields,
    setFloor,
    setRoomType,
    setTempBookingForm,
  };
}
