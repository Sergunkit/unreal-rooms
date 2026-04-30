/* eslint-disable prettier/prettier */
import type { Chain } from './hotelTypes';
// Импорт изображений (названия соответствуют описанию)
import headImage from '../images/Brandt/head-image.jpg'; // Панорама замка с высоты
import galleryStairs from '../images/Brandt/gallery-brandt1.jpg'; // Винтовая лестница
import galleryGrounds1 from '../images/Brandt/gallery-brandt2.jpg'; // Прилегающая территория со склепами 1
import galleryGrounds2 from '../images/Brandt/gallery-brandt3.jpg'; // Прилегающая территория со склепами 2
import galleryUnderground from '../images/Brandt/room1.png'; // Комната на подземном уровне
import galleryWindowRoom from '../images/Brandt/room2.jpg'; // Комната с окном
import galleryHallTable from '../images/Brandt/gallery-brandt4.jpg'; // Зальная комната с длинным столом
import roomDeluxeImg from '../images/Brandt/room2.jpg'; // Видовой номер в башне (заглушка)
import roomDetoxImg from '../images/Brandt/room3.jpg'; // Каменная комната с одной свечой
import roomCryptImg from '../images/Brandt/room1.png'; // Цокольный этаж со сводами

export const brandtData = {
  id: 3,
  name: 'The Brandt Citadel',
  nameEn: 'The Brandt Citadel',
  stars: 4,
  rating: 9,
  price: 666,
  slogan: 'Тишина — это новая роскошь. Отключитесь от сети, подключитесь к себе',
  sloganEn: 'Silence is the new luxury. Disconnect from the network, connect to yourself.',
  description:
    'Отель имеет уникальное расположение вдали от цивилизации. Здание отеля представляет собой уникальный памятник средневековой архитектуры с трансильванским колоритом. Расположенное на природной возвышенности в живописном ущелье имеет несколько преимуществ: никаких соседей в радиусе 12 километров, сложный рельеф не позволяет провести к отелю автомобильную дорогу. Изюминка нашего отеля - полное отсутствие связи. Здесь нет телефонов, нет телевизоров, нет интернета. Тишина, которую нарушает только вой местных... собак.',
  descriptionEn:
    'A hotel uniquely located far from civilization. The building is a unique monument of medieval architecture with a Transylvanian flavor. Set on a natural elevation in a picturesque gorge, it offers several advantages: no neighbors within a 12 km radius, and the difficult terrain prevents a road to the hotel. The highlight is the complete absence of communication: no phones, no TVs, no internet. The silence is broken only by the howling of local… dogs.',
  commonFeedback: '(Гости отмечают необычайную бледность персонала и великолепный сон).',
  commonFeedbackEn: '(Guests note the extraordinary pallor of the staff and magnificent sleep).',
  location: 'Замок Брандт, Трансильвания, Румыния. 12 км до ближайшей деревни.',
  locationEn: 'Brandt Castle, Transylvania, Romania. 12 km to the nearest village.',
  image: headImage,
  images: [
    headImage,
    galleryStairs,
    galleryGrounds1,
    galleryGrounds2,
    galleryUnderground,
    galleryWindowRoom,
    galleryHallTable,
  ],

  amenities: {
    dining: [
      'Ресторан «Графский зал»',
      'Винный погреб',
      'Доставка еды в номер',
      'Графский стол (ужин при свечах с хозяином)',
    ],
    diningEn: [
      'Count’s Hall Restaurant',
      'Wine cellar',
      'Room service',
      'Count’s table (candlelit dinner with the host)',
    ],
    pools: [
      'Купели с ледяной горной водой',
      'Грязевые обертывания «Почва предков»',
      'Камера депривации в подземелье',
    ],
    poolsEn: [
      'Icy mountain water plunge pools',
      'Ancestral Soil mud wraps',
      'Dungeon deprivation chamber',
    ],
    transport: [
      'Трансфер от ближайшей деревни на конной повозке',
      'Возможен трансфер после захода солнца',
    ],
    transportEn: [
      'Horse-drawn carriage transfer from the nearest village',
      'After-sunset transfer available',
    ],
    sports: [
      'Спортивное ориентирование в лабиринте коридоров',
      'Фехтование на старинных клинках',
      'Ночные прогулки по зубчатым стенам',
    ],
    sportsEn: [
      'Orienteering in the maze of corridors',
      'Fencing with antique blades',
      'Night walks along the battlements',
    ],
    additional: [
      'Полное отсутствие связи (нет Wi-Fi, TV, телефонов)',
      'Отсутствие зеркал в номерах',
      'Персонал работает только в дневную смену',
      'Средневековый колорит и аутентичная архитектура',
    ],
    additionalEn: [
      'No connectivity (no Wi-Fi, TV, phones)',
      'No mirrors in the rooms',
      'Staff only on day shift',
      'Medieval charm and authentic architecture',
    ],
    additionalServices: [
      {
        id: 'blood-transfer',
        name: 'Трансфер до пункта переливания крови',
        nameEn: 'Blood transfusion center transfer',
        price: 100,
      },
      {
        id: 'night-transfer',
        name: 'Трансфер в тёмное время суток',
        nameEn: 'After-dark transfer',
        price: 50,
      },
    ],
    restrictions: [
      'Просьба не брать с собой чеснок и зеркала — здесь свой вайб.',
      'Внимание: персонал работает исключительно в дневную смену. После захода солнца просим пользоваться услугами самообслуживания.',
      'Наш Хозяин ценит тишину.',
      'Соблюдение дресс-кода в общественных местах обязательно.',
    ],
    restrictionsEn: [
      'Please do not bring garlic or mirrors – we have our own vibe.',
      'Staff works only during the day shift. After sunset, please use self-service.',
      'Our Host appreciates silence.',
      'Dress code in public areas is mandatory.',
    ],
    heart_tool_tip: 'Ваше сердце замрёт от таких величественных видов.',
    heart_tool_tipEn: 'Your heart will stop at such majestic views.',
  },

  mealTypes: [
    {
      value: 'all-inclusive',
      label: 'Всё включено',
      labelEn: 'All inclusive',
      price: 200,
    },
    {
      value: 'room-service',
      label: 'Доставка еды в номер',
      labelEn: 'Room service',
      price: 50,
    },
    {
      value: 'wine-cellar',
      label: 'Винный погреб',
      labelEn: 'Wine cellar',
      price: 150,
    },
    {
      value: 'no-meal',
      label: 'Без питания и напитков',
      labelEn: 'No meals or drinks',
      price: 0,
    },
    {
      value: 'counts-table',
      label: 'Графский стол (ужин при свечах с хозяином)',
      labelEn: 'Count’s table (candlelit dinner with the host)',
      price: 500,
    },
  ],

  rooms: [
    {
      id: 1,
      roomNumber: null,
      name: 'Deluxe «Башня»',
      nameEn: 'Deluxe «Tower»',
      value: 'deluxe',
      price: 850,
      size: 38,
      capacity: 2,
      beds: '1 King Size',
      bedsEn: '1 King Size',
      amenities: ['Эркер с видом на ущелье', 'Кровать с балдахином', 'Камин', 'Большой запирающийся сундук'],
      amenitiesEn: ['Bay window overlooking the gorge', 'Canopy bed', 'Fireplace', 'Large lockable chest'],
      image: roomDeluxeImg,
    },
    {
      id: 2,
      roomNumber: null,
      name: 'Detox «Каменная келья»',
      nameEn: 'Detox «Stone Cell»',
      value: 'detox',
      price: 300,
      size: 20,
      capacity: 1,
      beds: '1 односпальная кровать',
      bedsEn: '1 single bed',
      amenities: ['Отсутствие окон', 'Каменные стены', 'Единственная свеча', 'Минимализм'],
      amenitiesEn: ['No windows', 'Stone walls', 'Single candle', 'Minimalism'],
      image: roomDetoxImg,
    },
    {
      id: 3,
      roomNumber: null,
      name: 'The Crypt Suites',
      nameEn: 'The Crypt Suites',
      value: 'crypt',
      price: 666,
      size: 25,
      capacity: 2,
      beds: 'Роскошные кровати типа gravebox',
      bedsEn: 'Luxurious gravebox beds',
      amenities: ['Сводчатые потолки', 'Идеальная терморегуляция', 'Отсутствие солнечного света', 'Зеркал нет'],
      amenitiesEn: ['Vaulted ceilings', 'Perfect climate control', 'No sunlight', 'No mirrors'],
      image: roomCryptImg,
    },
  ],

  lostandfaund: [
    'ancient-coin',   // Древний коин
    'wooden-stake',   // Осиновый кол (также приз)
  ],

  chatMassages: [
    'Добро пожаловать в Цитадель. Приносим извинения за временные неудобства.',
    'Если вам понадобится свежая простыня, позвоните до заката.',
    'Хозяин сегодня в хорошем расположении духа. Он ждёт вас к ужину.',
    'Не советую бродить по коридорам после полуночи. Замок старый, можно заблудиться.',
  ],
  chatMassegesEn: [
    'Welcome to the Citadel. We apologize for any temporary inconvenience.',
    'If you need fresh linen, call before sunset.',
    'The Host is in good spirits tonight. He awaits you for dinner.',
    'I advise against wandering the corridors after midnight. The castle is old, one might get lost.',
  ],

  prize: 'wooden-stake',

  promoCodes: [
    {
      code: 'NOSFERATU',
      discount: 10,
      description: 'Скидка за любовь к классике',
      descriptionEn: 'Discount for a love of the classics',
    },
  ],

  feedBacks: [
    {
      id: 1,
      author: 'Abraham_V',
      text: 'Спал как убитый. Проснулся с парой царапин на шее, но воздух здесь просто божественный!',
      textEn: 'Slept like the dead. Woke up with a couple of scratches on my neck, but the air is simply divine!',
    },
    {
      id: 2,
      author: 'Jonathan_H',
      text: 'Хозяин — очень начитанный джентльмен, хотя его руки были пугающе холодными.',
      textEn: 'The Host is a very well-read gentleman, though his hands were frighteningly cold.',
    },
    {
      id: 3,
      author: 'Mina_M',
      text: 'В номере не работал звонок. Пришлось выходить в коридор, а там… но не будем о грустном.',
      textEn: 'The room bell didn’t work. Had to go out into the corridor, and there… but let’s not dwell.',
    },
  ],

  noise: 'Вой волков, далёкий стук копыт, скрип половиц и редкий звон цепей.',

  endBookingMassege: 'Добро пожаловать, господин. Ваш ужин подан.',
  endBookingMassegeEn: 'Welcome, master. Your dinner is served.',

  endWrongBookingMassege: 'Мы надеемся, вам понравится вечность. Хозяин уже спускается.',
  endWrongBookingMassegeEn: 'We hope you enjoy eternity. The Host is already on his way down.',

  bookingStates: {
    default: {
      roomType: 'deluxe',
      mealType: 'counts-table',
      additionalServices: ['blood-transfer', 'night-transfer'],
      transferType: 'night',
      guests: 2,
      rooms: 1,
      checkInTime: '20:00',
      lockedFields: [],  // Поля не заблокированы, чтобы игрок мог менять
    },
    safe: {
      roomType: 'deluxe',    // будет переопределено условиями
      mealType: 'no-meal',
      additionalServices: [],
      transferType: 'day',   // или 'night' для второго варианта
      guests: 2,
      rooms: 1,
      checkInTime: '15:00',
      lockedFields: [],
    },
  },
};

// ==================== ЦЕПОЧКА КВЕСТА ====================
export const brandtChain: Chain = {
  hotelId: 3,
  type: 'custom',
  steps: {
    hotelPage: {
      id: 'hotelPage',
      step: 1,
      actions: [
        // Интерактив в галерее
        // {
        //   id: 'toggle-castle-view',
        //   type: 'galleryClick',
        //   trigger: { imageIndex: 0 }, // панорама замка
        //   nextStep: 'hotelPage',
        //   galleryData: {
        //     type: 'toggle',
        //     alternateImage: 'castle-night.jpg', // условное ночное изображение
        //     message: 'С наступлением темноты замок выглядит ещё величественнее.',
        //     messageEn: 'At nightfall, the castle looks even more majestic.',
        //     resetOnReentry: true,
        //   },
        // },
        {
          id: 'hint-stairs',
          type: 'galleryClick',
          trigger: { imageIndex: 1, coords: { x1: 20, y1: 10, x2: 80, y2: 90 } }, // винтовая лестница
          nextStep: 'hotelPage',
          galleryData: {
            type: 'hint',
            alternateImage: galleryStairs,
            message: 'Говорят, по этой лестнице можно спуститься в подземелье, но зеркал там нет.',
            messageEn: 'They say this staircase leads down to the dungeon, but there are no mirrors there.',
            resetOnReentry: false,
          },
        },
        // {
        //   id: 'artifact-coin',
        //   type: 'galleryClick',
        //   trigger: { imageIndex: 2, coords: { x1: 30, y1: 50, x2: 70, y2: 85 } }, // склепы
        //   nextStep: 'hotelPage',
        //   galleryData: {
        //     type: 'artifact-find',
        //     artefact: 'ancient-coin',
        //     message: 'Вы нашли древнюю монету среди склепов. Она холодная на ощупь.',
        //     messageEn: 'You found an ancient coin among the crypts. It is cold to the touch.',
        //     resetOnReentry: false,
        //   },
        // },
        // {
        //   id: 'hint-dinner',
        //   type: 'galleryClick',
        //   trigger: { imageIndex: 6, coords: { x1: 10, y1: 40, x2: 90, y2: 90 } }, // длинный стол
        //   nextStep: 'hotelPage',
        //   galleryData: {
        //     type: 'hint',
        //     message: 'За этим столом ужинает Хозяин. Лучше не присоединяться, если вы дорожите жизнью.',
        //     messageEn: 'The Host dines at this table. Better not join if you value your life.',
        //     resetOnReentry: false,
        //   },
        // },
        // Кнопки
        {
          id: 'book-now-btn',
          type: 'buttonClick',
          trigger: { elementId: 'book-now-button' },
          nextStep: 'bookingForm',
        },
        {
          id: 'room-card-open',
          type: 'roomOpen',
          trigger: { source: 'roomCard' },
          nextStep: 'roomCard',
        },
      ],
    },

    roomCard: {
      id: 'roomCard',
      step: 2,
      actions: [
        {
          id: 'room-card-book',
          type: 'roomSelect',
          trigger: { source: 'roomDetailModal' },
          nextStep: 'bookingForm',
        },
        {
          id: 'room-card-close',
          type: 'buttonClick',
          trigger: { elementId: 'room-modal-close' },
          nextStep: 'hotelPage',
        },
      ],
    },

    bookingForm: {
      id: 'bookingForm',
      step: 3,
      formConfig: {
        initialStateId: 'default',
        // conditionalStates: [
        //   {
        //     condition: [
        //       { field: 'inventory', operator: 'contains', value: 'silver-cross' },
        //       { field: 'transferType', operator: 'eq', value: 'day' },
        //       { field: 'roomType', operator: 'eq', value: 'deluxe' },
        //       { field: 'mealType', operator: 'eq', value: 'no-meal' },
        //       { field: 'additionalServices', operator: 'empty' }
        //     ],
        //     stateId: 'safe',
        //   },
        //   {
        //     condition: [
        //       { field: 'inventory', operator: 'contains', value: 'silver-cross' },
        //       { field: 'transferType', operator: 'eq', value: 'night' },
        //       { field: 'roomType', operator: 'eq', value: 'crypt' },
        //       { field: 'mealType', operator: 'eq', value: 'no-meal' },
        //       { field: 'additionalServices', operator: 'empty' }
        //     ],
        //     stateId: 'safe',
        //   },
        // ],
      },
      actions: [
        {
          id: 'submit-form',
          type: 'formSubmit',
          nextStep: 'bookingConfirm',
        },
        {
          id: 'cancel-booking',
          type: 'buttonClick',
          trigger: { elementId: 'cancel-btn' },
          nextStep: 'hotelPage',
        },
      ],
      transitions: {
        altSubmitSafe: {
            conditions: [
              { field: 'inventory', operator: 'contains', value: 'silver-cross' },
            //   { field: 'transferType', operator: 'eq', value: 'night' },
              { field: 'roomType', operator: 'eq', value: 'crypt' },
              { field: 'mealType', operator: 'eq', value: 'no-meal' },
              { field: 'additionalServices', operator: 'eq', value: [] }
            ],
            nextStep: 'bookingConfirm',
          params: { bookingResult: 'safe' }
        },
        submitSafe: {
          conditions: [
            { field: 'inventory', operator: 'contains', value: 'silver-cross' },
            { field: 'inventory', operator: 'contains', value: 'silver-cross' },
            // { field: 'transferType', operator: 'eq', value: 'day' },
            { field: 'roomType', operator: 'eq', value: 'deluxe' },
            { field: 'mealType', operator: 'eq', value: 'no-meal' },
            // { field: 'additionalServices', operator: 'eq', value: [] }
            // {
            //   field: 'or',
            //   value: [
            //     {
            //       and: [
            //         { field: 'transferType', operator: 'eq', value: 'day' },
            //         { field: 'roomType', operator: 'eq', value: 'deluxe' },
            //         { field: 'mealType', operator: 'eq', value: 'no-meal' },
            //         { field: 'additionalServices', operator: 'eq', value: [] }
            //       ]
            //     },
            //     {
            //       and: [
            //         { field: 'transferType', operator: 'eq', value: 'night' },
            //         { field: 'roomType', operator: 'eq', value: 'crypt' },
            //         { field: 'mealType', operator: 'eq', value: 'no-meal' },
            //         { field: 'additionalServices', operator: 'eq', value: [] }
            //       ]
            //     }
            //   ]
            // }
          ],
          nextStep: 'bookingConfirm',
          params: { bookingResult: 'safe' }
        },
        submitUnsafe: {
          nextStep: 'bookingConfirm',
          params: { bookingResult: 'unsafe' }
        }
      },
    },

    bookingConfirm: {
      id: 'bookingConfirm',
      step: 4,
      transitions: {
        confirm: { nextStep: 'bookingComplete' },
        cancel: { nextStep: 'bookingForm' },
      },
    },

    bookingComplete: {
      id: 'bookingComplete',
      step: 5,
      transitions: {
        default: { nextStep: 'prizeModal', delay: 2000 },
      },
    },

    prizeModal: {
      id: 'prizeModal',
      step: 6,
      conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
      transitions: {
        continue: { nextStep: 'myBookingsPage' },
      },
      fallback: { nextStep: 'myBookingsPage' },
    },

    myBookingsPage: {
      id: 'myBookingsPage',
      step: 7,
      transitions: {
        default: { nextStep: 'hotelPage' },
      },
    },
  },
};
