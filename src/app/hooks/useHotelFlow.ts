import { useCallback, useEffect, useMemo } from 'react';
import { hotelData } from '../data/hotels';
import { useGame } from '../contexts/GameContext';
import type { CurrentHotelProgress } from '../contexts/GameContext';
import { evaluateConditions } from '../utils/evaluateConditions';
import { getChainForHotel } from '../utils/getChainForHotel';
import type { LegacyChainStep, Action } from '../data/hotels-data/hotelTypes';

const STANDARD_CHAIN: LegacyChainStep[] = [
  'hotelPage',
  'bookingForm',
  'bookingConfirm',
  'bookingComplete',
  'prizeModal',
  'myBookingsPage',
];

export function useHotelFlow(hotelId?: string) {
  const hotel = hotelId ? hotelData[hotelId as keyof typeof hotelData] : null;
  const { playerStatus, setCurrentHotelProgress, markGalleryActionTriggered, removeFromInventory } =
    useGame();

  const progress = playerStatus.currentHotelProgress;

  const chain = useMemo(() => {
    if (!hotelId || !hotel) return null;
    return getChainForHotel(hotelId);
  }, [hotelId, hotel]);
  const isSafeBookingState = useMemo(() => {
    console.log('[isSafeBookingState] re-evaluating...'); // ADDED LOG
    // If a booking result has been determined, that is the source of truth.
    // But only use cached result if we're NOT on bookingForm — on bookingForm we need to
    // re-evaluate based on current form data (user might change parameters after returning)
    if (progress?.bookingResult && progress.activeStep !== 'bookingForm') {
      console.log('[isSafeBookingState] bookingResult:', progress.bookingResult); // ADDED LOG
      return progress.bookingResult === 'safe';
    }

    // Check if hotel has floor selection step (Stay Ceil has floorSelect step)
    const hasFloorSelection = chain?.steps?.floorSelect;
    if (hasFloorSelection) {
      // Если floor НЕ был выбран через капчу (floorSelected !== true) — это опасно,
      // потому что по умолчанию используется 14 этаж с номером 1402
      if (progress?.floorSelected !== true) {
        console.log('[isSafeBookingState] floorSelected !== true, returning false (unsafe)');
        return false;
      }

      // floorSelected === true, проверяем что floor не 14
      const currentFloor =
        typeof progress?.floor === 'string' ? parseInt(progress.floor, 10) : progress?.floor;
      if (currentFloor === 14) {
        console.log('[isSafeBookingState] floor === 14, returning false (unsafe)');
        return false;
      }
    }

    // If we are not on the booking form, the concept of a "safe booking state" is not applicable
    if (!chain || !progress?.tempBookingForm || progress.activeStep !== 'bookingForm') {
      console.log('[isSafeBookingState] not on bookingForm, returning false');
      return false;
    }

    // If on the booking form, evaluate the conditions for a safe transition.
    const currentStep = chain.steps.bookingForm;
    if (!currentStep?.transitions) {
      console.log('[isSafeBookingState] no transitions, returning false');
      return false;
    }

    const safeTransitions = ['altSubmitSafe', 'submitSafe'];
    for (const transitionName of safeTransitions) {
      const transition = currentStep.transitions[transitionName];
      if (transition?.conditions) {
        const result = evaluateConditions(transition.conditions, playerStatus.inventory, progress);
        console.log(`[isSafeBookingState] ${transitionName} conditions result:`, result);
        if (result) {
          return true;
        }
      }
    }

    console.log('[isSafeBookingState] no safe transition matched, returning false');
    return false;
  }, [chain, progress, playerStatus.inventory]);

  const determineCaptchaReason = useCallback((): 'alien' | 'human' => 'human', []);

  const handleChainAction = useCallback(
    (action: Action) => {
      if (!progress) return;
      if (action.params) {
        console.log('[Chain Action] Params:', action.params);
      }
      // Используем функциональное обновление чтобы получить актуальное состояние
      setCurrentHotelProgress((prev) => {
        if (!prev) return prev;
        console.log('[handleChainAction] prev.galleryStates:', prev.galleryStates);
        return {
          ...prev,
          activeStep: action.nextStep,
          completedSteps: [...prev.completedSteps, action.nextStep],
          // galleryStates и galleryActionsTriggered сохраняются автоматически через ...prev
        };
      });
    },
    [progress, setCurrentHotelProgress]
  );

  const nextChainStep = useCallback(
    (nextFloor?: number) => {
      console.log('[useHotelFlow] nextChainStep called. Current activeStep:', progress?.activeStep);
      console.log('[useHotelFlow] Current progress.floor:', progress?.floor);
      console.log('[useHotelFlow] nextFloor argument:', nextFloor);
      console.log('[useHotelFlow] tempBookingForm dates:', {
        checkInDate: progress?.tempBookingForm?.checkInDate,
        checkOutDate: progress?.tempBookingForm?.checkOutDate,
      });

      if (!progress || !chain) return;

      const currentStepId = progress.activeStep;
      const currentStep = chain.steps[currentStepId];
      if (!currentStep || !currentStep.transitions) return;

      let nextStep = null;
      let params = {};

      const transitionKeys = Object.keys(currentStep.transitions);
      for (const transitionKey of transitionKeys) {
        const transition = currentStep.transitions[transitionKey];
        console.log(`[useHotelFlow] Checking transition: ${transitionKey}`);
        // Если conditions нет или она пустая - это fallback transition
        if (!transition.conditions || transition.conditions.length === 0) {
          console.log(`[useHotelFlow] ${transitionKey} is fallback (no conditions)`);
          nextStep = transition.nextStep;
          params = transition.params ?? {};

          if (transition.effects) {
            transition.effects.forEach((effect) => {
              if (effect.type === 'consumeInventory') {
                removeFromInventory(effect.item);
              }
            });
          }

          break;
        }
        const conditionsMet = evaluateConditions(
          transition.conditions,
          playerStatus.inventory,
          progress
        );
        console.log(`[useHotelFlow] ${transitionKey} conditions result:`, conditionsMet);
        if (conditionsMet) {
          console.log(`[useHotelFlow] ${transitionKey} conditions met!`);
          nextStep = transition.nextStep;
          params = transition.params ?? {};

          if (transition.effects) {
            transition.effects.forEach((effect) => {
              if (effect.type === 'consumeInventory') {
                removeFromInventory(effect.item);
              }
            });
          }

          break;
        }
      }

      if (!nextStep) return;

      // Check for captchaReason in params first, then fall back to determineCaptchaReason
      let captchaReason: 'alien' | 'human' | undefined;
      if (
        'captchaReason' in params &&
        (params.captchaReason === 'alien' || params.captchaReason === 'human')
      ) {
        captchaReason = params.captchaReason;
      } else if (nextStep === 'captcha') {
        captchaReason = determineCaptchaReason();
      }

      const newProgress: CurrentHotelProgress & { bookingResult?: 'safe' | 'unsafe' } = {
        ...progress,
        activeStep: nextStep,
        currentChainIndex: progress.currentChainIndex + 1,
        completedSteps: [...progress.completedSteps, nextStep],
        floor: nextFloor !== undefined ? nextFloor : progress.floor,
        ...(captchaReason ? { captchaReason } : {}),
      };

      // Type guard для bookingResult в params
      if (
        params &&
        typeof params === 'object' &&
        'bookingResult' in params &&
        (params.bookingResult === 'safe' || params.bookingResult === 'unsafe')
      ) {
        newProgress.bookingResult = params.bookingResult;
      }

      console.log('[useHotelFlow] Final transition:', {
        nextStep,
        bookingResult: newProgress.bookingResult,
      });
      setCurrentHotelProgress(newProgress);
    },
    [
      progress,
      chain,
      playerStatus.inventory,
      setCurrentHotelProgress,
      determineCaptchaReason,
      removeFromInventory,
    ]
  );

  // Effect to handle step-level conditions (e.g., for prizeModal)
  useEffect(() => {
    if (!chain || !progress || !progress.activeStep) return;

    const currentStep = chain.steps[progress.activeStep];
    if (!currentStep || !currentStep.conditions || currentStep.conditions.length === 0) {
      return; // No conditions on this step.
    }

    const conditionsMet = evaluateConditions(
      currentStep.conditions,
      playerStatus.inventory,
      progress
    );

    if (!conditionsMet && currentStep.fallback) {
      console.log(
        `[useHotelFlow] Step conditions for '${progress.activeStep}' not met. Taking fallback to '${currentStep.fallback.nextStep}'.`
      );
      setCurrentHotelProgress({
        ...progress,
        activeStep: currentStep.fallback.nextStep,
        completedSteps: [...progress.completedSteps, currentStep.fallback.nextStep],
      });
    }
  }, [progress, chain, playerStatus.inventory, setCurrentHotelProgress]);

  // Effect to automatically transition from bookingComplete after a delay
  useEffect(() => {
    if (progress?.activeStep === 'bookingComplete') {
      const timer = setTimeout(() => {
        nextChainStep();
      }, 2000); // 2-second delay to show the completion message
      return () => clearTimeout(timer);
    }
  }, [progress?.activeStep, nextChainStep]);

  useEffect(() => {
    if (!hotelId || !hotel || !chain || progress?.hotelId === hotelId) return;

    const firstStepId = Object.keys(chain.steps)[0] || 'hotelPage';
    setCurrentHotelProgress({
      hotelId,
      tempBookingForm: null,
      floor: undefined,
      roomNumber: undefined,
      startedAt: new Date().toISOString(),
      currentChain: [firstStepId],
      activeStep: firstStepId,
      currentChainIndex: 0,
      chainType: chain.type,
      galleryStates: {},
      galleryActionsTriggered: {},
      captchaCompleted: false,
      floorSelected: false,
      completedSteps: [firstStepId],
      bookingResult: undefined, // ADDED: Reset bookingResult
    });
  }, [hotelId, hotel, chain, progress?.hotelId, setCurrentHotelProgress]);

  const handleGalleryClick = useCallback(
    (imageIndex: number, coords?: { x: number; y: number }) => {
      if (!chain || !progress || !hotel) return null;

      const hotelPageStep = chain.steps.hotelPage;

      if (hotelPageStep?.actions) {
        const action = hotelPageStep.actions.find((a) => {
          if (a.type !== 'galleryClick') return false;
          if (!a.trigger || a.trigger.imageIndex !== imageIndex) return false;
          if (coords && a.trigger.coords) {
            const { x1, x2, y1, y2 } = a.trigger.coords;
            return coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2;
          }
          // Если coords не переданы и в action нет coords - это match
          if (!coords && !a.trigger.coords) {
            return true;
          }
          // Если coords не переданы, но в action есть coords - это не match
          if (!coords && a.trigger.coords) {
            return false;
          }
          return true;
        });
        if (action) {
          setCurrentHotelProgress((prev) => {
            if (!prev) return prev;

            const nextGalleryStates = { ...(prev.galleryStates || {}) };

            if (action.galleryData?.type === 'toggle') {
              nextGalleryStates[imageIndex] = !(prev.galleryStates?.[imageIndex] ?? false);
            }

            if (
              action.galleryData?.type === 'hint' ||
              action.galleryData?.type === 'artifact-find'
            ) {
              nextGalleryStates[imageIndex] = true;
            }

            return {
              ...prev,
              galleryStates: nextGalleryStates,
              activeStep: action.nextStep,
              completedSteps: [...prev.completedSteps, action.nextStep],
            };
          });

          markGalleryActionTriggered(imageIndex);
          return action;
        }
      }

      // Legacy fallback: check hotel.galleryActions if chain action not found
      const legacyAction = hotel.galleryActions?.find((a) => a.imageIndex === imageIndex);
      if (!legacyAction) return null;
      // ... legacy logic can be removed in the future
    },
    [chain, progress, hotel, markGalleryActionTriggered, setCurrentHotelProgress]
  );

  // Helper to get full action data for gallery by imageIndex
  const getGalleryAction = useCallback(
    (imageIndex: number) => {
      if (!chain) return null;
      const hotelPageStep = chain.steps.hotelPage;
      if (!hotelPageStep?.actions) return null;

      const action = hotelPageStep.actions.find(
        (a) => a.type === 'galleryClick' && a.trigger?.imageIndex === imageIndex
      );
      return action || null;
    },
    [chain]
  );

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

  const handleCaptchaSuccess = useCallback(
    (_sequence: string[]) => {
      if (!chain) return;
      const captchaStep = chain.steps['captcha'];
      if (captchaStep?.transitions?.success) {
        const nextStep = captchaStep.transitions.success.nextStep;
        setCurrentHotelProgress((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            activeStep: nextStep,
            captchaCompleted: true,
            completedSteps: [...prev.completedSteps, nextStep],
          };
        });
      }
    },
    [chain, setCurrentHotelProgress]
  );

  const handleFloorSelect = useCallback(
    (floor: number) => {
      if (!progress || !chain) return;
      const currentStep = chain.steps[progress.activeStep];
      if (currentStep?.transitions?.confirm) {
        // console.log('[handleFloorSelect] Setting floor:', floor);
        setCurrentHotelProgress({
          ...progress,
          activeStep: currentStep.transitions.confirm.nextStep,
          floorSelected: true,
          floor,
          completedSteps: [...progress.completedSteps, currentStep.transitions.confirm.nextStep],
        });
      }
    },
    [progress, chain, setCurrentHotelProgress]
  );

  return {
    chain,
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
    getGalleryAction,
    canBook: isSafeBookingState,
    nextChainStep,
    updateFlowState,
    handleChainAction,
  };
}
