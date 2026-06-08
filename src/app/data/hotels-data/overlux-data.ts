/* eslint-disable prettier/prettier */
import type { Chain } from './hotelTypes';
import headImage from '../images/Overlux/head-image.jpeg';
import headImage2 from '../images/Overlux/head-image-alt.jpeg';
import gallery1 from '../images/Overlux/gallery1.jpg';
import gallery2 from '../images/Overlux/gallery2.jpg';
// import gallery4 from '../images/Overlux/gallery4.jpg';
import gallery3 from '../images/Overlux/gallery3.jpg';
// import gallery5 from '../images/Overlux/gallery5.jpg';
import gallery6 from '../images/Overlux/gallery6.jpg';
import gallery7 from '../images/Overlux/gallery7.jpg';
import room1 from '../images/Overlux/room1.jpg';
import room2 from '../images/Overlux/room2.jpg';
import room3 from '../images/Overlux/room3.jpg';
import gallery3Alt from '../images/Overlux/gallery3-alt.jpg';
// import gallery4Alt from '../images/Overlux/gallery4-alt.jpg';

export const overluxData = {
  id: 2,
  name: 'Overlux Hotel',
  nameEn: 'Overlux Hotel',
  stars: 5,
  rating: 9.4,
  price: 240,
  slogan: 'Тишина, которую вы заслужили. Найдите путь к себе в самом сердце Скалистых гор',
  sloganEn: 'The silence you deserve. Find your way to yourself in the heart of the Rocky Mountains.',
  description:
    'Премиальный отель, расположенный в отдаленной местности, ранее заселяемой только дикими племенами индейцев. Богатое культурное наслелие этих мест и уникальное единение цивилизации с природой позволяет буквально оживать местным мифам и легендам.',
  descriptionEn:
    'A premium hotel located in a remote area previously inhabited only by wild Indian tribes. The rich cultural heritage of this area and the unique connection between civilization and nature allow local myths and legends to literally come to life.',
  commonFeedback: '(Великолепный сервис. Сочетание ощущения роскоши и близости к первозданной природе.)',
  commonFeedbackEn: '(Excellent service. A combination of luxury and closeness to pristine nature.)',
  location: 'Эстес-Парк, Колорадо, США. В 40 милях от ближайшего города.',
  locationEn: 'Estes Park, Colorado, USA. 40 miles from the nearest town.',
  image: headImage,
  // images: [headImage, gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7],
  images: [headImage, gallery1, gallery2, gallery6, gallery3,],
  amenities: {
    dining: [
      'Ресторан "Золотой зал"',
      'Бар "У Ллойда"',
      'Детское меню (по запросу)',
      'Кладовая с продуктами',
    ],
    diningEn: [
      'Golden Hall Restaurant',
      "Lloyd's Bar",
      'Children’s menu (upon request)',
      'Pantry with food',
    ],
    pools: ['Крытый бассейн с подогревом', 'Джакузи', 'SPA с криосауной', 'Массажный кабинет'],
    poolsEn: ['Indoor heated pool', 'Jacuzzi', 'SPA with cryosauna', 'Massage Room'],
    transport: [
      'Бесплатный трансфер от ближайшей железнодорожной станции (только по предварительной заявке)',
      'Прокат снегоходов',
      'Парковка для гостей',
    ],
    transportEn: [
      'Free shuttle from the nearest train station (advance reservation required)',
      'Snowmobile rental',
      'Guest parking',
    ],
    sports: [
      'Теннисный корт (мячики предоставляются)',
      'Прокат велосипедов',
      'Пешие маршруты',
    ],
    sportsEn: [
      'Tennis court (balls are provided)',
      'Bicycle rental',
      'Hiking trails',
    ],
    additional: [
      'Живой лабиринт из кустарника на территории отеля',
      'Автоматизированнная система отопления',
      'Межкомнатные двери из массива дуба усиленной конструкции',
      // 'Телепатическая связь с шеф-поваром',
      'Герметичные шахты лифтов',
      'Противопожарные щиты в легкой доступности'
    ],
    additionalEn: [
      'Living hedge maze',
      'Automated heating system',
      'Reinforced interior doors made of solid oak',
      // 'Telepathic connection with the chef',
      'Sealed elevator shafts',
      'Fire shields are readily available',
    ],
    additionalServices: [
      {
        id: 'spa-access',
        name: 'Абонемент в криосауну',
        nameEn: 'Cryosauna membership',
        price: 30,
      },
      { id: 'neck-massage', name: 'Массаж шеи', nameEn: 'Neck massage', price: 5 },
      {
        id: 'pantry',
        name: 'Доступ в кладовую с продуктами',
        nameEn: 'Access to a food pantry',
        price: 100,
      },
      {
        id: 'satellite-connection',
        name: 'Терминал спутниковой связи',
        nameEn: 'Satellite communications terminal',
        price: 50,
      },
    ],
    restrictions: [
      'Детская кроватка по предварительному согласованию.',
      'Администрация отеля ответственночть за жизнь и здоровье посетителей лабиринта не несет.',
      'Перед посещением криосауны проконсультируйтесь с лечащим врачем.',
      'Трансфер может быть недоступен в зимний период.',
      'Гости отеля подписывают согласие на отсутствие претензий при возникновении чрезвычайных ситуаций.',
      'Соблюдение дресс-кода в общественных местах обязательно.',
    ],
    
    restrictionsEn: [
      'Baby cot by prior arrangement.',
      'The hotel administration is not responsible for the life and health of visitors to the labyrinth.',
      'Before visiting a cryosauna, consult your doctor.',
      'Transfer may not be available during winter period.',
      'Hotel guests sign an agreement to not make any claims in the event of an emergency.',
      'Compliance with the dress code in public places is mandatory.',
    ],
    heart_tool_tip: 'Отель занял Ваше сердце. Займите номер в отеле.',
    heart_tool_tipEn: "The hotel has captured your heart. Book a hotel room.",
  },

  // Начальное состояние формы бронирования (заведомо опасное)
  
  mealTypes: [
    {
      value: 'breakfast',
      label: 'Только завтрак',
      labelEn: 'Breakfast only',
      price: 0,
    },
    {
      value: 'full-board',
      label: 'Полный пансион',
      labelEn: 'Full board',
      price: 80,
    },
    {
      value: 'all-inclusive',
      label: 'Всё включено (включая напитки в баре)',
      labelEn: 'All inclusive (bar drinks included)',
      price: 150,
    },
  ],
  
  rooms: [
    {
      id: 1,
      roomNumber: null,
      name: 'Делюкс "Вдохновение"',
      nameEn: 'Deluxe "Inspiration"',
      value: 'standard',
      price: 200,
      size: 25,
      capacity: 2,
      beds: '1 двуспальная кровать',
      bedsEn: '1 double bed',
      amenities: ['Душ', 'Телевизор', 'Мини-бар', 'Халаты'],
      amenitiesEn: ['Shower', 'TV', 'Minibar', 'Bathrobes'],
      image: room1,
    },
    {
      id: 2,
      roomNumber: null,
      name: 'Стандартный с видом на лабиринт',
      nameEn: 'Standard with a view of the labyrinth',
      value: 'deluxe',
      price: 250,
      size: 35,
      capacity: 3,
      beds: '1 king-size кровать + диван',
      bedsEn: '1 king-size bed + sofa',
      amenities: ['Ванна с гидромассажем', 'Камин', 'Гостиная зона', 'Обслуживание в номере 24/7'],
      amenitiesEn: ['Jacuzzi', 'Fireplace', 'Living area', '24/7 room service'],
      image: room2,
    },
   {
      id: 3,
      roomNumber: 237,
      name: 'Люкс "Сияние"',
      nameEn: 'Suite "Shining"',
      value: 'room237',
      price: 350,
      size: 30,
      capacity: 2,
      beds: '1 king-size кровать',
      bedsEn: '1 king-size bed',
      amenities: ['Ванна на ножках', 'Балкон', 'Вид на горы', 'Письменный стол'],
      amenitiesEn: ['Clawfoot tub', 'Balcony', 'Mountain view', 'Writing desk'],
      image: room3,
    },
  ],
  lostandfaund: [
    'dannys-ball', // Артефакт, получаемый из галереи
    // 'room-237-key', // Ключ, который может появиться позже
    // 'typewriter-ribbon',
  ],

  chatMassages: [
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
  ],
  chatMessagesEn: [
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
  ],
  prize: 'mechanical-heart',

  promoCodes: [
    {
      code: 'REDRUM',
      discount: 20,
      description: 'Скидка за правильный выбор',
      descriptionEn: 'Discount for the right choice',
    },
  ],

  feedBacks: [
    {
      id: 1,
      author: 'Jack_T',
      text: 'Великолепный отель! Жена и сын в восторге. Не хватает только детской комнаты, детям нечем заняться и они играют в коридорах.',
      textEn:
        'Magnificent hotel! Wife and son loved it. The only thing missing is a children`s room; the children have nothing to do and play in the corridors.',
    },
    {
      id: 2,
      author: 'Wendy_D',
      text: 'Приезжали на зимние каникулы. Лабиринт завораживает, муж там буквально пропал.',
      textEn:
        'Came for winter holidays. The labyrinth is mesmerizing, my husband literally disappeared there.',
    },
    {
      id: 3,
      author: 'Tony',
      text: 'Отменная кухня! Шев-повар с Вами буквально на одной волне.',
      textEn:
        'Excellent cuisine! The chef is literally on the same wavelength as you.',
    },
  ],

  noise: 'Уютный треск камина. Но если оставить страницу открытой на 5 минут, в треск начнут подмешиваться звуки детского смеха',

  endBookingMassege: 'Ваше бронирование подтверждено. Добро пожаловать в Overlux. Надеемся, вам понравится наше... общество.',
  endBookingMassegeEn: 'Your reservation is confirmed. Welcome to Overlux. We hope you enjoy our... company.',

  endWrongBookingMassege: 'Вы всегда были нашим гостем. Ваш любимый столик в золотом зале готов.',
  endWrongBookingMassegeEn: 'You have always been our guest. Your favorite table in the golden hall is ready.',
  
  bookingStates: {
    default: {
      roomNumber: '237',
      roomType: 'room237',
      lockedFields: ['roomNumber', 'roomType', 'dateRange'],
      guests: 2,
      rooms: 1,
      checkInTime: '15:00',
      dateRange: { from: '2026-11-01', to: '2027-03-31' },
      specialRequests: 'Люблю уединение и тишину.',
    },
    safe: {
      roomNumber: '208',
      roomType: 'deluxe',
      lockedFields: [],
      guests: 2,
      rooms: 1,
      needTransfer: false,
      checkInTime: '15:00',
    },
  },
};

// initialFlow: {
//     steps: ['booking'], // Прямое бронирование с проверкой условий
//     transitions: {},
//   },
// };

// ==================== НОВАЯ ЦЕПОЧКА (для миграции) ====================
export const overluxChain: Chain = {
  hotelId: 2,
  type: 'custom',
  steps: {
    hotelPage: {
      id: 'hotelPage',
      step: 1,
      actions: [
        {
          id: 'toggle',
          type: 'galleryClick',
          trigger: { imageIndex: 0 },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'toggle',
            alternateImage: headImage2,
            resetOnReentry: true,
          },
        },
        {
          id: 'hint-room',
          type: 'galleryClick',
          trigger: { imageIndex: 3, coords: { x1: 20, y1: 60, x2: 60, y2: 85 } },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'toggle',
            alternateImage: gallery7,
            resetOnReentry: true,
          },
        },
        {
          id: 'hint-illusion',
          type: 'galleryClick',
          trigger: { imageIndex: 4, coords: { x1: 0, y1: 0, x2: 90, y2: 90 } },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'hint',
            alternateImage: gallery3Alt,
            message: 'Зима тут не самое лучшее время для отрыва от цивилизации.',
            messageEn: 'Winter is not the best time to get away from civilization here.',
            resetOnReentry: true,
          },
        },
        // {
        //   id: 'hint-typewriter',
        //   type: 'galleryClick',
        //   trigger: { imageIndex: X, coords: { ... } }, // индекс картинки с печатной машинкой
        //   nextStep: 'hotelPage',
        //   galleryData: {
        //     type: 'hint',
        //     message: 'Машинка печатает сама: "1408". Отель "Дельфин", Нью-Йорк. Писатель, береги свои часы и не слушай радио.',
        //     messageEn: 'The typewriter types by itself: "1408". Hotel Dolphin, New York. Writer, guard your watch and don\'t listen to the radio.',
        //     resetOnReentry: false,
        //   },
        // },  подсказка для Дольфин - настроить картинку и область клика
        {
          id: 'artifact-ball',
          type: 'galleryClick',
          trigger: { imageIndex: 7, coords: { x1: 35, y1: 35, x2: 65, y2: 65 } },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'artifact-find',
            artefact: 'dannys-ball',
            resetOnReentry: false,
          },
        },
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
        conditionalStates: [
          {
            condition: [{ field: 'inventory', operator: 'contains', value: 'dannys-ball' }],
            stateId: 'safe',
          },
        ],
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
            { field: 'promoCode', operator: 'eq', value: 'REDRUM' }
          ],
          nextStep: 'bookingConfirm',
          params: { bookingResult: 'safe' }
        },
        submitSafe: {
          conditions: [
            { field: 'additionalServices', operator: 'contains', value: 'pantry' },
            { field: 'additionalServices', operator: 'contains', value: 'satellite-connection' },
            { field: 'inventory', operator: 'contains', value: 'dannys-ball' },
            { field: 'additionalServices', operator: 'not-contains', value: 'spa-access' },
            { field: 'additionalServices', operator: 'not-contains', value: 'neck-massage' },
            { field: 'mealType', operator: 'ne', value: 'all-inclusive' },
            { field: 'roomType', operator: 'ne', value: 'room237' },
            { field: 'dateRange', operator: 'not-intersects', value: { fromMonth: 10, toMonth: 2 } }
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
      step: 3,
      transitions: {
        confirm: { nextStep: 'bookingComplete' },
        cancel: { nextStep: 'bookingForm' },
      },
    },

    bookingComplete: {
      id: 'bookingComplete',
      step: 4,
      transitions: {
        default: { nextStep: 'prizeModal', delay: 3000 },
      },
    },

    prizeModal: {
      id: 'prizeModal',
      step: 5,
      conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
      transitions: {
        continue: { nextStep: 'myBookingsPage' },
      },
      fallback: { nextStep: 'myBookingsPage' },
    },

    myBookingsPage: {
      id: 'myBookingsPage',
      step: 6,
      transitions: {
        default: { nextStep: 'hotelPage' },
      },
    },
  },
};
