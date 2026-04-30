import { Hotel } from './hotels-data/hotelTypes';
import { continentalData } from './hotels-data/ny-continental-data';
import { overluxData } from './hotels-data/overlux-data';
import { soldierData } from './hotels-data/soldier-data';
import { lastPeakData } from './hotels-data/last-peak-data';
import { usherData } from './hotels-data/raven-usher-data';
import { stayCeilData } from './hotels-data/stay-ceil-data';
import { brandtData } from './hotels-data/brandt-data';

// Type assertions for game hotels with complex gallery actions
const soldierHotel = soldierData as unknown as Hotel;
const lastPeakHotel = lastPeakData as unknown as Hotel;
const ravenUsherHotel = usherData as unknown as Hotel;
const continentalHotel = continentalData as unknown as Hotel;
const overluxHotel = overluxData as unknown as Hotel;
const stayCeilHotel = stayCeilData as unknown as Hotel;

// Combine base hotels with game hotels
export const hotelData: Record<string, Hotel> = {
  // ...baseHotels,
  '1': continentalHotel,
  '2': overluxHotel,
  '3': brandtData,
  '7': soldierHotel,
  '8': lastPeakHotel,
  '9': ravenUsherHotel,
  '10': stayCeilHotel,
};
