import type { Chain, ModalConfig } from '../data/hotels-data/hotelTypes';

interface ResolveChainTargetParams {
  chain: Chain;
  currentStepId: string;
  nextStepId: string;
  modalConfig?: ModalConfig | null;
}

export function resolveChainTarget({
  chain,
  currentStepId,
  nextStepId,
  modalConfig,
}: ResolveChainTargetParams) {
  const targetStep = chain.steps[nextStepId];
  const stepModal = targetStep?.modal ?? null;

  let activeModal: ModalConfig | null = null;

  if (modalConfig) {
    activeModal = { ...modalConfig, nextStep: modalConfig.nextStep ?? nextStepId };
  } else if (stepModal) {
    activeModal = targetStep?.nextStep
      ? { ...stepModal, nextStep: targetStep.nextStep }
      : stepModal;
  }

  return {
    activeStep: activeModal ? currentStepId : nextStepId,
    activeModal,
  };
}
