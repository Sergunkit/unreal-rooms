/* eslint-disable prettier/prettier */
import type { Chain, Hotel } from './hotelTypes';
import headImage10 from '../images/StayCeil/head-image2.jpg'; // Главная фотография отеля Stay-Ceil
import galleryCeil1 from '../images/StayCeil/lobby-security.jpeg'; // Лобби с рамкой
import galleryCeil2 from '../images/StayCeil/cafeteria.jpeg'; // Столовая
import galleryCeil3 from '../images/StayCeil/floor14.jpeg'; // Площадка 14-го этажа с выходом
import galleryCeil4 from '../images/StayCeil/gallery-stay-ceil1.jpg'; //Вид с крыши на город
import galleryCeil6 from '../images/StayCeil/gallery-stay-ceil3.png'; //Лифт
import galleryCeil7 from '../images/StayCeil/gallery-stay-ceil4.jpeg'; //
import captcha1 from '../images/StayCeil/capcha1.jpg';
import captcha2 from '../images/StayCeil/capcha2.jpg';
import captcha3 from '../images/StayCeil/capcha3.jpg';
import captcha4 from '../images/StayCeil/capcha4.jpg';
import captcha5 from '../images/StayCeil/capcha5.jpg';
import captcha6 from '../images/StayCeil/capcha6.jpg';
import captcha7 from '../images/StayCeil/capcha7.jpg';
import captcha8 from '../images/StayCeil/capcha8.jpg';
import captcha9 from '../images/StayCeil/capcha9.jpg';

import roomStandard from '../images/StayCeil/Room-Standard.jpeg'; // Аскетичный номер с раковиной и общими удобствами
import roomSuperior from '../images/StayCeil/Room-Superior.jpeg'; // С ТВ и кондеем
import roomRehub from '../images/StayCeil/Room-Rehub.jpeg'; // Тот самый номер

export const stayCeilData: Hotel = {
  id: 10,
  name: 'The Stay-Ceil Inn',
  nameEn: 'The Stay-Ceil Inn',
  stars: 2,
  rating: 7.5,
  price: 45,
  slogan:
    'Дом там, где вы чувствуете себя в безопасности. Мы заботимся чтоб вы чувствовали себя как дома.',
  sloganEn: 'Home is where you feel safe. We care about making you feel at home.',
  description:
    'Добро пожаловать в тихую гавань в самом сердце Лос-Анджелеса. Мы предлагаем уникальный формат "защищенного проживания": усиленные оконные системы, круглосуточный пост фельдшера и полная изоляция от негативного контента (в стандартных номерах отсутствуют ТВ). Весь наш персонал проходит психологическую подготовку, чтобы обеспечить вам максимальный комфорт. Мы знаем, как важна безопасность в этом безжалостном мире.',
  descriptionEn:
    'Welcome to a quiet haven in the heart of Los Angeles. We offer a unique "protected stay" format: reinforced window systems, 24/7 paramedic post, and complete isolation from negative content (no TVs in standard rooms). All our staff undergo psychological training to ensure your maximum comfort. We understand how important safety is in this ruthless world.',
  location: 'Центр Лос-Анджелеса, неподалеку от Скид Роу',
  locationEn: 'Downtown Los Angeles, near Skid Row',
  commonFeedback: '(Идеальное месторасположение и забота о гостях.)',
  commonFeedbackEn: '(Ideal location and care for guests.)',
  image: headImage10,
  images: [
    headImage10,
    galleryCeil1,
    galleryCeil2,
    galleryCeil3,
    galleryCeil4,
    galleryCeil6,
    galleryCeil7,
  ],

  galleryActions: [
    {
      imageIndex: 3, // Фото лифта с табличкой EXIT
      type: 'capcha-get' as const,
      coords: { x1: 65, y1: 10, x2: 80, y2: 20 }, // Клик на табличку EXIT
      message: 'Для экстренного выхода введите код авторизации в капче.',
      messageEn: 'For emergency exit, enter authorization code in captcha.',
      resetOnReentry: true, // При повторном входе сбрасываем прогресс капчи и этажа
    },
  ],

  amenities: {
    dining: [
      'Столовая самообслуживания (завтрак включен)',
      'Автомат со льдом на 2-м этаже',
      'Лобби-бар',
      'Питание в номер (по запросу)',
    ],
    diningEn: [
      'Self-service cafeteria (breakfast included)',
      'Ice machine on the 2nd floor',
      'Lobby bar',
      'Room service (upon request)',
    ],
    pools: ['Нет бассейнов, но есть душевые с антибактериальными фильтрами.'],
    poolsEn: ['No pools, but there are showers with antibacterial filters.'],
    transport: [
      'Собственной парковки нет. Можно пользоваться платными общественными лотами неподалеку.',
    ],
    transportEn: ['No private parking. You can use paid public lots nearby.'],
    sports: ['Бильярд', 'Настольный теннис'],
    sportsEn: ['Billiards', 'Table Tennis'],
    additional: [
      'Кристально чистая вода (собственная фильтрация).',
      'Круглосуточный пост фельдшера.',
      'Рамки металлоискателей на входе.',
      'Еженедельное освящение всех помещений.',
      'Психологическая поддержка персонала 24/7.',
    ],
    additionalEn: [
      'Crystal clear water (own filtration).',
      '24/7 Paramedic post.',
      'Metal detector frames at the entrance.',
      'Weekly blessing of all premises.',
      '24/7 staff psychological support.',
    ],
    restrictions: [
      'Окна заблокированы стальными рамами.',
      'Доступ на крышу категорически запрещен.',
      'Телевизоры отсутствуют в номерах категории Standard и Rehab для защиты вашего спокойствия.',
      'Рекомендуется соблюдать осторожность при входе и выходе из отеля из-за близости к району Скид Роу.',
    ],
    restrictionsEn: [
      'Windows are blocked by steel frames.',
      'Access to the roof is strictly prohibited.',
      'No TVs in Standard and Rehab rooms to protect your peace of mind.',
      'Caution is advised when entering and exiting the hotel due to proximity to Skid Row.',
    ],
    heart_tool_tip: 'Здесь все под контролем. Почти все.',
    heart_tool_tipEn: 'Everything is under control here. Almost everything.',
  },

  // Поля формы по умолчанию
  initialBookingState: {
    roomNumber: '1402',
    roomNumberTemplate: '{floor}{suffix}',
    defaultFloor: 14,
    floorOptions: [14, 2, 7, 11, 3, 8, 1, 12, 10, 6, 9, 4, 5, 13],
    suffixByRoomType: {
      standard: '02',
      superior: '15',
      rehab: '24',
    },
    roomType: 'rehab',
    guests: 1,
    rooms: 1,
    mealType: 'no-meal',
    needTransfer: false,
    checkInTime: '14:00',
  },

  // Поток квеста
  // Начальный шаг — gallery, actionChain запускается при клике на лифт
  initialFlow: {
    steps: ['gallery'],
    transitions: {},
  },
  // customBookingChain не нужен — actionChain в galleryActions определяет цепочку
  bookingFormDataConditions: {
    conditionsNotDone: 'initialBookingState',
    conditionsIsDone: 'anotherBookingState',
    afterReset: 'allEmpty',
    afterComeback: 'tempBookingForm',
    conditionType: 'floorSelected', // Если этаж выбран, используем anotherBookingState
  },
  anotherBookingState: {
    roomNumberTemplate: '{floor}{suffix}',
    floorOptions: [14, 2, 7, 11, 3, 8, 1, 12, 10, 6, 9, 4, 5, 13],
    suffixByRoomType: {
      standard: '02',
      superior: '15',
      rehab: '24',
    },
    roomType: 'rehab',
    guests: 1,
    rooms: 1,
    mealType: 'no-meal',
    needTransfer: false,
    checkInTime: '14:00',
  },

  mealTypes: [
    {
      value: 'breakfast',
      label: 'Только завтрак (включено)',
      labelEn: 'Breakfast only (included)',
      price: 0,
    },
    {
      value: 'food to room',
      label: 'Доставка еды в номер',
      labelEn: 'Food delivery to the room',
      price: 60,
    },
  ],

  rooms: [
    {
      id: 1,
      roomNumber: null,
      name: 'Standard "Светлый путь"',
      nameEn: 'Standard "Bright Path"',
      value: 'standard',
      price: 45,
      size: 12,
      capacity: 2,
      beds: '1 двуспальная кровать',
      bedsEn: '1 double bed',
      amenities: ['Раковина в номере', 'Узкое окно', 'Камера наблюдения', 'Туалет и душ на этаже'],
      amenitiesEn: [
        'Sink in room',
        'Narrow window',
        'Security camera',
        'Toilet and shower on the floor',
      ],
      image: roomStandard,
    },
    {
      id: 2,
      roomNumber: null,
      name: 'Superior "Горизонт"',
      nameEn: 'Superior "Horizon"',
      value: 'superior',
      price: 75,
      size: 18,
      capacity: 2,
      beds: '1 двуспальная кровать',
      bedsEn: '1 double bed',
      amenities: ['Плоский ТВ', 'Кондиционер', 'Собственный санузел'],
      amenitiesEn: ['Flat TV', 'Air conditioning', 'Private bathroom'],
      image: roomSuperior,
    },
    {
      id: 3,
      roomNumber: null,
      name: 'Rehab "Изоляция"',
      nameEn: 'Rehab "Isolation"',
      value: 'rehab',
      price: 110,
      size: 10,
      capacity: 1,
      beds: '1 двуспальная кровать',
      bedsEn: '1 double bed',
      amenities: [
        'Собственный санузел',
        'Защищенное окно',
        'Камера наблюдения',
        'Запираемая снаружи дверь',
        'Питание в номер (по запросу)',
      ],
      amenitiesEn: [
        'Private bathroom',
        'Protected window',
        'Security camera',
        'Lockable from outside door',
        'Room service (on request)',
      ],
      image: roomRehub,
    },
  ],

  lostandfaund: ['secure-code'],

  chatMassages: [
    'Проверка связи. Вы чувствуете себя в безопасности?',
    'Вода из крана пригодна для питья. Мы проверяли её 2 часа назад.',
    'Лифты — самое надежное место в этом здании. Просто ждите.',
    'Персонал прошел аттестацию. Мы готовы слушать ваши тревоги.',
  ],

  feedBacks: [
    {
      id: 1,
      author: 'User_77',
      text: 'WI-FI нет, связи почти нет. Номер 1402 напоминает камеру, зато тихо. На ресепшене спит фельдшер. Странно, но спокойно.',
      textEn:
        'No Wi-Fi, almost no signal. Room 1402 resembles a cell, but at least quiet. The paramedic is sleeping at the reception. Strange but peaceful.',
    },
    {
      id: 2,
      author: 'Richard_R',
      text: 'Отличное место, чтобы затеряться. Окна маленькие, никто не заглянет. Код 1911 на выходе — это чья-то злая шутка.',
      textEn:
        'Great place to disappear. Small windows, no one will look. Code 1911 at the exit is someones evil joke.',
    },
  ],

  noise: 'Низкочастотный гул труб и лязг лифта',
  endBookingMassege: 'Ваша бронь принята. Теперь вы под нашей защитой.',
  endBookingMassegeEn: 'Your reservation has been accepted. You are now under our protection.',
  endWrongBookingMassege:
    'Номер на четырнадцатом этаже забронирован успешно. Вам доступна скидка в бюро ритуальных услуг по промокоду funeral1911',
  endWrongBookingMassegeEn:
    'Room on the 14th floor successfully booked. You get a discount at the funeral services bureau with promo code funeral1911',

  passingConditions: {
    roomId: 'rehab', // Комната "Изоляция" - специальный режим
  },
  wrongOptions: {
    floor: '14', // Выбор номера на 14 этаже приведет к "неправильной" броне
  },
  captcha: {
    question: 'Введите код:',
    questionEn: 'Input code:',
    items: [
      { id: '1', isCorrect: false, label: '', image: captcha1 },
      { id: '2', isCorrect: false, label: '', image: captcha2 },
      { id: '3', isCorrect: false, label: '', image: captcha3 },
      { id: '4', isCorrect: false, label: '', image: captcha4 },
      { id: '5', isCorrect: false, label: '', image: captcha5 },
      { id: '6', isCorrect: false, label: '', image: captcha6 },
      { id: '7', isCorrect: false, label: '', image: captcha7 },
      { id: '8', isCorrect: false, label: '', image: captcha8 },
      { id: '9', isCorrect: false, label: '', image: captcha9 },
    ],
    errorResponse: 'Ошибка. Вы ввели неправильный код. Двери закрываются.',
    errorResponseEn: 'Error. You entered the wrong code. Doors are closing.',
    successResponse: 'Код принят. Вы можете забронировать номер на другом этаже.',
    successResponseEn: 'Code accepted. You can book a room on another floor.',
    correctSequence: [1, 9, 1, 1],
  },
};

// ==================== НОВАЯ ЦЕПОЧКА (для миграции) ====================
export const stayCeilChain: Chain = {
  hotelId: 10,
  type: 'custom',
  steps: {
    hotelPage: {
      id: 'hotelPage',
      step: 1,
      actions: [
        {
          // Путь 1: Клик на лифт → капча → выбор этажа → форма
          id: 'elevator-click',
          type: 'galleryClick',
          trigger: { imageIndex: 3, coords: { x1: 65, y1: 10, x2: 80, y2: 20 } },
          nextStep: 'captcha'
        },
        {
          // Путь 2: Кнопка "Забронировать" → сразу форма
          id: 'book-now-btn',
          type: 'buttonClick',
          trigger: { elementId: 'book-now-button' },
          nextStep: 'bookingForm'
        },
        {
          // Путь 3: Карточка номера → Book Now → форма
          id: 'room-card-book',
          type: 'roomSelect',
          trigger: { source: 'roomDetailModal' },
          nextStep: 'bookingForm'
        }
      ]
    },
    
    captcha: {
      id: 'captcha',
      step: 2,
      transitions: {
        success: { nextStep: 'floorSelect' },
        fail: { nextStep: 'captcha' },
        close: { nextStep: 'hotelPage' }
      }
    },
    
    floorSelect: {
      id: 'floorSelect',
      step: 3,
      transitions: {
        confirm: { nextStep: 'bookingForm' },
        cancel: { nextStep: 'captcha' }
      }
    },
    
    bookingForm: {
      id: 'bookingForm',
      step: 4,
      actions: [
        {
          id: 'submit-form',
          type: 'formSubmit',
          nextStep: 'bookingConfirm'
        },
        {
          id: 'cancel-booking',
          type: 'buttonClick',
          trigger: { elementId: 'cancel-btn' },
          nextStep: 'hotelPage'
        }
      ],
      transitions: {
        submit: {
          conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
          nextStep: 'bookingConfirm'
        },
        submitUnsafe: {
          nextStep: 'bookingConfirm'
        }
      }
    },
    
    bookingConfirm: {
      id: 'bookingConfirm',
      step: 5,
      transitions: {
        confirm: { nextStep: 'bookingComplete' },
        cancel: { nextStep: 'bookingForm' }
      }
    },
    
    bookingComplete: {
      id: 'bookingComplete',
      step: 6,
      transitions: {
        default: { nextStep: 'prizeModal', delay: 2000 }
      }
    },
    
    prizeModal: {
      id: 'prizeModal',
      step: 7,
      conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
      transitions: {
        continue: { nextStep: 'myBookingsPage' }
      },
      fallback: { nextStep: 'myBookingsPage' }
    },
    
    myBookingsPage: {
      id: 'myBookingsPage',
      step: 8,
      transitions: {
        default: { nextStep: 'hotelPage' }
      }
    }
  }
};
