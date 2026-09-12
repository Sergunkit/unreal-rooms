import { describe, expect, it } from 'vitest';
import { resolveActionTarget } from './resolveActionTarget';
import type { Action } from '../data/hotels-data/hotelTypes';

describe('resolveActionTarget', () => {
  it('uses the success branch when the condition is met', () => {
    const action: Action = {
      id: 'book-now-btn',
      type: 'buttonClick',
      nextStep: 'bookingForm',
      transitions: {
        success: {
          conditions: [{ field: 'inventory', operator: 'contains', value: 'room-key' }],
          nextStep: 'bookingForm',
        },
        fail: {
          nextStep: 'hotelPage',
          modal: {
            id: 'concierge-required',
            message: 'Talk to the concierge',
            messageEn: 'Talk to the concierge',
          },
        },
      },
    };

    const result = resolveActionTarget({
      action,
      inventory: ['room-key'],
      progress: null,
    });

    expect(result.nextStep).toBe('bookingForm');
    expect(result.modal).toBeNull();
  });

  it('uses the fail branch and opens a modal when the condition is not met', () => {
    const action: Action = {
      id: 'book-now-btn',
      type: 'buttonClick',
      nextStep: 'bookingForm',
      transitions: {
        success: {
          conditions: [{ field: 'inventory', operator: 'contains', value: 'room-key' }],
          nextStep: 'bookingForm',
        },
        fail: {
          nextStep: 'hotelPage',
          modal: {
            id: 'concierge-required',
            message: 'Talk to the concierge',
            messageEn: 'Talk to the concierge',
          },
        },
      },
    };

    const result = resolveActionTarget({
      action,
      inventory: [],
      progress: null,
    });

    expect(result.nextStep).toBe('hotelPage');
    expect(result.modal).toEqual({
      id: 'concierge-required',
      message: 'Talk to the concierge',
      messageEn: 'Talk to the concierge',
    });
  });
});
