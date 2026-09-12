export interface ShouldResetHotelProgressParams {
  currentStep?: string;
  hotelId?: string;
  progressHotelId?: string;
  isHotelRoute?: boolean;
}

export function shouldResetHotelProgress({
  currentStep,
  hotelId,
  progressHotelId,
  isHotelRoute = false,
}: ShouldResetHotelProgressParams) {
  if (!isHotelRoute || !hotelId) {
    return false;
  }

  if (!progressHotelId) {
    return true;
  }

  if (progressHotelId !== hotelId) {
    return true;
  }

  return currentStep === 'homePage';
}
