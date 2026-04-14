import { useCallback, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type { TempBookingFormData } from '../data/hotels-data/hotelTypes';

export function useHotelProgress(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress } = useGame();
  const currentProgress = playerStatus.currentHotelProgress;

  const defaultBookingState = useMemo(() => {
    if (!hotel?.initialBookingState) return null;
    const base = hotel.initialBookingState;
    const roomType = base.roomType ?? hotel.roomTypes?.[0]?.value ?? '';

    // Поддержка dateRange: маппим на checkInDate/checkOutDate
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
      },
    };
  }, [hotel]);

  const computeRoomNumber = useCallback(
    (floor: number, roomType: string) => {
      const template = hotel?.initialBookingState?.roomNumberTemplate ?? '{floor}{suffix}';
      const suffix = hotel?.initialBookingState?.suffixByRoomType?.[roomType] ?? '';
      return template.replace('{floor}', String(floor)).replace('{suffix}', suffix);
    },
    [hotel]
  );

  const floor = currentProgress?.floor ?? defaultBookingState?.floor ?? 14;
  const roomType =
    currentProgress?.tempBookingForm?.roomType ?? defaultBookingState?.roomType ?? '';
  const roomNumber = currentProgress?.roomNumber ?? computeRoomNumber(floor, roomType);
  const tempBookingForm = currentProgress?.tempBookingForm ?? defaultBookingState?.tempBookingForm;

  // Обновление этажа
  const setFloor = useCallback(
    (floor: number) => {
      if (!hotelId) return;
      const roomNumber = computeRoomNumber(floor, roomType);
      setCurrentHotelProgress({
        hotelId,
        tempBookingForm: currentProgress?.tempBookingForm ?? null,
        floor,
        roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
        currentChain: currentProgress?.currentChain ?? [],
        activeStep: currentProgress?.activeStep ?? 'hotelPage',
        currentChainIndex: currentProgress?.currentChainIndex ?? 0,
        chainType: currentProgress?.chainType ?? 'standard',
        galleryStates: currentProgress?.galleryStates ?? {},
        galleryActionsTriggered: currentProgress?.galleryActionsTriggered ?? {},
        captchaCompleted: currentProgress?.captchaCompleted ?? false,
        floorSelected: currentProgress?.floorSelected ?? false,
        completedSteps: currentProgress?.completedSteps ?? [],
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
        ...currentProgress.tempBookingForm,
        roomType,
      } as TempBookingFormData;
      setCurrentHotelProgress({
        hotelId,
        tempBookingForm: newTempForm,
        floor: currentProgress.floor,
        roomNumber,
        startedAt: currentProgress.startedAt,
        currentChain: currentProgress.currentChain,
        activeStep: currentProgress.activeStep,
        currentChainIndex: currentProgress.currentChainIndex,
        chainType: currentProgress.chainType,
        galleryStates: currentProgress.galleryStates,
        galleryActionsTriggered: currentProgress.galleryActionsTriggered,
        captchaCompleted: currentProgress.captchaCompleted,
        floorSelected: currentProgress.floorSelected,
        completedSteps: currentProgress.completedSteps,
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
        hotelId,
        tempBookingForm,
        floor: currentProgress.floor,
        roomNumber,
        startedAt: currentProgress.startedAt,
        currentChain: currentProgress.currentChain,
        activeStep: currentProgress.activeStep,
        currentChainIndex: currentProgress.currentChainIndex,
        chainType: currentProgress.chainType,
        galleryStates: currentProgress.galleryStates,
        galleryActionsTriggered: currentProgress.galleryActionsTriggered,
        captchaCompleted: currentProgress.captchaCompleted,
        floorSelected: currentProgress.floorSelected,
        completedSteps: currentProgress.completedSteps,
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
    setFloor,
    setRoomType,
    setTempBookingForm,
  };
}
