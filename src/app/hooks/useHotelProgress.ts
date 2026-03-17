import { useCallback, useEffect, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame, type TempBookingFormData } from '../contexts/GameContext';

export function useHotelProgress(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress } = useGame();

  const currentProgress = playerStatus.currentHotelProgress;

  const defaultBookingState = useMemo(() => {
    if (!hotel?.initialBookingState) return null;

    const base = hotel.initialBookingState;
    const roomType = base.roomType ?? hotel.roomTypes?.[0]?.value ?? '';

    const tempBookingForm: TempBookingFormData = {
      guests: base.guests ?? 1,
      rooms: base.rooms ?? 1,
      roomType,
      checkInDate: base.checkInDate ?? null,
      checkOutDate: base.checkOutDate ?? null,
      mealType: base.mealType ?? '',
      needTransfer: base.needTransfer ?? false,
      checkInTime: base.checkInTime ?? '14:00',
      selectedServices: base.selectedServices ?? [],
      promoCode: base.promoCode,
    };

    return {
      floor: base.defaultFloor ?? 14,
      roomType,
      tempBookingForm,
    };
  }, [hotel]);

  const getBookingFormState = useMemo(() => {
    if (!hotel?.bookingFormDataConditions) return defaultBookingState?.tempBookingForm;

    const conditions = hotel.bookingFormDataConditions;
    const progress = currentProgress;

    // Проверяем условия
    let stateKey: string;
    if (conditions.conditionType === 'floorSelected' && progress?.floor !== undefined) {
      stateKey = conditions.conditionsIsDone;
    } else {
      stateKey = conditions.conditionsNotDone;
    }

    const stateData = (hotel as any)[stateKey];
    if (!stateData) return defaultBookingState?.tempBookingForm;

    // Преобразуем в TempBookingFormData
    const roomType = stateData.roomType ?? hotel.roomTypes?.[0]?.value ?? '';
    return {
      guests: stateData.guests ?? 1,
      rooms: stateData.rooms ?? 1,
      roomType,
      checkInDate: stateData.checkInDate ?? null,
      checkOutDate: stateData.checkOutDate ?? null,
      mealType: stateData.mealType ?? '',
      needTransfer: stateData.needTransfer ?? false,
      checkInTime: stateData.checkInTime ?? '14:00',
      selectedServices: stateData.selectedServices ?? [],
      promoCode: stateData.promoCode,
    };
  }, [hotel, currentProgress, defaultBookingState]);

  const computeRoomNumber = useCallback(
    (floor: number, roomType: string) => {
      const template = hotel?.initialBookingState?.roomNumberTemplate ?? '{floor}{suffix}';
      const suffix = hotel?.initialBookingState?.suffixByRoomType?.[roomType] ?? '';
      return template.replace('{floor}', String(floor)).replace('{suffix}', suffix);
    },
    [hotel]
  );

  const progressFloor = currentProgress?.floor ?? defaultBookingState?.floor ?? 14;
  const progressRoomType =
    currentProgress?.tempBookingForm?.roomType ?? defaultBookingState?.roomType ?? '';
  const progressRoomNumber =
    currentProgress?.roomNumber ?? computeRoomNumber(progressFloor, progressRoomType);

  const tempBookingForm = useMemo(() => {
    if (currentProgress?.tempBookingForm) return currentProgress.tempBookingForm;
    return getBookingFormState;
  }, [currentProgress, getBookingFormState]);

  const ensureProgress = useCallback(() => {
    if (!hotel || !defaultBookingState) return;

    const floor = progressFloor;
    const roomType = progressRoomType;
    const roomNumber = computeRoomNumber(floor, roomType);
    const tempBookingForm = currentProgress?.tempBookingForm ?? defaultBookingState.tempBookingForm;

    const needUpdate =
      !currentProgress ||
      currentProgress.hotelId !== hotelId ||
      currentProgress.floor !== floor ||
      currentProgress.roomNumber !== roomNumber ||
      JSON.stringify(currentProgress.tempBookingForm) !== JSON.stringify(tempBookingForm);

    if (needUpdate) {
      setCurrentHotelProgress({
        hotelId: hotelId ?? '',
        tempBookingForm,
        floor,
        roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
      });
    }
  }, [
    hotel,
    hotelId,
    currentProgress,
    defaultBookingState,
    computeRoomNumber,
    progressFloor,
    progressRoomType,
    setCurrentHotelProgress,
  ]);

  useEffect(() => {
    ensureProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensureProgress]);

  const setFloor = useCallback(
    (floor: number) => {
      if (!hotel || !defaultBookingState) return;
      const roomType = progressRoomType;
      const roomNumber = computeRoomNumber(floor, roomType);

      setCurrentHotelProgress({
        hotelId: hotelId ?? '',
        tempBookingForm: currentProgress?.tempBookingForm ?? defaultBookingState.tempBookingForm,
        floor,
        roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
      });
    },
    [
      hotel,
      hotelId,
      currentProgress,
      defaultBookingState,
      progressRoomType,
      computeRoomNumber,
      setCurrentHotelProgress,
    ]
  );

  const setRoomType = useCallback(
    (roomType: string) => {
      if (!hotel || !defaultBookingState) return;
      const floor = progressFloor;
      const roomNumber = computeRoomNumber(floor, roomType);
      const tempBookingForm: TempBookingFormData = {
        ...(currentProgress?.tempBookingForm ?? defaultBookingState.tempBookingForm),
        roomType,
      };

      setCurrentHotelProgress({
        hotelId: hotelId ?? '',
        tempBookingForm,
        floor,
        roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
      });
    },
    [
      hotel,
      hotelId,
      currentProgress,
      defaultBookingState,
      progressFloor,
      computeRoomNumber,
      setCurrentHotelProgress,
    ]
  );

  const setTempBookingForm = useCallback(
    (tempBookingForm: TempBookingFormData) => {
      if (!hotel || !defaultBookingState) return;

      const floor = progressFloor;
      const roomType = tempBookingForm.roomType || progressRoomType;
      const roomNumber = computeRoomNumber(floor, roomType);

      setCurrentHotelProgress({
        hotelId: hotelId ?? '',
        tempBookingForm,
        floor,
        roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
      });
    },
    [
      hotel,
      hotelId,
      currentProgress,
      defaultBookingState,
      progressFloor,
      progressRoomType,
      computeRoomNumber,
      setCurrentHotelProgress,
    ]
  );

  return {
    hotel,
    progress: currentProgress,
    floor: progressFloor,
    roomNumber: progressRoomNumber,
    tempBookingForm,
    setFloor,
    setRoomType,
    setTempBookingForm,
    computeRoomNumber,
  };
}
