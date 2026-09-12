import { evaluateConditions } from './evaluateConditions';
import type { Action, ModalConfig } from '../data/hotels-data/hotelTypes';
import type { CurrentHotelProgress } from '../contexts/GameContext';

interface ResolveActionTargetParams {
  action: Action;
  inventory: string[];
  progress: CurrentHotelProgress | null | undefined;
}

interface ResolveActionTargetResult {
  nextStep: string;
  modal: ModalConfig | null;
  params?: Record<string, unknown>;
}

export function resolveActionTarget({
  action,
  inventory,
  progress,
}: ResolveActionTargetParams): ResolveActionTargetResult {
  if (!action.transitions) {
    return {
      nextStep: action.nextStep,
      modal: null,
      params: action.params,
    };
  }

  const transitionEntries = Object.entries(action.transitions);
  for (const [transitionKey, transition] of transitionEntries) {
    if (!transition.conditions || transition.conditions.length === 0) {
      if (transitionKey === 'fail' || transitionKey === 'default') {
        return {
          nextStep: transition.nextStep,
          modal: transition.modal ?? null,
          params: transition.params,
        };
      }
    }

    const matches = evaluateConditions(transition.conditions, inventory, progress);
    if (matches) {
      return {
        nextStep: transition.nextStep,
        modal: transition.modal ?? null,
        params: transition.params,
      };
    }
  }

  return {
    nextStep: action.nextStep,
    modal: null,
    params: action.params,
  };
}
