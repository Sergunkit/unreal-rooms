import { describe, expect, it } from 'vitest';
import { resolveChainTarget } from './resolveChainTarget';
import type { Chain } from '../data/hotels-data/hotelTypes';

describe('resolveChainTarget', () => {
  it('keeps the current step active when the target step contains modal content', () => {
    const chain: Chain = {
      hotelId: 5,
      type: 'custom',
      steps: {
        hotelPage: {
          id: 'hotelPage',
          step: 1,
        },
        conciergeRequired: {
          id: 'conciergeRequired',
          step: 2,
          modal: {
            id: 'concierge-required',
            message: 'Talk to the concierge',
            messageEn: 'Talk to the concierge',
          },
        },
      },
    };

    const result = resolveChainTarget({
      chain,
      currentStepId: 'hotelPage',
      nextStepId: 'conciergeRequired',
    });

    expect(result.activeStep).toBe('hotelPage');
    expect(result.activeModal).toEqual({
      id: 'concierge-required',
      message: 'Talk to the concierge',
      messageEn: 'Talk to the concierge',
    });
  });

  it('uses an inline modal config when provided', () => {
    const chain: Chain = {
      hotelId: 5,
      type: 'custom',
      steps: {
        hotelPage: {
          id: 'hotelPage',
          step: 1,
        },
        roomCard: {
          id: 'roomCard',
          step: 2,
        },
      },
    };

    const result = resolveChainTarget({
      chain,
      currentStepId: 'hotelPage',
      nextStepId: 'roomCard',
      modalConfig: {
        id: 'blocked',
        message: 'Blocked',
        messageEn: 'Blocked',
      },
    });

    expect(result.activeStep).toBe('hotelPage');
    expect(result.activeModal).toEqual({
      id: 'blocked',
      message: 'Blocked',
      messageEn: 'Blocked',
      nextStep: 'roomCard',
    });
  });
});
