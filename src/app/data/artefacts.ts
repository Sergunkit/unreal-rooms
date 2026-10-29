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
import silverCross from './images/artefacts/Silver-cross.jpg';
import woodenStake from './images/artefacts/Wooden-stake.jpg';
import gun from './images/artefacts/Gun.jpg';
import goldenSnake from './images/artefacts/Golden-snake.jpg';
import goldenApple from './images/artefacts/Golden-snake.jpg'; // изображение нужно генерировать
import radio from './images/artefacts/Radio.png';
import roomKey from './images/dolphin/1408.png';

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
    hotelId: '7',
  },
  'bottle-with-note': {
    id: 'bottle-with-note',
    name: 'Бутылка с запиской',
    nameEn: 'Bottle with a Note',
    description: 'Бутылка с таинственной запиской внутри',
    descriptionEn: 'A bottle with a mysterious note inside',
    image: bottleWithNote7,
    hotelId: '7',
  },
  'bronze-hand': {
    id: 'bronze-hand',
    name: 'Бронзовая рука',
    nameEn: 'Bronze Hand',
    description: 'Загадочная бронзовая рука, найденная в отеле The Last Peak Lodge',
    descriptionEn: 'A mysterious bronze hand found at The Last Peak Lodge',
    image: bronzeHand8,
    hotelId: '8',
  },
  'strange-watch': {
    id: 'strange-watch',
    name: 'Странные часы',
    nameEn: 'Strange Wristwatch',
    description: 'Наручные часы, идущие в обратную сторону',
    descriptionEn: 'A wristwatch that runs backwards',
    image: strangeWatch8,
    hotelId: '8',
  },
  'mountaineers-hammer': {
    id: 'mountaineers-hammer',
    name: 'Молоток альпиниста',
    nameEn: "Mountaineer's Hammer",
    description: 'Молоток, принадлежащий погибшему альпинисту',
    descriptionEn: 'A hammer belonging to a fallen mountaineer',
    image: mountaineersHammer8,
    hotelId: '8',
  },
  'raven-feather': {
    id: 'raven-feather',
    name: 'Черное перо',
    nameEn: 'Black Feather',
    description: 'Перо ворона из отеля Usher Guest House',
    descriptionEn: 'A raven feather from Usher Guest House',
    image: ravenFeather9,
    hotelId: '9',
  },
  'gold-bug': {
    id: 'gold-bug',
    name: 'Золотой жук',
    nameEn: 'The Gold Bug',
    description: 'Загадочный золотой жук — приз из отеля Usher',
    descriptionEn: 'A mysterious gold bug — prize from Usher hotel',
    image: goldBug9,
    hotelId: '9',
  },
  'mechanical-heart': {
    id: 'mechanical-heart',
    name: 'Механическое сердце',
    nameEn: 'Mechanical Heart',
    description: 'Загадочное механическое сердце для прохождения в отеле Usher',
    descriptionEn: 'A mysterious mechanical heart needed to pass Usher hotel',
    image: mechanicalHeart,
    hotelId: '9',
  },
  'secure-code': {
    id: 'secure-code',
    name: 'Безопасный код',
    nameEn: 'Secure Code',
    description: 'Секретный код для бронирования отеля Stay-Ceil',
    descriptionEn: 'A secret code for accessing Stay-Ceil hotel',
    image: secureCode,
    hotelId: '10',
  },
  'gold-coin': {
    id: 'gold-coin',
    name: 'Золотая монета',
    nameEn: 'Gold coin',
    description: 'Золотая монета для оплаты бронирования в NY Continental',
    descriptionEn: 'Gold coin for booking at NY Continental',
    image: goldCoin,
    hotelId: '1',
  },
  'dannys-ball': {
    id: 'dannys-ball',
    name: 'Теннисный мяч',
    nameEn: 'Tennis ball',
    description: 'Теннисный мяч из отеля Оверлук',
    descriptionEn: 'Tennis ball from the Overlook Hotel',
    image: dannysBall,
    hotelId: '2',
  },
  'silver-cross': {
    id: 'silver-cross',
    name: 'Серебряная крест',
    nameEn: 'Silver cross',
    description: 'Крест животворящий',
    descriptionEn: 'The Life-Giving Cross',
    image: silverCross,
    hotelId: '3',
  },
  'golden-snake': {
    id: 'golden-snake',
    name: 'Золотая змейка',
    nameEn: 'Golden Snake',
    description: 'Ацтекская змея',
    descriptionEn: 'Aztec snake',
    image: goldenSnake,
    hotelId: '4',
  },
  gun: {
    id: 'gun',
    name: 'Револьвер с серебряными пулями',
    nameEn: 'Revolver with silver bullets',
    description: 'Пистолет с серебряными пулями',
    descriptionEn: 'A pistol with silver bullets',
    image: gun,
    hotelId: '4',
  },
  'wooden-stake': {
    id: 'wooden-stake',
    name: 'Осиновый кол',
    nameEn: 'Wooden-stake',
    description: 'Артеффакт от вампиров',
    descriptionEn: 'Artifact from vampires',
    image: woodenStake,
    hotelId: '3',
  },
  'golden-apple': {
    id: 'golden-apple',
    name: 'Золотая яблоко',
    nameEn: 'Golden apple',
    description: '',
    descriptionEn: '',
    image: goldenApple,
    hotelId: '2',
  },
  radio: {
    id: 'radio',
    name: 'Радио',
    nameEn: 'Radio',
    description: '',
    descriptionEn: '',
    image: radio,
    hotelId: '5',
  },
  'room-key': {
    id: 'room-key',
    name: 'Ключ от номера',
    nameEn: 'Room Key',
    description: 'Ключ от номера 1408. Тяжёлый, латунный, с намёком на вечность.',
    descriptionEn: 'Key to room 1408. Heavy, brass, with a hint of eternity.',
    image: roomKey,
    hotelId: '5',
  },
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
