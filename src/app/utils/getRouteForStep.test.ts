import { describe, expect, it } from 'vitest';
import { getRouteForStep } from './getRouteForStep';

describe('getRouteForStep', () => {
  it('maps homePage to the home route', () => {
    expect(getRouteForStep('homePage')).toBe('/');
  });

  it('maps myBookingsPage to the bookings route', () => {
    expect(getRouteForStep('myBookingsPage')).toBe('/bookings');
  });

  it('returns null for hotel flow steps that should stay on the current page', () => {
    expect(getRouteForStep('hotelPage')).toBeNull();
  });
});
