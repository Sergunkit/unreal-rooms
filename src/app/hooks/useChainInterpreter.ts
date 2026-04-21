import { useCallback, useState } from 'react';
import type { Chain, ChainStep, Condition, Action } from '../data/hotels-data/hotelTypes';

/**
 * Проверка одного условия
 */
function checkCondition(condition: Condition, context: Record<string, unknown>): boolean {
  const { field, operator, value } = condition;
  const fieldValue = context[field];

  switch (operator) {
    case 'eq':
      return fieldValue === value;
    case 'ne':
      return fieldValue !== value;
    case 'gt':
      return fieldValue > value;
    case 'lt':
      return fieldValue < value;
    case 'includes':
      return Array.isArray(fieldValue) && fieldValue.includes(value);
    case 'notIncludes':
      return !Array.isArray(fieldValue) || !fieldValue.includes(value);
    default:
      return false;
  }
}

/**
 * Проверка всех условий (AND + OR)
 */
export function checkConditions(
  conditions: Condition[],
  context: Record<string, unknown>
): boolean {
  return conditions.every((condition) => {
    // Если есть OR — проверяем их
    if (condition.or && condition.or.length > 0) {
      const orResult = condition.or.some((orCondition) => checkCondition(orCondition, context));
      const andResult = checkCondition(condition, context);
      return orResult || andResult;
    }

    // Иначе просто AND
    return checkCondition(condition, context);
  });
}

/**
 * Хук для интерпретации цепочки шагов
 */
export function useChainInterpreter(chain: Chain) {
  const [currentStepId, setCurrentStepId] = useState<string>('hotelPage');
  const [context, setContext] = useState<Record<string, unknown>>({});

  // Получаем текущий шаг
  const currentStep: ChainStep | undefined = chain.steps[currentStepId];

  /**
   * Обработка действия (клик, выбор, отправка)
   */
  const handleAction = useCallback(
    (actionId: string, payload?: Record<string, unknown>) => {
      if (!currentStep || !currentStep.actions) {
        console.warn(`[Chain] No actions in step ${currentStepId}`);
        return;
      }

      const action = currentStep.actions.find((a) => a.id === actionId);
      if (!action) {
        console.warn(`[Chain] Action ${actionId} not found in step ${currentStepId}`);
        return;
      }

      // Проверка условий шага (если есть)
      if (currentStep.conditions && !checkConditions(currentStep.conditions, context)) {
        // Если условия не выполнены — используем fallback
        if (currentStep.fallback) {
          console.log(
            `[Chain] Conditions failed, using fallback: ${currentStep.fallback.nextStep}`
          );
          setCurrentStepId(currentStep.fallback.nextStep);
        }
        return;
      }

      // Обновление контекста
      if (payload) {
        setContext((prev) => ({ ...prev, ...payload }));
      }

      // Применение параметров действия
      if (action.params) {
        setContext((prev) => ({ ...prev, ...action.params }));
      }

      // Переход к следующему шагу
      console.log(`[Chain] ${currentStepId} --[${actionId}]--> ${action.nextStep}`);
      setCurrentStepId(action.nextStep);
    },
    [currentStep, currentStepId, context]
  );

  /**
   * Обработка перехода (успех/неудача/отмена)
   */
  const handleTransition = useCallback(
    (transitionType: string, payload?: Record<string, unknown>) => {
      if (!currentStep || !currentStep.transitions) {
        console.warn(`[Chain] No transitions in step ${currentStepId}`);
        return;
      }

      const transition = currentStep.transitions[transitionType];
      if (!transition) {
        console.warn(`[Chain] Transition ${transitionType} not found in step ${currentStepId}`);
        return;
      }

      // Проверка условий перехода
      if (
        transition.conditions &&
        !checkConditions(transition.conditions, { ...context, ...payload })
      ) {
        console.log(`[Chain] Transition ${transitionType} conditions failed`);
        return;
      }

      // Обновление контекста
      if (payload) {
        setContext((prev) => ({ ...prev, ...payload }));
      }

      // Применение параметров перехода
      if (transition.params) {
        setContext((prev) => ({ ...prev, ...transition.params }));
      }

      // Переход к следующему шагу
      console.log(`[Chain] ${currentStepId} --[${transitionType}]--> ${transition.nextStep}`);
      setCurrentStepId(transition.nextStep);
    },
    [currentStep, currentStepId, context]
  );

  /**
   * Получение доступных действий
   */
  const getAvailableActions = useCallback((): Action[] => {
    if (!currentStep || !currentStep.actions) return [];

    // Проверка условий шага
    if (currentStep.conditions && !checkConditions(currentStep.conditions, context)) {
      return [];
    }

    return currentStep.actions;
  }, [currentStep, context]);

  /**
   * Проверка условия (удобно для UI)
   */
  const checkConditionInContext = useCallback(
    (condition: Condition): boolean => {
      return checkCondition(condition, context);
    },
    [context]
  );

  /**
   * Сброс цепочки
   */
  const resetChain = useCallback(() => {
    setCurrentStepId('hotelPage');
    setContext({});
    console.log('[Chain] Reset to hotelPage');
  }, []);

  return {
    currentStepId,
    currentStep,
    context,
    handleAction,
    handleTransition,
    getAvailableActions,
    checkConditionInContext,
    resetChain,
  };
}
