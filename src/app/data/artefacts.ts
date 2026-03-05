/**
 * Артефакты - данные о предметах Lost & Found и призах в отелях
 * В дальнейшем эти данные планируется перенести в базу данных
 */

import judgesHummer7 from './images/artefacts/Judges-Hummer.jpg';
import bottleWithNote7 from './images/artefacts/Bottle-with-a-Note.jpg';
import bronzeHand8 from './images/artefacts/Bronze-Hand.jpg';
import strangeWatch8 from './images/artefacts/Strange-Watch.jpg';
import mountaineersHammer8 from './images/artefacts/Mountaineers-Hammer.jpg';

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
