export function getRouteForStep(step: string | null | undefined): string | null {
  switch (step) {
    case 'homePage':
      return '/';
    case 'myBookingsPage':
      return '/bookings';
    default:
      return null;
  }
}
