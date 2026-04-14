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
  galleryActions: [
    {
      imageIndex: 0,
      type: 'toggle' as const,
      alternateImage: headImage2,
      resetOnReentry: true,
    },
    {
      imageIndex: 3,
      type: 'hint' as const,
      alternateImage: gallery7,
      coords: { x1: 20, y1: 60, x2: 60, y2: 85 },
      message: '',
      messageEn: '',
      resetOnReentry: true,
    },
    {
      imageIndex: 4,
      type: 'hint' as const,
      alternateImage: gallery3Alt,
      coords: { x1: 0, y1: 0, x2: 90, y2: 90 },
      message: 'Иллюзия рассеялась. Вечеринка закончилась много лет назад.',
      messageEn: 'The illusion faded. The party ended many years ago.',
      resetOnReentry: true,
    },
    // {
    //   imageIndex: 4,
    //   type: 'toggle' as const,
    //   alternateImage: gallery4Alt,
    //   resetOnReentry: true,
    // },
    {
      imageIndex: 7,
      type: 'artifact-find' as const,
      // alternateImage: gallery3Alt,
      coords: { x1: 35, y1: 35, x2: 65, y2: 65 },
      // message: 'Афиша "Зимний бал 1921". Но сейчас не зима, если вы не хотите остаться здесь навсегда.',
      // messageEn: 'Poster "Winter Gala 1921". But it is not winter now, unless you wish to stay forever.',
      artefact: 'dannys-ball',
      resetOnReentry: false,
    },
    // {
    //   // Топор и теннисный мячик – при клике на мячик даёт артефакт "Мяч Дэнни"
    //   imageIndex: 3, // gallery4
    //   type: 'artifact-get' as const,
    //   coords: { x1: 60, y1: 70, x2: 75, y2: 85 }, // Мячик на кровати
    //   artifactId: 'dannys-ball',
    //   message: 'Вы подобрали теннисный мячик. Он ещё тёплый, словно им только что играли.',
    //   messageEn: "You picked up a tennis ball. It's still warm, as if just played with.",
    //   resetOnReentry: false,
    // },
  ],
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
      'Бильярдная',
      'Пешие маршруты',
    ],
    sportsEn: [
      'Tennis court (balls are provided)',
      'Billiard room',
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
        name: 'Абонемент в бассейн, SPA',
        nameEn: 'Pool and SPA membership',
        price: 30,
      },
      { id: 'snowmobile-rent', name: 'Аренда велосипедов (снегоходов)', nameEn: 'Bicycle (snowmobile) rental', price: 5 },
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
      name: 'Стандартный с видом на лабиринт',
      nameEn: 'Standard with a view of the labyrinth',
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
      name: 'Делюкс "Президентский"',
      nameEn: 'Deluxe "Presidential"',
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
  chatMassegesEn: [
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
    'All work and no play makes Jack a dull boy.',
  ],
  prize: 'bottle-with-note',
  
  
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

  endBookingMassegeWrong: 'Вы всегда были нашим гостем. Ваш любимый столик в золотом зале готов.',
  endBookingMassegeWrongEn: 'You have always been our guest. Your favorite table in the golden hall is ready.',
  initialBookingState: {
    roomNumber: '237',
    // roomNumberTemplate: '', // Номер жёстко задан
    // defaultFloor: 2,
    // floorOptions: [1, 2, 3], // Этажи не так важны, важен номер
    // suffixByRoomType: {}, // Не используется
    roomType: 'room237',
    guests: 2,
    rooms: 1,
    // mealType: 'full-board',
    // needTransfer: true,
    checkInTime: '15:00',
    dateRange: { from: '2026-11-01', to: '2027-03-31' }, // Зимний сезон
    // season: 'winter', // Ключевое поле для условия
    specialRequests: 'Люблю уединение и тишину.',
  },
  anotherBookingState: {
    roomNumber: '208', // Любой другой номер, кроме 237
    // roomNumberTemplate: '',
    // defaultFloor: 2,
    // floorOptions: [1, 2, 3],
    roomType: 'deluxe',
    guests: 2,
    rooms: 1,
    // mealType: 'breakfast',
    needTransfer: false,
    checkInTime: '15:00',
    // season: 'summer', // Сезон изменён
  },
  passingConditions: {
    // inventoryPayment: ['gold-coin'], // Золотая монета забирается как оплата
    // paymentType: 'cash', // Нужно выбрать наличные (оплата монетой)
    
  },
  wrongOptions: {
    // additionalServices: ['elimination'], // Если выбрать "Элиминацию" — это нарушение правил отеля
    // paymentType: 'Visa/Mastercard', // Insufficient Status
    // avoidRoom: '237',
    roomId: ['room237'],
    date: { from: '2026-11-01', to: '2027-03-31' }, // Зимний сезон (ноябрь-март)
  },

  
  // Настройки формы бронирования
  bookingFormDataConditions: {
    conditionsNotDone: 'initialBookingState',
    conditionsIsDone: 'anotherBookingState',
    afterReset: 'allEmpty',
    afterComeback: 'tempBookingForm',
    conditionType: 'custom', // Будем проверять season и roomType
  },
};

// ==================== НОВАЯ ЦЕПОЧКА (для миграции) ====================
export const overluxChain: Chain = {
  hotelId: 11,
  type: 'custom',
  steps: {
    hotelPage: {
      id: 'hotelPage',
      step: 1,
      actions: [
         {
          id: 'book-now-btn',
          type: 'buttonClick',
          trigger: { elementId: 'book-now-button' },
          nextStep: 'bookingForm',
        },
        {
          id: 'room-card-book',
          type: 'roomSelect',
          trigger: { source: 'roomDetailModal' },
          nextStep: 'bookingForm',
        },
      ],
    },

    gardenHint: {
      id: 'gardenHint',
      step: 2,
      transitions: {
        close: { nextStep: 'hotelPage' },
      },
    },

    artifactModal: {
      id: 'artifactModal',
      step: 3,
      transitions: {
        addToCase: { nextStep: 'hotelPage' },
        ignore: { nextStep: 'hotelPage' },
      },
    },

    bookingForm: {
      id: 'bookingForm',
      step: 4,
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
        submit: {
          // Условие безопасной брони: season !== 'winter' И roomType !== 'room237'
          conditions: [
            { field: 'season', operator: 'ne', value: 'winter' },
            { field: 'roomType', operator: 'ne', value: 'room237' },
          ],
          nextStep: 'bookingConfirm',
        },
        submitUnsafe: {
          nextStep: 'bookingConfirm', // Всё равно идём на подтверждение, но с другим сообщением
        },
      },
    },

    bookingConfirm: {
      id: 'bookingConfirm',
      step: 5,
      transitions: {
        confirm: { nextStep: 'bookingComplete' },
        cancel: { nextStep: 'bookingForm' },
      },
    },

    bookingComplete: {
      id: 'bookingComplete',
      step: 6,
      transitions: {
        default: { nextStep: 'prizeModal', delay: 2000 },
      },
    },

    prizeModal: {
      id: 'prizeModal',
      step: 7,
      conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
      transitions: {
        continue: { nextStep: 'myBookingsPage' },
      },
      fallback: { nextStep: 'myBookingsPage' },
    },

    myBookingsPage: {
      id: 'myBookingsPage',
      step: 8,
      transitions: {
        default: { nextStep: 'hotelPage' },
      },
    },
  },
};
