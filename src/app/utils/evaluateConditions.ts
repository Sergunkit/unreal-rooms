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

  const matchField = (f: string, op: string, v: unknown): boolean => {
    if (!tempBookingForm && f !== 'inventory' && f !== 'bookingResult') {
      console.log(`[evaluateConditions] No tempBookingForm for field ${f}`);
      return false;
    }

    switch (f) {
      case 'inventory':
        if (op === 'contains') return inventory.includes(v as string);
        if (op === 'not-contains') return !inventory.includes(v as string);
        break;
      case 'roomType':
        if (op === 'eq') return tempBookingForm!.roomType === v;
        if (op === 'ne') return tempBookingForm!.roomType !== v;
        break;
      case 'mealType':
        if (op === 'eq') return tempBookingForm!.mealType === v;
        if (op === 'ne') return tempBookingForm!.mealType !== v;
        if (op === 'includes') return (v as string[]).includes(tempBookingForm!.mealType);
        break;
      case 'floor': {
        const floorValue = progress?.floor;
        console.log('[evaluateConditions] floor condition:', { floorValue, operator: op, value: v, result: op === 'ne' ? floorValue !== v : floorValue === v });
        if (op === 'eq') return floorValue === v;
        if (op === 'ne') return floorValue !== v;
        break;
      }
      case 'floorSelected':
        if (op === 'eq') return progress?.floorSelected === v;
        if (op === 'ne') return progress?.floorSelected !== v;
        break;
      case 'bookingResult':
        if (op === 'eq') return progress?.bookingResult === v;
        if (op === 'ne') return progress?.bookingResult !== v;
        break;
      case 'isSafeToBook':
        if (op === 'eq') return (progress?.bookingResult === 'safe') === v;
        break;
      case 'additionalServices':
        if (op === 'contains') return tempBookingForm!.selectedServices.includes(v as string);
        if (op === 'not-contains') return !tempBookingForm!.selectedServices.includes(v as string);
        if (op === 'eq' && Array.isArray(v) && (v as unknown[]).length === 0) {
          return tempBookingForm!.selectedServices.length === 0;
        }
        break;
      case 'promoCode':
        if (op === 'eq') return tempBookingForm!.promoCode?.toUpperCase() === (v as string).toUpperCase();
        if (op === 'ne') return tempBookingForm!.promoCode?.toUpperCase() !== (v as string).toUpperCase();
        break;
      case 'paymentMethod':
        if (op === 'eq') return tempBookingForm!.paymentMethod === v;
        if (op === 'ne') return tempBookingForm!.paymentMethod !== v;
        break;
      case 'dateOrder':
        if (op === 'is-before') {
          const checkInDate = tempBookingForm!.checkInDate;
          const checkOutDate = tempBookingForm!.checkOutDate;
          if (!checkInDate || !checkOutDate) {
            console.log('[evaluateConditions] dateOrder: Missing checkInDate or checkOutDate', { checkInDate, checkOutDate });
            return false;
          }
          const checkIn = new Date(checkInDate);
          const checkOut = new Date(checkOutDate);
          const isCheckInBeforeCheckOut = checkIn < checkOut;
          const conditionMet = isCheckInBeforeCheckOut === v;
          console.log('[evaluateConditions] dateOrder:', { checkInDate, checkOutDate, isCheckInBeforeCheckOut, expectedValue: v, conditionMet });
          return conditionMet;
        }
        break;
      case 'needTransfer':
        if (op === 'eq') return tempBookingForm!.needTransfer === v;
        break;
      case 'dateRange':
        if (op === 'not-intersects') {
          if (!tempBookingForm!.checkInDate || !tempBookingForm!.checkOutDate || (v as { fromMonth: number; toMonth: number }).fromMonth === undefined || (v as { fromMonth: number; toMonth: number }).toMonth === undefined) {
            return true;
          }
          const { fromMonth, toMonth } = v as { fromMonth: number; toMonth: number };
          const checkIn = new Date(tempBookingForm!.checkInDate);
          const checkOut = new Date(tempBookingForm!.checkOutDate);
          const isMonthInRange = (month: number) => fromMonth <= toMonth ? month >= fromMonth && month <= toMonth : month >= fromMonth || month <= toMonth;
          let overlaps = false;
          const currentDate = new Date(checkIn);
          while (currentDate <= checkOut) {
            if (isMonthInRange(currentDate.getMonth())) { overlaps = true; break; }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return !overlaps;
        }
        break;
      default:
        console.log(`[evaluateConditions] Unknown field or operator for field ${f}`);
        return false;
    }
    return false;
  };

  const result = conditions.every((condition) => {
    const { field, operator, value, or: orConditions } = condition;

    if (matchField(field, operator, value)) return true;

    if (orConditions?.length) {
      return orConditions.some((oc) => matchField(oc.field, oc.operator, oc.value));
    }

    return false;
  });
  console.log(`[evaluateConditions] Overall conditions.every() result: ${result}`);
  return result;
};
