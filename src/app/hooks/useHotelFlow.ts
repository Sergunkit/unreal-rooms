import { useCallback, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type { ChainStep } from '../data/hotels-data/hotelTypes';

export type FlowStep = ChainStep;

export interface FlowState {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
  galleryStates: Record<number, boolean>; // imageIndex -> toggled
  galleryActionsTriggered: Record<number, boolean>; // imageIndex -> action triggered for current state
  captchaCompleted: boolean;
  floorSelected: boolean;
  currentChain: ChainStep[];
  currentChainIndex: number;
  activeChainType: 'standard' | 'custom' | 'action';
}

export function useHotelFlow(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress, updateCaptchaProgress } = useGame();

  const currentProgress = playerStatus.currentHotelProgress;

  // Определяем цепочку: кастомная, стандартная или action
  const getChain = useMemo((): { chain: ChainStep[], type: 'standard' | 'custom' | 'action' } => {
    if (hotel?.customBookingChain) {
      return { chain: hotel.customBookingChain.steps, type: 'custom' };
    }
    // Стандартная цепочка
    return {
      chain: ['hotelPage', 'bookingForm', 'bookingConfirm', 'bookingComplete', 'prizeModal', 'myBookingsPage'],
      type: 'standard'
    };
  }, [hotel]);

  // Начальный шаг на основе цепочки
  const initialStep: FlowStep = useMemo(() => {
    return getChain.chain[0] || 'gallery';
  }, [getChain]);

  // Текущее состояние потока
  const flowState: FlowState = useMemo(() => {
    const progress = currentProgress;
    const chainData = getChain;
    return {
      currentStep: progress?.flowState?.currentStep ?? initialStep,
      completedSteps: progress?.flowState?.completedSteps ?? [],
      galleryStates: progress?.flowState?.galleryStates ?? {},
      galleryActionsTriggered: progress?.flowState?.galleryActionsTriggered ?? {},
      captchaCompleted: progress?.flowState?.captchaCompleted ?? false,
      floorSelected: progress?.flowState?.floorSelected ?? false,
      currentChain: progress?.flowState?.currentChain ?? chainData.chain,
      currentChainIndex: progress?.flowState?.currentChainIndex ?? 0,
      activeChainType: progress?.flowState?.activeChainType ?? chainData.type,
    };
  }, [currentProgress, initialStep, getChain]);

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
        currentChain: currentProgress?.flowState?.currentChain ?? getChain.chain,
        currentChainIndex: currentProgress?.flowState?.currentChainIndex ?? 0,
        activeChainType: currentProgress?.flowState?.activeChainType ?? getChain.type,
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

  // Переход к следующему шагу в цепочке
  const nextChainStep = useCallback(() => {
    const nextIndex = flowState.currentChainIndex + 1;
    if (nextIndex < flowState.currentChain.length) {
      const nextStep = flowState.currentChain[nextIndex];
      updateFlowState({
        currentStep: nextStep,
        currentChainIndex: nextIndex,
        completedSteps: [...flowState.completedSteps, nextStep],
      });
    }
  }, [flowState, updateFlowState]);

  // Запуск actionChain
  const startActionChain = useCallback((actionChain: ChainStep[]) => {
    updateFlowState({
      currentChain: actionChain,
      currentChainIndex: 0,
      currentStep: actionChain[0],
      activeChainType: 'action',
    });
  }, [updateFlowState]);

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
              nextChainStep();
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

        // Если есть actionChain, запускаем её
        if (action.actionChain) {
          startActionChain(action.actionChain.steps);
        }
      }

      if (Object.keys(updates).length > 0) {
        updateFlowState(updates);
      }

      // Возвращаем, нужно ли показать сообщение или выполнить действие
      return shouldTriggerAction ? action : null;
    },
    [hotel, flowState.galleryStates, flowState.galleryActionsTriggered, updateFlowState, startActionChain]
  );

  // Обработка успешной captcha
  const handleCaptchaSuccess = useCallback(
    (sequence: string[]) => {
      updateCaptchaProgress(sequence, new Date().toISOString());
      updateFlowState({ captchaCompleted: true });

      // Если есть floorOptions, переходим к floor-select
      if (hotel?.initialBookingState?.floorOptions) {
        nextChainStep();
      } else {
        nextChainStep();
      }
    },
    [updateCaptchaProgress, updateFlowState, nextChainStep, hotel]
  );

  // Обработка выбора этажа
  const handleFloorSelect = useCallback(
    (floor: number) => {
      updateFlowState({ floorSelected: true });
      nextChainStep();

      // Обновляем floor в прогрессе
      setCurrentHotelProgress({
        hotelId: hotelId ?? '',
        tempBookingForm: currentProgress?.tempBookingForm ?? null,
        floor,
        roomNumber: currentProgress?.roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
        flowState: { ...flowState, floorSelected: true, currentStep: 'bookingForm' },
      });
    },
    [updateFlowState, nextChainStep, setCurrentHotelProgress, hotelId, currentProgress, flowState]
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
    nextChainStep,
  };
}
