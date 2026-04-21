import type { Chain } from '../data/hotels-data/hotelTypes';
import { stayCeilChain } from '../data/hotels-data/stay-ceil-data';
import { continentalChain } from '../data/hotels-data/ny-continental-data';
import { lastPeakChain } from '../data/hotels-data/last-peak-data';
import { usherChain } from '../data/hotels-data/raven-usher-data';
import { soldierChain } from '../data/hotels-data/soldier-data';
import { overluxChain } from '../data/hotels-data/overlux-data';

export function getChainForHotel(hotelId: string): Chain | null {
  if (hotelId === '10') return stayCeilChain;
  if (hotelId === '1') return continentalChain;
  if (hotelId === '2') return overluxChain;
  if (hotelId === '8') return lastPeakChain;
  if (hotelId === '9') return usherChain;
  if (hotelId === '7') return soldierChain;
  return null;
}
