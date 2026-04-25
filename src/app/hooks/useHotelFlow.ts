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
    // If a booking result has been determined, that is the source of truth.
    if (progress?.bookingResult) {
      return progress.bookingResult === 'safe';
    }

    // If we are not on the booking form, the concept of a "safe booking state" is not applicable
    // in the same way. We can default to false, assuming an unknown state is potentially unsafe.
    if (!chain || !progress?.tempBookingForm || progress.activeStep !== 'bookingForm') {
      return false;
    }

    // If on the booking form, evaluate the conditions for a safe transition.
    const currentStep = chain.steps.bookingForm;
    if (!currentStep?.transitions) return false;

    const safeTransitions = ['submitWithPromo', 'submitSafe'];
    for (const transitionName of safeTransitions) {
      const transition = currentStep.transitions[transitionName];
      if (transition?.conditions) {
        if (evaluateConditions(transition.conditions, playerStatus.inventory, progress)) {
          return true;
        }
      }
    }

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
      if (!progress || !chain) return;

      const currentStepId = progress.activeStep;
      const currentStep = chain.steps[currentStepId];
      if (!currentStep || !currentStep.transitions) return;

      let nextStep = null;
      let params = {};

      const transitionKeys = Object.keys(currentStep.transitions);
      for (const transitionKey of transitionKeys) {
        const transition = currentStep.transitions[transitionKey];
        // Если conditions нет или она пустая - это fallback transition
        if (!transition.conditions || transition.conditions.length === 0) {
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
        if (evaluateConditions(transition.conditions, playerStatus.inventory, progress)) {
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

      const captchaReason = nextStep === 'captcha' ? determineCaptchaReason() : undefined;

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

  // Helper to get galleryData from chain actions by imageIndex
  const getGalleryData = useCallback(
    (imageIndex: number) => {
      if (!chain) return null;
      const hotelPageStep = chain.steps.hotelPage;
      if (!hotelPageStep?.actions) return null;

      const action = hotelPageStep.actions.find(
        (a) => a.type === 'galleryClick' && a.trigger?.imageIndex === imageIndex
      );
      return action?.galleryData || null;
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
    getGalleryData,
    canBook: isSafeBookingState,
    nextChainStep,
    updateFlowState,
    handleChainAction,
  };
}
