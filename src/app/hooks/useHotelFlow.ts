import { useCallback, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';

export type FlowStep = 'gallery' | 'captcha' | 'floor-select' | 'booking';

export interface FlowState {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
  galleryStates: Record<number, boolean>; // imageIndex -> toggled
  galleryActionsTriggered: Record<number, boolean>; // imageIndex -> action triggered for current state
  captchaCompleted: boolean;
  floorSelected: boolean;
}

export function useHotelFlow(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress, updateCaptchaProgress } = useGame();

  const currentProgress = playerStatus.currentHotelProgress;

  // Определяем начальный шаг на основе данных отеля
  const initialStep: FlowStep = useMemo(() => {
    if (!hotel) return 'gallery';

    // Если есть galleryActions, начинаем с gallery
    if (hotel.galleryActions && hotel.galleryActions.length > 0) {
      return 'gallery';
    }

    // Иначе сразу к бронированию
    return 'booking';
  }, [hotel]);

  // Текущее состояние потока
  const flowState: FlowState = useMemo(() => {
    const progress = currentProgress;
    return {
      currentStep: progress?.flowState?.currentStep ?? initialStep,
      completedSteps: progress?.flowState?.completedSteps ?? [],
      galleryStates: progress?.flowState?.galleryStates ?? {},
      galleryActionsTriggered: progress?.flowState?.galleryActionsTriggered ?? {},
      captchaCompleted: progress?.flowState?.captchaCompleted ?? false,
      floorSelected: progress?.flowState?.floorSelected ?? false,
    };
  }, [currentProgress, initialStep]);

  // Обновление состояния потока
  const updateFlowState = useCallback(
    (updates: Partial<FlowState>) => {
      if (!hotelId) return;

      const currentFlowState = {
        currentStep: currentProgress?.flowState?.currentStep ?? initialStep,
        completedSteps: currentProgress?.flowState?.completedSteps ?? [],
        galleryStates: currentProgress?.flowState?.galleryStates ?? {},
        galleryActionsTriggered: currentProgress?.flowState?.galleryActionsTriggered ?? {},
        captchaCompleted: currentProgress?.flowState?.captchaCompleted ?? false,
        floorSelected: currentProgress?.flowState?.floorSelected ?? false,
      };
      const newFlowState = { ...currentFlowState, ...updates };
      setCurrentHotelProgress({
        hotelId,
        tempBookingForm: currentProgress?.tempBookingForm ?? null,
        floor: currentProgress?.floor,
        roomNumber: currentProgress?.roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
        flowState: newFlowState,
      });
    },
    [hotelId, currentProgress, initialStep, setCurrentHotelProgress]
  );

  // Переход к следующему шагу
  const nextStep = useCallback(
    (step: FlowStep) => {
      const completedSteps = [...flowState.completedSteps];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }

      updateFlowState({
        currentStep: step,
        completedSteps,
      });
    },
    [flowState.completedSteps, updateFlowState]
  );

  // Обработка клика по галерее
  const handleGalleryClick = useCallback(
    (imageIndex: number, coords?: { x: number; y: number }) => {
      const action = hotel?.galleryActions?.find((a) => a.imageIndex === imageIndex);
      if (!action) return;

      const isTriggered = flowState.galleryActionsTriggered[imageIndex] ?? false;

      let shouldToggle = false;
      let shouldTriggerAction = false;

      if (action.type === 'toggle') {
        shouldToggle = true;
        shouldTriggerAction = true; // Для toggle действие - переключение, всегда
      } else if (action.type === 'hint' || action.type === 'artifact-find') {
        if (coords && action.coords) {
          const { x1, x2, y1, y2 } = action.coords;
          if (coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2) {
            shouldToggle = true;
            shouldTriggerAction = !isTriggered;
          }
        }
      } else if (action.type === 'capcha-get') {
        if (coords && action.coords) {
          const { x1, x2, y1, y2 } = action.coords;
          if (coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2) {
            shouldTriggerAction = !isTriggered;
            if (shouldTriggerAction) {
              nextStep('captcha');
            }
          }
        }
      }

      const updates: Partial<FlowState> = {};

      if (shouldToggle) {
        const newGalleryStates = {
          ...flowState.galleryStates,
          [imageIndex]: !flowState.galleryStates[imageIndex],
        };
        updates.galleryStates = newGalleryStates;
        // При toggle сбрасываем triggered, чтобы действие можно было выполнить снова
        const newTriggered = { ...flowState.galleryActionsTriggered };
        delete newTriggered[imageIndex];
        updates.galleryActionsTriggered = newTriggered;
      }

      if (shouldTriggerAction) {
        updates.galleryActionsTriggered = {
          ...flowState.galleryActionsTriggered,
          [imageIndex]: true,
        };
      }

      if (Object.keys(updates).length > 0) {
        updateFlowState(updates);
      }

      // Возвращаем, нужно ли показать сообщение или выполнить действие
      return shouldTriggerAction ? action : null;
    },
    [hotel, flowState.galleryStates, flowState.galleryActionsTriggered, updateFlowState, nextStep]
  );

  // Обработка успешной captcha
  const handleCaptchaSuccess = useCallback(
    (sequence: string[]) => {
      updateCaptchaProgress(sequence, new Date().toISOString());
      updateFlowState({ captchaCompleted: true });

      // Если есть floorOptions, переходим к floor-select
      if (hotel?.initialBookingState?.floorOptions) {
        nextStep('floor-select');
      } else {
        nextStep('booking');
      }
    },
    [updateCaptchaProgress, updateFlowState, nextStep, hotel]
  );

  // Обработка выбора этажа
  const handleFloorSelect = useCallback(
    (floor: number) => {
      updateFlowState({ floorSelected: true });
      nextStep('booking');

      // Обновляем floor в прогрессе
      setCurrentHotelProgress({
        hotelId: hotelId ?? '',
        tempBookingForm: currentProgress?.tempBookingForm ?? null,
        floor,
        roomNumber: currentProgress?.roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
        flowState: { ...flowState, floorSelected: true, currentStep: 'booking' },
      });
    },
    [updateFlowState, nextStep, setCurrentHotelProgress, hotelId, currentProgress, flowState]
  );

  // Проверка, можно ли бронировать
  const canBook = useMemo(() => {
    if (!hotel) return false;

    // Проверяем условия passingConditions
    const conditions = hotel.passingConditions;
    if (!conditions) return true;

    const tempForm = currentProgress?.tempBookingForm;
    if (!tempForm) return false;

    const hasRoom = !conditions.roomId || tempForm.roomType === conditions.roomId;
    const hasMeal = !conditions.mealTypes || conditions.mealTypes.includes(tempForm.mealType || '');
    const hasService =
      !conditions.additionalServices ||
      conditions.additionalServices.every((s) => tempForm.selectedServices?.includes(s));
    const hasInventory =
      !conditions.inventory ||
      conditions.inventory.every((i) => playerStatus.inventory.includes(i));
    const hasPromoCode =
      !conditions.promoCode ||
      tempForm.promoCode?.toUpperCase() === conditions.promoCode.toUpperCase();

    // Проверяем wrongOptions
    const wrongOptions = hotel.wrongOptions;
    const hasWrongOptions =
      wrongOptions?.additionalServices?.some((s) => tempForm.selectedServices?.includes(s)) ??
      false;

    return hasRoom && hasMeal && hasService && hasInventory && hasPromoCode && !hasWrongOptions;
  }, [hotel, currentProgress, playerStatus.inventory]);

  return {
    flowState,
    initialStep,
    handleGalleryClick,
    handleCaptchaSuccess,
    handleFloorSelect,
    canBook,
    nextStep,
  };
}
