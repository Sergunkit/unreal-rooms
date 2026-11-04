import { useCallback, useEffect, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useCatalog } from '../contexts/CatalogContext';
import type { CurrentHotelProgress } from '../contexts/GameContext';
import { evaluateConditions } from '../utils/evaluateConditions';
import { resolveChainTarget } from '../utils/resolveChainTarget';
import { resolveActionTarget } from '../utils/resolveActionTarget';
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
  const catalog = useCatalog();
  const hotel = hotelId && catalog.status === 'loaded' ? catalog.hotels[hotelId] : null;
  const {
    playerStatus,
    setCurrentHotelProgress,
    markActionTriggered,
    removeFromInventory,
    addToInventory,
    completeHotelVisit,
  } = useGame();

  const progress = playerStatus.currentHotelProgress;

  useEffect(() => {
    if (
      hotelId &&
      hotel &&
      progress?.hotelId === hotelId &&
      progress.activeStep === 'bookingComplete' &&
      progress.bookingResult !== 'unsafe'
    ) {
      completeHotelVisit(hotelId, hotel.name, hotel.nameEn);
    }
  }, [
    hotelId,
    hotel,
    progress?.hotelId,
    progress?.activeStep,
    progress?.bookingResult,
    completeHotelVisit,
  ]);

  const chain = useMemo(() => {
    if (!hotelId || !hotel) return null;
    return catalog.status === 'loaded' ? (catalog.chains[hotelId] ?? null) : null;
  }, [catalog, hotelId, hotel]);
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

    // On the booking form — check unsafe transitions first (danger overrides safety).
    const currentStep = chain.steps.bookingForm;
    if (!currentStep?.transitions) {
      console.log('[isSafeBookingState] no transitions, returning false');
      return false;
    }

    const unsafeTransitions = ['submitUnsafe', 'altSubmitUnsafe'];
    for (const transitionName of unsafeTransitions) {
      const transition = currentStep.transitions[transitionName];
      if (transition?.conditions) {
        const result = evaluateConditions(transition.conditions, playerStatus.inventory, progress);
        console.log(`[isSafeBookingState] ${transitionName} conditions result:`, result);
        if (result) {
          return false;
        }
      }
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
    (action: Action): { blocked: boolean; message?: string; messageEn?: string } | null => {
      if (!progress || !chain) return null;

      const actionTarget = resolveActionTarget({
        action,
        inventory: playerStatus.inventory,
        progress,
      });

      if (action.blocked?.conditions) {
        const isBlocked = evaluateConditions(
          action.blocked.conditions,
          playerStatus.inventory,
          progress
        );
        if (isBlocked) {
          console.log('[handleChainAction] Action blocked:', action.id);
          setCurrentHotelProgress((prev) => {
            if (!prev) return prev;
            const target = resolveChainTarget({
              chain,
              currentStepId: prev.activeStep,
              nextStepId: actionTarget.nextStep,
              modalConfig: actionTarget.modal ?? action.modal ?? null,
            });
            return {
              ...prev,
              activeStep: target.activeStep,
              activeModal: target.activeModal,
            };
          });
          return {
            blocked: true,
            message: action.blocked.message,
            messageEn: action.blocked.messageEn,
          };
        }
      }

      if (action.params) {
        console.log('[Chain Action] Params:', action.params);
      }
      markActionTriggered(action.id);
      setCurrentHotelProgress((prev) => {
        if (!prev) return prev;
        console.log('[handleChainAction] prev.galleryStates:', prev.galleryStates);
        const target = resolveChainTarget({
          chain,
          currentStepId: prev.activeStep,
          nextStepId: actionTarget.nextStep,
          modalConfig: actionTarget.modal ?? action.modal ?? null,
        });
        return {
          ...prev,
          activeStep: target.activeStep,
          completedSteps: [...prev.completedSteps, actionTarget.nextStep],
          activeModal: target.activeModal,
        };
      });
      return null;
    },
    [chain, progress, playerStatus.inventory, setCurrentHotelProgress, markActionTriggered]
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
      let currentTransition = null;

      const transitionKeys = Object.keys(currentStep.transitions);
      for (const transitionKey of transitionKeys) {
        currentTransition = currentStep.transitions[transitionKey];
        const transition = currentTransition;
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

      const target = resolveChainTarget({
        chain,
        currentStepId: progress.activeStep,
        nextStepId: nextStep,
        modalConfig: currentTransition?.modal ?? null,
      });

      const newProgress: CurrentHotelProgress & { bookingResult?: 'safe' | 'unsafe' } = {
        ...progress,
        activeStep: target.activeStep,
        currentChainIndex: progress.currentChainIndex + 1,
        completedSteps: [...progress.completedSteps, nextStep],
        floor: nextFloor !== undefined ? nextFloor : progress.floor,
        ...(captchaReason ? { captchaReason } : {}),
        activeModal: target.activeModal,
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
      }, 10_000); // Keep the booking confirmation visible for 10 seconds.
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
      triggeredActions: {},
      captchaCompleted: false,
      floorSelected: false,
      completedSteps: [firstStepId],
      bookingResult: undefined,
      lostAndFoundItems: [], // ADDED: Reset bookingResult
    });
  }, [hotelId, hotel, chain, progress?.hotelId, setCurrentHotelProgress]);

  const handleGalleryClick = useCallback(
    (imageIndex: number, coords?: { x: number; y: number }) => {
      if (!chain || !progress || !hotel) return null;

      const hotelPageStep = chain.steps.hotelPage;

      if (hotelPageStep?.actions) {
        // Сначала фильтруем все galleryClick actions с нужным imageIndex
        const candidateActions = hotelPageStep.actions.filter((a) => {
          if (a.type !== 'galleryClick') return false;
          if (!a.trigger || a.trigger.imageIndex !== imageIndex) return false;
          return true;
        });

        // Затем проверяем координаты для каждого кандидата
        let action = null;
        for (const candidate of candidateActions) {
          if (!candidate.trigger) continue;
          if (coords && candidate.trigger.coords) {
            const { x1, x2, y1, y2 } = candidate.trigger.coords;
            if (coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2) {
              action = candidate;
              break;
            }
          } else if (!coords && !candidate.trigger.coords) {
            action = candidate;
            break;
          }
        }
        if (action) {
          if (
            action.galleryData?.type === 'artifact-find' &&
            progress.triggeredActions?.[action.id]
          ) {
            return null;
          }

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

            const target = resolveChainTarget({
              chain,
              currentStepId: prev.activeStep,
              nextStepId: action.nextStep,
              modalConfig: action.modal ?? null,
            });

            return {
              ...prev,
              galleryStates: nextGalleryStates,
              activeStep: target.activeStep,
              completedSteps: [...prev.completedSteps, action.nextStep],
              activeModal: target.activeModal,
            };
          });

          markActionTriggered(action.id);
          return action;
        }
      }

      return null;
    },
    [chain, progress, hotel, markActionTriggered, setCurrentHotelProgress]
  );

  // Helper to get all action data for gallery by imageIndex
  const getGalleryActions = useCallback(
    (imageIndex: number) => {
      if (!chain) return [];
      const hotelPageStep = chain.steps.hotelPage;
      if (!hotelPageStep?.actions) return [];

      return hotelPageStep.actions.filter(
        (a) => a.type === 'galleryClick' && a.trigger?.imageIndex === imageIndex
      );
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

  const applyCaptchaTransition = useCallback(
    (transitionKey: 'success' | 'fail' | 'close') => {
      if (!chain) return null;
      const captchaStep = chain.steps['captcha'];
      const transition = captchaStep?.transitions?.[transitionKey];
      if (!transition) return null;

      const { nextStep, params } = transition;

      if (params?.addToInventory) {
        addToInventory(params.addToInventory as string);
      }

      setCurrentHotelProgress((prev) => {
        if (!prev) return prev;
        const target = resolveChainTarget({
          chain,
          currentStepId: prev.activeStep,
          nextStepId: nextStep,
        });
        return {
          ...prev,
          activeStep: target.activeStep,
          ...(transitionKey === 'success' ? { captchaCompleted: true } : {}),
          completedSteps: [...prev.completedSteps, nextStep],
          activeModal: target.activeModal,
        };
      });

      return nextStep;
    },
    [chain, setCurrentHotelProgress, addToInventory]
  );

  const handleCaptchaSuccess = useCallback(
    (_sequence: string[]) => applyCaptchaTransition('success'),
    [applyCaptchaTransition]
  );

  const handleCaptchaFailure = useCallback(
    () => applyCaptchaTransition('fail'),
    [applyCaptchaTransition]
  );

  const handleCaptchaClose = useCallback(
    () => applyCaptchaTransition('close'),
    [applyCaptchaTransition]
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
    triggeredActions: progress?.triggeredActions || {},
    captchaCompleted: progress?.captchaCompleted || false,
    floorSelected: progress?.floorSelected || false,
    handleGalleryClick,
    handleCaptchaSuccess,
    handleCaptchaFailure,
    handleCaptchaClose,
    handleFloorSelect,
    getGalleryActions,
    canBook: isSafeBookingState,
    nextChainStep,
    updateFlowState,
    handleChainAction,
  };
}
