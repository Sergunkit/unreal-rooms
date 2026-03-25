import { useCallback, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type {
  ChainStep,
  TransitionCondition,
  TempBookingFormData,
} from '../data/hotels-data/hotelTypes';

export type FlowStep = ChainStep;

export interface FlowState {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
  galleryStates: Record<number, boolean>;
  galleryActionsTriggered: Record<number, boolean>;
  captchaCompleted: boolean;
  floorSelected: boolean;
  currentChain: ChainStep[];
  currentChainIndex: number;
  activeChainType: 'standard' | 'custom' | 'action';
  captchaReason?: 'alien' | 'human';
}

const STANDARD_CHAIN: ChainStep[] = [
  'hotelPage',
  'bookingForm',
  'bookingConfirm',
  'bookingComplete',
  'prizeModal',
  'myBookingsPage',
];

export function useHotelFlow(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress } = useGame();
  const currentProgress = playerStatus.currentHotelProgress;

  // Определяем цепочку шагов
  const getChain = useMemo((): { chain: ChainStep[]; type: 'standard' | 'custom' | 'action' } => {
    if (hotel?.customBookingChain?.steps) {
      return { chain: hotel.customBookingChain.steps, type: 'custom' };
    }
    return { chain: STANDARD_CHAIN, type: 'standard' };
  }, [hotel]);

  const initialStep: FlowStep = useMemo(() => {
    return getChain.chain[0] || 'hotelPage';
  }, [getChain]);

  // Текущее состояние потока
  const flowState: FlowState = useMemo(() => {
    const progress = currentProgress;
    const chainData = getChain;

    // Не считаем mismatch, если активна action-цепочка (из gallery action)
    const isActionChain = progress?.flowState?.activeChainType === 'action';
    const isChainMismatch =
      !isActionChain &&
      progress?.flowState?.currentChain &&
      JSON.stringify(progress.flowState.currentChain) !== JSON.stringify(chainData.chain);

    return {
      currentStep: isChainMismatch
        ? chainData.chain[0]
        : (progress?.flowState?.currentStep ?? initialStep),
      completedSteps: isChainMismatch ? [] : (progress?.flowState?.completedSteps ?? []),
      galleryStates: progress?.flowState?.galleryStates ?? {},
      galleryActionsTriggered: progress?.flowState?.galleryActionsTriggered ?? {},
      captchaCompleted: progress?.flowState?.captchaCompleted ?? false,
      floorSelected: progress?.flowState?.floorSelected ?? false,
      // Сохраняем currentChain из progress, если активна action-цепочка
      currentChain: isActionChain
        ? (progress?.flowState?.currentChain ?? chainData.chain)
        : chainData.chain,
      currentChainIndex: isChainMismatch ? 0 : (progress?.flowState?.currentChainIndex ?? 0),
      activeChainType: progress?.flowState?.activeChainType ?? chainData.type,
      captchaReason: progress?.flowState?.captchaReason,
    };
  }, [currentProgress, initialStep, getChain]);

  // Обновление flowState — обновляет ТОЛЬКО flowState, не трогая другие данные
  const updateFlowState = useCallback(
    (updates: Partial<FlowState> & { floor?: number }) => {
      if (!hotelId) return;

      const currentFlowState = flowState;
      const { floor, ...flowUpdates } = updates;
      const newFlowState = { ...currentFlowState, ...flowUpdates };

      // Обновляем flowState и, если есть, floor, сохраняя все остальные данные
      setCurrentHotelProgress({
        hotelId,
        tempBookingForm: currentProgress?.tempBookingForm ?? null,
        floor: floor ?? currentProgress?.floor, // Use updates.floor if provided, otherwise existing
        roomNumber: currentProgress?.roomNumber,
        startedAt: currentProgress?.startedAt ?? new Date().toISOString(),
        flowState: newFlowState, // Correctly assign the merged flowState
      });
    },
    [hotelId, currentProgress, flowState, setCurrentHotelProgress]
  );

  // Переход к следующему шагу
  const nextChainStep = useCallback(
    (nextFloor?: number) => {
      const currentStep = flowState.currentStep;
      const currentIndex = flowState.currentChain.indexOf(currentStep);

      if (currentIndex === -1) {
        return;
      }

      // Если достигли конца action-цепочки, сбрасываем состояние
      if (
        currentIndex >= flowState.currentChain.length - 1 &&
        flowState.activeChainType === 'action'
      ) {
        // Завершаем action-цепочку и возвращаемся к нормальному состоянию
        updateFlowState({
          activeChainType: 'standard',
          currentStep: 'hotelPage',
          currentChain: [], // Очищаем цепочку
          currentChainIndex: 0,
          completedSteps: [],
          captchaCompleted: false,
          floorSelected: false,
        });
        return;
      }

      // Если не достигли конца цепочки, переходим к следующему шагу
      if (currentIndex < flowState.currentChain.length - 1) {
        const nextStepName = flowState.currentChain[currentIndex + 1];
        const updates: Partial<FlowState> = {
          currentStep: nextStepName,
          currentChainIndex: currentIndex + 1,
          completedSteps: [...flowState.completedSteps, nextStepName],
        };

        const updateObj: Partial<FlowState> & { floor?: number } = { ...updates };
        if (nextFloor !== undefined) {
          updateObj.floor = nextFloor;
        }

        updateFlowState(updateObj);
      }
    },
    [flowState, updateFlowState]
  );

  // Проверка условий перехода
  const checkTransitionCondition = useCallback(
    (
      condition: TransitionCondition,
      tempForm: TempBookingFormData | null | undefined,
      inventory: string[]
    ): { canProceed: boolean; reason?: 'alien' | 'wrong' | 'blocked' } => {
      if (!condition.requires) return { canProceed: true };

      const requires = condition.requires;
      let matches = true;

      if (requires.roomType && tempForm?.roomType !== requires.roomType) matches = false;
      if (requires.roomTypes && !requires.roomTypes.includes(tempForm?.roomType || ''))
        matches = false;
      if (requires.mealType && tempForm?.mealType !== requires.mealType) matches = false;
      if (requires.mealTypes && !requires.mealTypes.includes(tempForm?.mealType || ''))
        matches = false;
      if (
        requires.services &&
        requires.services.some((s) => !tempForm?.selectedServices?.includes(s))
      )
        matches = false;
      if (requires.inventory && requires.inventory.some((i) => !inventory.includes(i)))
        matches = false;

      if (matches) return { canProceed: true };
      if (condition.alternative) {
        return { canProceed: true, reason: condition.alternative.reason };
      }
      return { canProceed: false, reason: 'blocked' };
    },
    []
  );

  // Определение причины для капчи
  const determineCaptchaReason = useCallback(
    (fromStep: ChainStep): 'alien' | 'human' => {
      if (!hotel?.customBookingChain?.transitions?.[fromStep]) return 'human';

      const transition = hotel.customBookingChain.transitions[fromStep];
      const tempForm = currentProgress?.tempBookingForm as TempBookingFormData | undefined;
      const inventory = playerStatus.inventory;
      const result = checkTransitionCondition(transition, tempForm, inventory);

      return result.reason === 'alien' ? 'alien' : 'human';
    },
    [hotel, currentProgress, playerStatus.inventory, checkTransitionCondition]
  );

  // Обработка клика по галерее
  const handleGalleryClick = useCallback(
    (imageIndex: number, coords?: { x: number; y: number }) => {
      const action = hotel?.galleryActions?.find((a) => a.imageIndex === imageIndex);
      if (!action) {
        return null;
      }

      const isTriggered = flowState.galleryActionsTriggered[imageIndex] ?? false;
      let shouldToggle = false;
      let shouldTriggerAction = false;

      if (action.type === 'toggle') {
        shouldToggle = true;
        shouldTriggerAction = true;
      } else if (action.type === 'hint' || action.type === 'artifact-find') {
        if (coords && action.coords) {
          const { x1, x2, y1, y2 } = action.coords;
          const inRange = coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2;
          if (inRange) {
            shouldToggle = true;
            shouldTriggerAction = !isTriggered;
          }
        }
      } else if (action.type === 'capcha-get') {
        if (coords && action.coords) {
          const { x1, x2, y1, y2 } = action.coords;
          const inRange = coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2;
          if (inRange) {
            shouldTriggerAction = !isTriggered;
          }
        }
      }

      const updates: Partial<FlowState> = {};
      if (shouldToggle) {
        updates.galleryStates = {
          ...flowState.galleryStates,
          [imageIndex]: !flowState.galleryStates[imageIndex],
        };
        const newTriggered = { ...flowState.galleryActionsTriggered };
        delete newTriggered[imageIndex];
        updates.galleryActionsTriggered = newTriggered;
      }

      if (shouldTriggerAction) {
        updates.galleryActionsTriggered = {
          ...flowState.galleryActionsTriggered,
          [imageIndex]: true,
        };
      } else if (action.type === 'capcha-get' && isTriggered) {
        // Если действие уже было выполнено, но пользователь снова нажимает,
        // разрешаем повторное выполнение, сбрасывая триггер
        updates.galleryActionsTriggered = {
          ...flowState.galleryActionsTriggered,
          [imageIndex]: false,
        };
      }

      if (action.actionChain && shouldTriggerAction) {
        updates.currentChain = action.actionChain.steps;
        updates.currentChainIndex = 0;
        updates.currentStep = action.actionChain.steps[0];
        updates.activeChainType = 'action';
        // Если установлен флаг resetOnReentry, сбрасываем прогресс капчи и этажа
        if (action.resetOnReentry) {
          updates.captchaCompleted = false;
          updates.floorSelected = false;
        } else {
          // Если флага нет, то сбрасываем только если мы начинаем цепочку заново
          // Это позволяет повторно запускать цепочку с начального состояния
          updates.captchaCompleted = false;
          updates.floorSelected = false;
        }
      }

      if (Object.keys(updates).length > 0) {
        updateFlowState(updates as Partial<FlowState>);
      }

      return shouldTriggerAction ? action : null;
    },
    [hotel, flowState.galleryStates, flowState.galleryActionsTriggered, updateFlowState]
  );

  // Обработка успешной captcha
  const handleCaptchaSuccess = useCallback(
    (_sequence: string[]) => {
      // Если активна action-цепочка, переходим по ней
      if (flowState.activeChainType === 'action' && flowState.currentChain) {
        const currentIndex = flowState.currentChain.indexOf(flowState.currentStep);
        if (currentIndex >= 0 && currentIndex < flowState.currentChain.length - 1) {
          const nextStep = flowState.currentChain[currentIndex + 1];
          updateFlowState({
            currentStep: nextStep,
            currentChainIndex: currentIndex + 1,
            captchaCompleted: true,
            completedSteps: [...flowState.completedSteps, nextStep],
          });
          return;
        }
      }

      // Стандартное поведение
      updateFlowState({ captchaCompleted: true });
      nextChainStep();
    },
    [
      flowState.activeChainType,
      flowState.currentChain,
      flowState.currentStep,
      flowState.completedSteps,
      updateFlowState,
      nextChainStep,
    ]
  );

  // Обработка выбора этажа
  const handleFloorSelect = useCallback(
    (floor: number) => {
      // Если активна action-цепочка, переходим по ней
      if (flowState.activeChainType === 'action' && flowState.currentChain) {
        const currentIndex = flowState.currentChain.indexOf(flowState.currentStep);
        if (currentIndex >= 0 && currentIndex < flowState.currentChain.length - 1) {
          const nextStep = flowState.currentChain[currentIndex + 1];
          updateFlowState({
            currentStep: nextStep,
            currentChainIndex: currentIndex + 1,
            floorSelected: true,
            completedSteps: [...flowState.completedSteps, nextStep],
            floor: floor, // Pass the selected floor
          });
          return;
        }
      }

      // Стандартное поведение
      updateFlowState({ floorSelected: true, floor: floor }); // Pass the selected floor
      nextChainStep(floor); // Pass the selected floor
    },
    [
      flowState.activeChainType,
      flowState.currentChain,
      flowState.currentStep,
      flowState.completedSteps,
      updateFlowState,
      nextChainStep,
    ]
  );

  // Проверка, можно ли бронировать
  const canBook = useMemo(() => {
    if (!hotel) return false;
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

    const wrongOptions = hotel.wrongOptions;
    let hasWrongOptions = false;
    if (wrongOptions?.additionalServices?.some((s) => tempForm.selectedServices?.includes(s)))
      hasWrongOptions = true;
    if (wrongOptions?.roomId && wrongOptions.roomId === tempForm.roomType) hasWrongOptions = true;
    if (wrongOptions?.mealTypes?.some((type) => type === tempForm.mealType)) hasWrongOptions = true;

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
    determineCaptchaReason,
    updateFlowState,
  };
}
