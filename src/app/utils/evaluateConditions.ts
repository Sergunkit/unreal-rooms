import type { CurrentHotelProgress } from '../contexts/GameContext';
import { Condition } from '../data/hotels-data/hotelTypes';

export const evaluateConditions = (
  conditions: Condition[] | undefined,
  inventory: string[],
  progress: CurrentHotelProgress | null | undefined
): boolean => {
  if (!conditions || conditions.length === 0) {
    return true; // No conditions means they are met
  }

  const tempBookingForm = progress?.tempBookingForm;

  const result = conditions.every((condition) => {
    const { field, operator, value } = condition;

    if (!tempBookingForm && field !== 'inventory' && field !== 'bookingResult') {
      console.log(`[evaluateConditions] No tempBookingForm for field ${field}`);
      return false;
    }

    switch (field) {
      case 'inventory':
        if (operator === 'contains') return inventory.includes(value as string);
        if (operator === 'not-contains') return !inventory.includes(value as string);
        break;
      case 'roomType':
        if (operator === 'eq') return tempBookingForm!.roomType === value;
        if (operator === 'ne') return tempBookingForm!.roomType !== value;
        break;
      case 'mealType':
        if (operator === 'eq') return tempBookingForm!.mealType === value;
        if (operator === 'ne') return tempBookingForm!.mealType !== value;
        if (operator === 'includes') return (value as string[]).includes(tempBookingForm!.mealType);
        break;
      case 'floor': {
        const floorValue = progress?.floor;
        console.log('[evaluateConditions] floor condition:', {
          floorValue,
          operator,
          value,
          result: operator === 'ne' ? floorValue !== value : floorValue === value,
        });
        if (operator === 'eq') return floorValue === value;
        if (operator === 'ne') return floorValue !== value;
        break;
      }
      case 'floorSelected':
        if (operator === 'eq') return progress?.floorSelected === value;
        if (operator === 'ne') return progress?.floorSelected !== value;
        break;
      case 'bookingResult':
        if (operator === 'eq') return progress?.bookingResult === value;
        if (operator === 'ne') return progress?.bookingResult !== value;
        break;
      case 'isSafeToBook':
        if (operator === 'eq') return (progress?.bookingResult === 'safe') === value;
        break;
      case 'additionalServices':
        if (operator === 'contains')
          return tempBookingForm!.selectedServices.includes(value as string);
        if (operator === 'not-contains')
          return !tempBookingForm!.selectedServices.includes(value as string);
        break;
      case 'promoCode':
        if (operator === 'eq')
          return tempBookingForm!.promoCode?.toUpperCase() === (value as string).toUpperCase();
        if (operator === 'ne')
          return tempBookingForm!.promoCode?.toUpperCase() !== (value as string).toUpperCase();
        break;
      case 'paymentMethod':
        if (operator === 'eq') return tempBookingForm!.paymentMethod === value;
        if (operator === 'ne') return tempBookingForm!.paymentMethod !== value;
        break;
      case 'dateOrder':
        if (operator === 'is-before') {
          const checkInDate = tempBookingForm!.checkInDate;
          const checkOutDate = tempBookingForm!.checkOutDate;
          if (!checkInDate || !checkOutDate) {
            console.log('[evaluateConditions] dateOrder: Missing checkInDate or checkOutDate', { checkInDate, checkOutDate });
            return false; // If either date is missing, condition is not met
          }
          const checkIn = new Date(checkInDate);
          const checkOut = new Date(checkOutDate);
          const isCheckInBeforeCheckOut = checkIn < checkOut;
          const conditionMet = (isCheckInBeforeCheckOut === value); // value is expected to be boolean
          console.log('[evaluateConditions] dateOrder:', {
            checkInDate,
            checkOutDate,
            isCheckInBeforeCheckOut,
            expectedValue: value,
            conditionMet
          });
          return conditionMet;
        }
        break;
      case 'dateRange':
        if (operator === 'not-intersects') {
          if (
            !tempBookingForm!.checkInDate ||
            !tempBookingForm!.checkOutDate ||
            (value as { fromMonth: number; toMonth: number }).fromMonth === undefined ||
            (value as { fromMonth: number; toMonth: number }).toMonth === undefined
          ) {
            return true; // If dates/range invalid, condition passes
          }
          const { fromMonth, toMonth } = value as { fromMonth: number; toMonth: number };
          const checkIn = new Date(tempBookingForm!.checkInDate);
          const checkOut = new Date(tempBookingForm!.checkOutDate);

          const isMonthInRange = (month: number) => {
            if (fromMonth <= toMonth) {
              return month >= fromMonth && month <= toMonth;
            } else {
              return month >= fromMonth || month <= toMonth;
            }
          };

          let overlaps = false;
          const currentDate = new Date(checkIn);
          while (currentDate <= checkOut) {
            if (isMonthInRange(currentDate.getMonth())) {
              overlaps = true;
              break;
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return !overlaps;
        }
        break;
      default:
        console.log(`[evaluateConditions] Unknown field or operator for field ${field}`);
        return false;
    }
    return false;
  });
  console.log(`[evaluateConditions] Overall conditions.every() result: ${result}`);
  return result;
};
