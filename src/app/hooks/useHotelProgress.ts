import { useCallback, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type {
  TempBookingFormData,
  LockedFormField,
  InitialBookingState,
  Chain,
} from '../data/hotels-data/hotelTypes';

// Import chains to derive the current chain
import { stayCeilChain } from '../data/hotels-data/stay-ceil-data';
import { continentalChain } from '../data/hotels-data/ny-continental-data';
import { lastPeakChain } from '../data/hotels-data/last-peak-data';
import { usherChain } from '../data/hotels-data/raven-usher-data';
import { soldierChain } from '../data/hotels-data/soldier-data';
import { overluxChain } from '../data/hotels-data/overlux-data';

// Function to get the chain from hotel data
function getChainForHotel(hotelId: string): Chain | null {
  if (hotelId === '10') return stayCeilChain;
  if (hotelId === '1') return continentalChain;
  if (hotelId === '2') return overluxChain;
  if (hotelId === '8') return lastPeakChain;
  if (hotelId === '9') return usherChain;
  if (hotelId === '7') return soldierChain;
  return null;
}

const evaluateConditions = (
  conditions: any[],
  inventory: string[],
  tempBookingForm: TempBookingFormData | null | undefined
): boolean => {
  if (!conditions || conditions.length === 0) {
    return true; // No conditions means they are met
  }

  return conditions.every((condition) => {
    const { field, operator, value } = condition;

    switch (field) {
      case 'inventory':
        if (operator === 'contains') return inventory.includes(value as string);
        if (operator === 'not-contains') return !inventory.includes(value as string);
        break;
      case 'roomType':
        if (tempBookingForm?.roomType) {
          if (operator === 'eq') return tempBookingForm.roomType === value;
          if (operator === 'ne') return tempBookingForm.roomType !== value;
        }
        return false; // Return false if roomType is not available on temp form
      // TODO: Add cases for other fields like 'season' if needed
      default:
        return false; // Field not supported
    }
    return false; // Operator not supported for this field
  });
};

export function useHotelProgress(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress } = useGame();
  const currentProgress = playerStatus.currentHotelProgress;
  const inventory = playerStatus.inventory;
  const chain = hotelId ? getChainForHotel(hotelId) : null;

  const activeBookingStateAndLocks = useMemo(() => {
    if (!hotel || !currentProgress || currentProgress.hotelId !== hotel.id.toString()) {
      return {
        lockedFields: [] as LockedFormField[],
        stateName: 'initialBookingState',
        baseState: {},
      };
    }

    const activeStepId = currentProgress?.activeStep;
    const currentStep = activeStepId && chain ? chain.steps[activeStepId] : null;
    const formConfig = currentStep?.formConfig;

    let baseState: Partial<InitialBookingState> = {};
    let stateName = 'initialBookingState';

    // New logic: Use formConfig if it exists
    if (formConfig && hotel.bookingStates) {
      baseState = hotel.bookingStates[formConfig.initialStateId] ?? {};
      stateName = formConfig.initialStateId;

      if (formConfig.conditionalStates) {
        for (const condState of formConfig.conditionalStates) {
          const conditionMet = evaluateConditions(
            condState.condition,
            inventory,
            currentProgress?.tempBookingForm
          );

          if (conditionMet) {
            baseState = { ...baseState, ...hotel.bookingStates[condState.stateId] };
            stateName = condState.stateId;
            break;
          }
        }
      }
    } else {
      // Fallback to old logic
      const formDataCond = hotel.bookingFormDataConditions;
      baseState = hotel.initialBookingState ?? {};
      if (formDataCond) {
        let conditionMet = false;
        if (formDataCond.conditionType === 'floorSelected') {
          conditionMet = currentProgress?.floorSelected ?? false;
        }
        if (conditionMet && hotel.anotherBookingState) {
          stateName = 'anotherBookingState';
          baseState = { ...hotel.initialBookingState, ...hotel.anotherBookingState };
        }
      }
    }

    // @ts-ignore
    let lockedFields = baseState.lockedFields ?? [];

    // Coin-based unlock for NY-Continental
    const hasCoin = inventory?.includes('gold-coin') ?? false;
    if (hasCoin) {
      lockedFields = lockedFields.filter((f: LockedFormField) => f !== 'paymentMethod');
    }

    console.log('[useHotelProgress] Step:', activeStepId, 'State Name:', stateName, 'Base State:', baseState, 'Locked Fields:', lockedFields);

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
      const newTempForm: TempBookingFormData = {
        ...(currentProgress.tempBookingForm as TempBookingFormData),
        roomType,
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
