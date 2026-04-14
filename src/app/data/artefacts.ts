/**
 * Артефакты - данные о предметах Lost & Found и призах в отелях
 * В дальнейшем эти данные планируется перенести в базу данных
 */

import judgesHummer7 from './images/artefacts/Judges-Hummer.jpg';
import bottleWithNote7 from './images/artefacts/Bottle-with-a-Note.jpg';
import bronzeHand8 from './images/artefacts/Bronze-Hand.jpg';
import strangeWatch8 from './images/artefacts/Strange-Watch.jpg';
import mountaineersHammer8 from './images/artefacts/Mountaineers-Hammer.jpg';
import ravenFeather9 from './images/artefacts/Raven-Feather.jpg';
import goldBug9 from './images/artefacts/Gold-Bug.jpeg';
import mechanicalHeart from './images/artefacts/Mechanical-Heart.jpg';
import secureCode from './images/artefacts/Secure-Code.jpg';
import goldCoin from './images/artefacts/Gold-coin.jpg';
import dannysBall from './images/artefacts/Dannys-ball.jpg';

/**
 * Интерфейс для артефакта (предмет Lost & Found или приз)
 */
export interface Artefact {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  image: string;
  type: 'lost-and-found' | 'prize';
  hotelId?: string;
}

/**
 * Словарь всех артефактов
 * Ключ - id артефакта
 */
export const artefacts: Record<string, Artefact> = {
  'judges-hummer': {
    id: 'judges-hummer',
    name: 'Молоток судьи',
    nameEn: 'Judges Hummer',
    description: 'Молоток, используемый судьёй для вынесения приговоров',
    descriptionEn: 'A hammer used by the judge to deliver verdicts',
    image: judgesHummer7,
    type: 'lost-and-found',
    hotelId: '7',
  },
  'bottle-with-note': {
    id: 'bottle-with-note',
    name: 'Бутылка с запиской',
    nameEn: 'Bottle with a Note',
    description: 'Бутылка с таинственной запиской внутри',
    descriptionEn: 'A bottle with a mysterious note inside',
    image: bottleWithNote7,
    type: 'prize',
    hotelId: '7',
  },
  'bronze-hand': {
    id: 'bronze-hand',
    name: 'Бронзовая рука',
    nameEn: 'Bronze Hand',
    description: 'Загадочная бронзовая рука, найденная в отеле The Last Peak Lodge',
    descriptionEn: 'A mysterious bronze hand found at The Last Peak Lodge',
    image: bronzeHand8,
    type: 'lost-and-found',
    hotelId: '8',
  },
  'strange-watch': {
    id: 'strange-watch',
    name: 'Странные часы',
    nameEn: 'Strange Wristwatch',
    description: 'Наручные часы, идущие в обратную сторону',
    descriptionEn: 'A wristwatch that runs backwards',
    image: strangeWatch8,
    type: 'prize',
    hotelId: '8',
  },
  'mountaineers-hammer': {
    id: 'mountaineers-hammer',
    name: 'Молоток альпиниста',
    nameEn: "Mountaineer's Hammer",
    description: 'Молоток, принадлежащий погибшему альпинисту',
    descriptionEn: 'A hammer belonging to a fallen mountaineer',
    image: mountaineersHammer8,
    type: 'lost-and-found',
    hotelId: '8',
  },
  'raven-feather': {
    id: 'raven-feather',
    name: 'Черное перо',
    nameEn: 'Black Feather',
    description: 'Перо ворона из отеля Usher Guest House',
    descriptionEn: 'A raven feather from Usher Guest House',
    image: ravenFeather9,
    type: 'lost-and-found',
    hotelId: '9',
  },
  'gold-bug': {
    id: 'gold-bug',
    name: 'Золотой жук',
    nameEn: 'The Gold Bug',
    description: 'Загадочный золотой жук — приз из отеля Usher',
    descriptionEn: 'A mysterious gold bug — prize from Usher hotel',
    image: goldBug9,
    type: 'prize',
    hotelId: '9',
  },
  'mechanical-heart': {
    id: 'mechanical-heart',
    name: 'Механическое сердце',
    nameEn: 'Mechanical Heart',
    description: 'Загадочное механическое сердце для прохождения в отеле Usher',
    descriptionEn: 'A mysterious mechanical heart needed to pass Usher hotel',
    image: mechanicalHeart,
    type: 'lost-and-found',
    hotelId: '9',
  },
  'secure-code': {
    id: 'secure-code',
    name: 'Безопасный код',
    nameEn: 'Secure Code',
    description: 'Секретный код для бронирования отеля Stay-Ceil',
    descriptionEn: 'A secret code for accessing Stay-Ceil hotel',
    image: secureCode,
    type: 'lost-and-found',
    hotelId: '10',
  },
  'gold-coin': {
    id: 'gold-coin',
    name: 'Золотая монета',
    nameEn: 'Gold coin',
    description: 'Золотая монета для оплаты бронирования в NY Continental',
    descriptionEn: 'Gold coin for booking at NY Continental',
    image: goldCoin,
    type: 'lost-and-found',
    hotelId: '1',
  },
  'dannys-ball': {
    id: 'dannys-ball',
    name: 'Теннисный мяч',
    nameEn: 'Tennis ball',
    description: 'Теннисный мяч из отеля Оверлук',
    descriptionEn: 'Tennis ball from the Overlook Hotel',
    image: dannysBall,
    type: 'lost-and-found',
    hotelId: '2',
  },
};

/**
 * Получить все артефакты определённого типа
 */
export const getArtefactsByType = (type: 'lost-and-found' | 'prize'): Artefact[] => {
  return Object.values(artefacts).filter((artefact) => artefact.type === type);
};

/**
 * Получить артефакт по ID
 */
export const getArtefactById = (id: string): Artefact | undefined => {
  return artefacts[id];
};

/**
 * Получить все артефакты для конкретного отеля
 */
export const getArtefactsByHotelId = (hotelId: string): Artefact[] => {
  return Object.values(artefacts).filter((artefact) => artefact.hotelId === hotelId);
};
