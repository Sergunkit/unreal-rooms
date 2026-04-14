import { useCallback, useEffect, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type { LegacyChainStep, Chain, Action } from '../data/hotels-data/hotelTypes';

// Импортируем новые цепочки
import { stayCeilChain } from '../data/hotels-data/stay-ceil-data';
import { continentalChain } from '../data/hotels-data/ny-continental-data';
import { lastPeakChain } from '../data/hotels-data/last-peak-data';
import { usherChain } from '../data/hotels-data/raven-usher-data';
import { soldierChain } from '../data/hotels-data/soldier-data';

const STANDARD_CHAIN: LegacyChainStep[] = [
  'hotelPage',
  'bookingForm',
  'bookingConfirm',
  'bookingComplete',
  'prizeModal',
  'myBookingsPage',
];

// Функция для получения цепочки из данных отеля
function getChainForHotel(hotelId: string): Chain | null {
  // Для Stay-Ceil (id: 10)
  if (hotelId === '10') {
    return stayCeilChain;
  }
  // Для NY-Continental (id: 1)
  if (hotelId === '1') {
    return continentalChain;
  }
  // Для Last-Peak (id: 8)
  if (hotelId === '8') {
    return lastPeakChain;
  }
  // Для Raven-Usher (id: 9)
  if (hotelId === '9') {
    return usherChain;
  }
  // Для Soldier Island (id: 7)
  if (hotelId === '7') {
    return soldierChain;
  }
  return null;
}

export function useHotelFlow(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const {
    playerStatus,
    setCurrentHotelProgress,
    setGalleryState,
    markGalleryActionTriggered,
    setCaptchaCompleted,
    setFloorSelected,
  } = useGame();

  const progress = playerStatus.currentHotelProgress;

  // Получаем новую цепочку для отеля
  const chain = useMemo(() => {
    if (!hotelId || !hotel) return null;
    return getChainForHotel(hotelId);
  }, [hotelId, hotel]);

  // Определение типа капчи (alien/human) на основе isSafeToBook
  const determineCaptchaReason = useCallback((): 'alien' | 'human' => {
    if (!hotel || !progress?.tempBookingForm) return 'human';

    // Проверяем passingConditions
    const conditions = hotel.passingConditions;
    if (!conditions) return 'human';

    const tempForm = progress.tempBookingForm;

    // Проверка всех условий
    const hasRoom = !conditions.roomId || tempForm.roomType === conditions.roomId;
    const hasMeal = !conditions.mealTypes || conditions.mealTypes.includes(tempForm.mealType || '');
    const hasService =
      !conditions.additionalServices ||
      conditions.additionalServices.every((s) => tempForm.selectedServices?.includes(s));
    const hasInventory =
      !conditions.inventory ||
      conditions.inventory.every((i) => playerStatus.inventory.includes(i));

    const isSafeToBook = hasRoom && hasMeal && hasService && hasInventory;

    return isSafeToBook ? 'human' : 'alien';
  }, [hotel, progress, playerStatus.inventory]);

  // Инициализация цепочки при монтировании или смене отеля
  useEffect(() => {
    if (!hotelId || !hotel || progress?.hotelId === hotelId) return;

    // Если есть новая цепочка — используем её
    if (chain) {
      const firstStepId = Object.keys(chain.steps)[0] || 'hotelPage';
      setCurrentHotelProgress({
        hotelId,
        tempBookingForm: progress?.tempBookingForm ?? null,
        floor: progress?.floor,
        roomNumber: progress?.roomNumber,
        startedAt: progress?.startedAt ?? new Date().toISOString(),
        currentChain: [firstStepId],
        activeStep: firstStepId,
        currentChainIndex: 0,
        chainType: chain.type,
        galleryStates: {},
        galleryActionsTriggered: {},
        captchaCompleted: false,
        floorSelected: false,
        completedSteps: [firstStepId],
      });
    } else {
      // Старая структура
      const oldChain = hotel.customBookingChain?.steps || STANDARD_CHAIN;
      const type: 'standard' | 'custom' | 'action' = hotel.customBookingChain
        ? 'custom'
        : 'standard';

      setCurrentHotelProgress({
        hotelId,
        tempBookingForm: progress?.tempBookingForm ?? null,
        floor: progress?.floor,
        roomNumber: progress?.roomNumber,
        startedAt: progress?.startedAt ?? new Date().toISOString(),
        currentChain: oldChain,
        activeStep: oldChain[0] || 'hotelPage',
        currentChainIndex: 0,
        chainType: type,
        galleryStates: {},
        galleryActionsTriggered: {},
        captchaCompleted: false,
        floorSelected: false,
        completedSteps: [],
      });
    }
  }, [
    hotelId,
    hotel,
    chain,
    progress?.hotelId,
    progress?.tempBookingForm,
    progress?.floor,
    progress?.roomNumber,
    progress?.startedAt,
    setCurrentHotelProgress,
  ]);

  // Обработка действия из цепочки
  const handleChainAction = useCallback(
    (action: Action) => {
      if (!progress) return;

      // Обновление контекста (если есть params)
      if (action.params) {
        // Можно сохранить в progress или tempBookingForm
        console.log('[Chain Action] Params:', action.params);
      }

      // Переход к следующему шагу
      setCurrentHotelProgress({
        ...progress,
        activeStep: action.nextStep,
        completedSteps: [...progress.completedSteps, action.nextStep],
      });
    },
    [progress, setCurrentHotelProgress]
  );

  // Обработка клика по галерее (новая структура + galleryActions)
  const handleGalleryClick = useCallback(
    (imageIndex: number, coords?: { x: number; y: number }) => {
      // 1. Сначала пробуем новую цепочку (galleryClick actions)
      if (chain && progress) {
        const hotelPageStep = chain.steps.hotelPage;
        if (hotelPageStep?.actions) {
          // Ищем действие galleryClick с matching imageIndex
          const action = hotelPageStep.actions.find((a) => {
            if (a.type !== 'galleryClick') return false;
            if (!a.trigger || a.trigger.imageIndex !== imageIndex) return false;

            // Проверка coords (если есть)
            if (coords && a.trigger.coords) {
              const { x1, x2, y1, y2 } = a.trigger.coords;
              return coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2;
            }

            return true;
          });

          if (action) {
            // Помечаем как выполненное
            markGalleryActionTriggered(imageIndex);
            // Выполняем действие
            handleChainAction(action);
            return action;
          }
        }
      }

      // 2. Старая логика для galleryActions (toggle, hint, artifact-find, capcha-get)
      const action = hotel?.galleryActions?.find((a) => a.imageIndex === imageIndex);
      if (!action || !progress) return null;

      const isTriggered = progress.galleryActionsTriggered[imageIndex] ?? false;
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

      if (shouldToggle) {
        setGalleryState(imageIndex, !progress.galleryStates[imageIndex]);
        markGalleryActionTriggered(imageIndex);
      }

      if (shouldTriggerAction) {
        markGalleryActionTriggered(imageIndex);
      } else if (action.type === 'capcha-get' && isTriggered) {
        markGalleryActionTriggered(imageIndex);
      }

      // Запуск actionChain (старая структура)
      if (action.actionChain && shouldTriggerAction) {
        const actionChainSteps = action.actionChain.steps;
        setCurrentHotelProgress({
          ...progress,
          currentChain: actionChainSteps,
          activeStep: actionChainSteps[0],
          chainType: 'action',
          currentChainIndex: 0,
          completedSteps: [actionChainSteps[0]],
          captchaCompleted: false,
          floorSelected: false,
        });
      }

      return shouldTriggerAction ? action : null;
    },
    [
      chain,
      progress,
      hotel,
      markGalleryActionTriggered,
      handleChainAction,
      setGalleryState,
      setCurrentHotelProgress,
    ]
  );

  // Переход к следующему шагу
  const nextChainStep = useCallback(
    (nextFloor?: number) => {
      if (!progress || !chain) {
        // Старая логика
        return;
      }

      const currentStepId = progress.activeStep;
      const currentStep = chain.steps[currentStepId];

      if (!currentStep || !currentStep.transitions) return;

      // Для простой цепочки используем transition по умолчанию
      const transition =
        currentStep.transitions.default ||
        currentStep.transitions.submit ||
        currentStep.transitions.success;

      if (!transition) return;

      const nextStep = transition.nextStep;

      // Если следующий шаг captcha, определяем её тип (alien/human)
      const captchaReason = nextStep === 'captcha' ? determineCaptchaReason() : undefined;

      setCurrentHotelProgress({
        ...progress,
        activeStep: nextStep,
        currentChainIndex: progress.currentChainIndex + 1,
        completedSteps: [...progress.completedSteps, nextStep],
        floor: nextFloor !== undefined ? nextFloor : progress.floor,
        ...(captchaReason ? { captchaReason } : {}),
      });
    },
    [progress, chain, setCurrentHotelProgress, determineCaptchaReason]
  );

  // Обновление flowState (для обратной совместимости)
  const updateFlowState = useCallback(
    (updates: Partial<typeof progress> & { floor?: number; currentStep?: LegacyChainStep }) => {
      if (!hotelId || !progress) return;
      const { currentStep, ...restUpdates } = updates;
      setCurrentHotelProgress({
        ...progress,
        ...(currentStep ? { activeStep: currentStep } : {}),
        ...restUpdates,
      });
    },
    [hotelId, progress, setCurrentHotelProgress]
  );

  // Обработка успешной captcha
  const handleCaptchaSuccess = useCallback(
    (_sequence: string[]) => {
      if (!progress) {
        console.warn('[Captcha Success] No progress');
        return;
      }

      console.log(
        '[Captcha Success] activeStep:',
        progress.activeStep,
        'chain:',
        chain ? 'NEW' : 'OLD'
      );

      // Для новой цепочки
      if (chain) {
        const currentStep = chain.steps[progress.activeStep];
        console.log(
          '[Captcha Success] currentStep:',
          currentStep?.id,
          'transitions:',
          currentStep?.transitions
        );

        if (currentStep?.transitions?.success) {
          const nextStep = currentStep.transitions.success.nextStep;
          console.log('[Captcha Success] Moving to:', nextStep);
          setCurrentHotelProgress({
            ...progress,
            activeStep: nextStep,
            captchaCompleted: true,
            completedSteps: [...progress.completedSteps, nextStep],
          });
          return;
        }

        // Если нет success, пробуем nextStep из actions
        if (currentStep?.actions?.[0]) {
          const nextStep = currentStep.actions[0].nextStep;
          console.log('[Captcha Success] Using action nextStep:', nextStep);
          setCurrentHotelProgress({
            ...progress,
            activeStep: nextStep,
            captchaCompleted: true,
            completedSteps: [...progress.completedSteps, nextStep],
          });
          return;
        }
      }

      // Старая логика
      console.log('[Captcha Success] Using old logic');
      setCaptchaCompleted(true);
      nextChainStep();
    },
    [progress, chain, setCurrentHotelProgress, nextChainStep, setCaptchaCompleted]
  );

  // Обработка выбора этажа
  const handleFloorSelect = useCallback(
    (floor: number) => {
      if (!progress) return;

      // Для новой цепочки
      if (chain) {
        const currentStep = chain.steps[progress.activeStep];
        if (currentStep?.transitions?.confirm) {
          setCurrentHotelProgress({
            ...progress,
            activeStep: currentStep.transitions.confirm.nextStep,
            floorSelected: true,
            floor,
            completedSteps: [...progress.completedSteps, currentStep.transitions.confirm.nextStep],
          });
          return;
        }
      }

      // Старая логика
      setFloorSelected(true);
      nextChainStep(floor);
    },
    [progress, chain, setCurrentHotelProgress, nextChainStep, setFloorSelected]
  );

  // Проверка, можно ли бронировать
  const canBookValue = useMemo(() => {
    if (!hotel || !progress?.tempBookingForm) return false;
    const conditions = hotel.passingConditions;
    if (!conditions) return true;

    const tempForm = progress.tempBookingForm;

    const hasRoom = !conditions.roomId || tempForm.roomType === conditions.roomId;
    const hasMeal = !conditions.mealTypes || conditions.mealTypes.includes(tempForm.mealType || '');
    const hasService =
      !conditions.additionalServices ||
      conditions.additionalServices.every((s) => tempForm.selectedServices?.includes(s));

    // Проверка inventory (артефакты для possession - возвращаются после бронирования)
    const hasInventory =
      !conditions.inventory ||
      conditions.inventory.every((i) => playerStatus.inventory.includes(i));

    // Проверка inventoryPayment (артефакты для оплаты - забираются навсегда)
    const hasInventoryPayment =
      !conditions.inventoryPayment ||
      conditions.inventoryPayment.every((i) => playerStatus.inventory.includes(i));

    const hasPromoCode =
      !conditions.promoCode ||
      tempForm.promoCode?.toUpperCase() === conditions.promoCode.toUpperCase();

    // Проверка paymentType (для NY-Continental: paymentType: 'cash' требует выбора наличных)
    const hasPaymentType =
      !conditions.paymentType ||
      (conditions.paymentType === 'cash' && tempForm.paymentMethod === 'cash');

    const wrongOptions = hotel.wrongOptions;
    let hasWrongOptions = false;
    if (wrongOptions?.additionalServices?.some((s) => tempForm.selectedServices?.includes(s)))
      hasWrongOptions = true;
    if (wrongOptions?.roomId && wrongOptions.roomId.includes(tempForm.roomType))
      hasWrongOptions = true;
    if (wrongOptions?.mealTypes?.some((type) => type === tempForm.mealType)) hasWrongOptions = true;

    // Проверка date range (для Overlux: ноябрь-март)
    if (wrongOptions?.date && typeof wrongOptions.date === 'object' && tempForm.checkInDate) {
      const checkIn = new Date(tempForm.checkInDate);
      const from = new Date(wrongOptions.date.from);
      const to = new Date(wrongOptions.date.to);
      if (checkIn >= from && checkIn <= to) {
        hasWrongOptions = true;
      }
    }
    // Проверка exact date match (для других отелей)
    if (wrongOptions?.date && typeof wrongOptions.date === 'string' && tempForm.checkInDate) {
      if (tempForm.checkInDate === wrongOptions.date) hasWrongOptions = true;
    }

    return (
      hasRoom &&
      hasMeal &&
      hasService &&
      hasInventory &&
      hasInventoryPayment &&
      hasPromoCode &&
      hasPaymentType &&
      !hasWrongOptions
    );
  }, [hotel, progress?.tempBookingForm, playerStatus.inventory]);

  return {
    currentChain: progress?.currentChain || STANDARD_CHAIN,
    activeStep: progress?.activeStep || 'hotelPage',
    chainType: progress?.chainType || 'standard',
    currentChainIndex: progress?.currentChainIndex || 0,
    completedSteps: progress?.completedSteps || [],
    galleryStates: progress?.galleryStates || {},
    galleryActionsTriggered: progress?.galleryActionsTriggered || {},
    captchaCompleted: progress?.captchaCompleted || false,
    floorSelected: progress?.floorSelected || false,
    handleGalleryClick,
    handleCaptchaSuccess,
    handleFloorSelect,
    canBook: canBookValue,
    nextChainStep,
    updateFlowState,
    handleChainAction,
  };
}
