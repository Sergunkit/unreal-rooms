import { Hotel } from './hotels-data/hotelTypes';
import { soldierData } from './hotels-data/soldier-data';
import { lastPeakData } from './hotels-data/last-peak-data';
import { usherData } from './hotels-data/raven-usher-data';
import { stayCeilData } from './hotels-data/stay-ceil-data';

// Type assertions for game hotels with complex gallery actions
const soldierHotel = soldierData as unknown as Hotel;
const lastPeakHotel = lastPeakData as unknown as Hotel;
const ravenUsherHotel = usherData as unknown as Hotel;
// Base hotel data for hotels 1-6 (using placeholder images)
// const baseHotels: Record<string, Hotel> = {
// };

// Combine base hotels with game hotels
export const hotelData: Record<string, Hotel> = {
  // ...baseHotels,
  '7': soldierHotel,
  '8': lastPeakHotel,
  '9': ravenUsherHotel,
  '10': stayCeilData,
};
