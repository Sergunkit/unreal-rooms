/* eslint-disable prettier/prettier */
import { Hotel } from './hotelTypes';
import headImage from '../images/NYContinental/head-image.png';
import galleryCont1 from '../images/NYContinental/gallery-nyc1.png';
import galleryCont2 from '../images/NYContinental/gallery-nyc2.jpg';
import galleryCont3 from '../images/NYContinental/gallery-nyc3.jpg'; // Харон за стойкой
import galleryCont4 from '../images/NYContinental/gallery-nyc4.jpg'; // Харон за стойкой
import galleryCont5 from '../images/NYContinental/gallery-nyc5.jpg'; // Оружейный погреб (Сомелье)
// import galleryCont3 from '../images/Continental/lounge.jpg'; // Лаундж с винилом

import roomConcierge from '../images/NYContinental/room1.jpg';
import roomSafeHaven from '../images/NYContinental/room2.jpg';
import roomSanctum from '../images/NYContinental/room3.jpg';

// import goldCoinArtefact from '../images/artefacts/gold-coin.jpg';

export const continentalData: Hotel = {
  id: 1,
  name: 'NY CONTINENTAL',
  nameEn: 'NY CONTINENTAL',
  stars: 5,
  rating: 9.9,
  price: 450, // Номинальная цена, но оплата монетой
  slogan: 'Здесь правила диктуют мир. Никаких дел на территории отеля.',
  sloganEn: 'Here, rules dictate peace. No business on hotel grounds.',
  description:
    'Легендарное убежище для тех, кто ценит традиции и безупречный сервис. Мы предлагаем не просто номера, а статус неприкосновенности в самом сердце Нью-Йорка. К вашим услугам лучшие сомелье, оружейные выставки и защищенные каналы связи. Помните: правила — это то, что отличает нас от животных.',
  descriptionEn:
    'Legendary sanctuary for those who value tradition and impeccable service. We offer not just rooms, but inviolability status in the heart of New York. Our sommeliers, weapon exhibitions, and protected communication channels are at your disposal. Remember: rules are what separate us from animals.',

  location: 'Beaver St, New York (Финансовый квартал)',
  locationEn: 'Beaver St, New York (Financial District)',
  commonFeedback: 'Роскошное место, ценность которого ощущается в каждой детали и каждой гильзе.',
  commonFeedbackEn: 'A luxurious place whose value is felt in every detail and every shell casing.',

  image: headImage,
  images: [headImage, galleryCont1, galleryCont2, galleryCont3, galleryCont4, galleryCont5],

  galleryActions: [
    {
      imageIndex: 1, // Фото с Хароном
      type: 'hint' as const,
      coords: { x1: 45, y1: 20, x2: 55, y2: 60 },
      message: 'Харон: "Приятно снова видеть вас. Номер готов, если у вас есть монета."',
    },
  ],

  amenities: {
    dining: [
      'Ресторан высокой кухни с живым джазом',
      'Бар "The Lounge" — зона абсолютного перемирия',
      'Дегустационное меню от Сомелье (Special Menu)',
    ],
    diningEn: [
      'High cuisine restaurant with live jazz',
      'The Lounge bar — absolute truce zone',
      'Tasting menu from Sommelier (Special Menu)',
    ],
    pools: ['Крытый бассейн с подогревом', 'SPA-центр с массажем'],
    poolsEn: ['Heated indoor pool', 'SPA center with massage'],
    transport: ['Лимузин-сервис', 'Вертолетная площадка'],
    transportEn: ['Limousine service', 'Helipad'],
    sports: ['Подземный тир', 'Фитнес-центр'],
    sportsEn: ['Underground shooting range', 'Fitness center'],
    additional: [
      'Многоуровневый подземный тир и арсенал.',
      'Линии связи с квантовым шифрованием.',
      'Химчистка (удаление любых пятен за 1 час).',
      'Экстренная медицинская помощь (хирургия без лишних вопросов).',
      'Элиминация по договоренности ($100,000) — ТОЛЬКО ВНЕ ТЕРРИТОРИИ.',
    ],
    additionalEn: [
      'Multi-level underground shooting range and arsenal.',
      'Quantum encrypted communication lines.',
      'Dry cleaning (removal of any stains in 1 hour).',
      'Emergency medical assistance (surgery without unnecessary questions).',
      'Elimination by agreement ($100,000) — ONLY OUTSIDE THE TERRITORY.',
    ],
    restrictions: [
      'Правило №1: Никаких дел на территории отеля. Нарушение карается статусом Excommunicado.',
      'Оплата принимается исключительно в специальных знаках (Gold Coins).',
      'Вход в оружейный погреб только по приглашению Сомелье.',
    ],
    restrictionsEn: [
      'Rule #1: No business on hotel grounds. Violation is punished by Excommunicado status.',
      'Payment is accepted exclusively in special signs (Gold Coins).',
      'Access to the armory is only by invitation from the Sommelier.',
    ],
    heart_tool_tip: 'Ценность монеты выше, чем цена жизни.',
    heart_tool_tipEn: 'The value of a coin is higher than the price of life.',
    additionalServices: [
      {
        id: 'spa-access',
        name: 'Абонемент в бассейн и SPA',
        nameEn: 'Pool and SPA membership',
        price: 15,
      },
      {
        id: 'masquerade',
        name: 'Cомелье',
        nameEn: 'Sommelier',
        price: 20,
      },
      { id: 'safe-box', name: 'Аренда сейфа', nameEn: 'Safe box rental', price: 5 },
      {
        id: 'fitness',
        name: 'Индивидуальный портной',
        nameEn: 'Custom tailor',
        price: 30,
      },
    ],
  },

  initialBookingState: {
    paymentMethod: 'Credit Card', // По умолчанию стоит карта, что приведет к ошибке
    hasCoin: false,
    roomType: 'concierge',
  },

  // Механика прохождения
  passingConditions: {
    inventory: ['gold-coin'], // Нужно иметь монету в инвентаре
    paymentType: 'Gold Coin', // Нужно переключить способ оплаты в форме
  },

  wrongOptions: {
    additionalServices: ['elimination'], // Если выбрать "Элиминацию" — это нарушение правил отеля
    paymentType: 'Visa/Mastercard', // Insufficient Status
  },

  rooms: [
    {
      id: 1,
      roomNumber: null,
      value: 'concierge',
      name: 'The Concierge Choice',
      nameEn: 'The Concierge Choice',
      price: 1, // 1 монета
      size: 45,
      capacity: 2,
      beds: 'King Size Bed',
      bedsEn: 'King Size Bed',
      amenities: ['Вид на Центральный парк', 'Сейф для ценностей', 'Шелковые простыни'],
      amenitiesEn: ['Central Park View', 'Safe for Valuables', 'Silk Sheets'],
      image: roomConcierge,
    },
    {
      id: 2,
      roomNumber: null,
      value: 'safe-haven',
      name: 'The Safe Haven',
      nameEn: 'The Safe Haven',
      price: 2,
      size: 60,
      capacity: 4,
      beds: 'King Size Bed',
      bedsEn: 'King Size Bed',
      amenities: ['Бронированные стены', 'Запас кислорода на 48 часов', 'Скрытый арсенал в шкафу'],
      amenitiesEn: ['Armored Walls', '48-Hour Oxygen Supply', 'Hidden Arsenal in Closet'],
      image: roomSafeHaven,
    },
    {
      id: 3,
      roomNumber: null,
      value: 'sanctum',
      name: "The Adjudicator's Sanctum",
      nameEn: "The Adjudicator's Sanctum",
      price: 500, // Или 2 монеты
      size: 45,
      capacity: 1,
      beds: '1 King Size bed',
      bedsEn: '1 King Size bed',
      amenities: [
        'Прямая связь с Правлением',
        'Шифрованный терминал',
        'Бронированные панорамные окна',
      ],
      amenitiesEn: ['Direct High Table link', 'Encrypted terminal', 'Reinforced panoramic windows'],
      image: roomSanctum, // Нужно будет сгенерить
    },
  ],

  mealTypes: [
    {
      value: 'tasting-menu',
      label: 'Tasting Menu (Классическая кухня)',
      labelEn: 'Tasting Menu (Classic Cuisine)',
      price: 0,
      description:
        'Безупречный сервис, высокая кухня и полная тишина. Идеально для восстановления сил после выполнения контракта.',
      descriptionEn:
        'Impeccable service, haute cuisine, and absolute silence. Ideal for recovering after a completed contract.',
    },
    {
      value: 'sommelier-selection',
      label: "The Sommelier's Recommendation (Особое меню)",
      labelEn: "The Sommelier's Recommendation (Special Menu)",
      price: 1,
      description:
        "Дегустация, переходящая в подбор 'инструментария'. Включает доступ к закрытому каталогу десертных вин и калибров.",
      descriptionEn:
        "A tasting that transitions into 'tool' selection. Includes access to a private catalog of dessert wines and calibers.",
    },
    {
      value: 'manager-dinner',
      label: 'Dinner with the Manager (Эксклюзив)',
      labelEn: 'Dinner with the Manager (Exclusive)',
      price: 3,
      description:
        'Ужин в закрытой ложе. Требует особого статуса. Возможность обсудить дела напрямую с руководством отеля.',
      descriptionEn:
        'Dinner in a private box. Requires special status. An opportunity to discuss business directly with the hotel management.',
    },
  ],
  lostandfaund: ['gold-coin'],

  chatMassages: [
    'Рад вас видеть. Напоминаю, наш отель — зона мира.',
    'Ваш заказ у Сомелье будет готов через 10 минут.',
    'Мистер Уик, менеджер ждет вас в баре.',
  ],

  feedBacks: [
    {
      id: 1,
      author: 'Baba Yaga',
      text: 'Я всегда возвращаюсь сюда. Единственное место, где можно выспаться.',
      textEn: 'I always come back here. The only place where you can get some sleep.',
    },
    {
      id: 2,
      author: 'Excommunicado_99',
      text: 'Не пытайтесь достать нож в баре. Просто не пытайтесь.',
      textEn: "Don't try to pull a knife in the bar. Just don't.",
    },
  ],

  noise: 'Звук чистки оружия и далекий звон золотых монет.',
  endBookingMassege:
    'Бронирование подтверждено. Приятного отдыха, сэр. Мы позаботимся о ваших делах.',
  endWrongBookingMassege:
    'Нарушение правил Континенталя. Статус: EXCOMMUNICADO. У вас есть один час.',
  initialFlow: {
    steps: ['booking'], // Прямое бронирование с проверкой условий
    transitions: {},
  },
};
