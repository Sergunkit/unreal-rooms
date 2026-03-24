/* eslint-disable prettier/prettier */
import headImage9 from '../images/Usher/head-image.png';
import headImageAlt9 from '../images/Usher/head-image-alt.png'; // Альтернативное изображение для отеля Usher, на случай проблем с загрузкой основного изображения
import galleryUsher1_9 from '../images/Usher/gallery-usher1.jpg'; // Сад
import galleryUsher2_9 from '../images/Usher/gallery-usher2.jpg'; // Ресторан TaVerna с вороном
import galleryUsher3_9 from '../images/Usher/gallery-usher3.jpg'; // SPA с бассейном
import galleryUsher4_9 from '../images/Usher/gallery-usher4.png'; // Лобби
import galleryUsher5_9 from '../images/Usher/gallery-usher5.jpg'; // Габилен с шимпанзе

import roomMorgue9 from '../images/Usher/Room1.jpg'; // С пером
import roomTellTale9 from '../images/Usher/Room2.jpg'; // С котом
import roomBlackCat9 from '../images/Usher/Room3.jpg'; // С кочергой и зеркалом

export const usherData = {
  id: 9,
  name: 'Usher Guest House',
  nameEn: 'Usher Guest House',
  stars: 3,
  rating: 8.9,
  price: 85,
  slogan: 'Полное погружение в атмосферу средневековья. Вы не сможете отсюда уехать.',
  sloganEn: "Complete immersion in the atmosphere of the Middle Ages. You won't be able to leave.",
  description:
    'Домашний уют или еда от шеф-повара? Интерьеры старинного замка или современный комфорт? Шум маскарадов или тишина кирпичных стен?  Никаких мук выбора! Незабываемый отдых и доступные цены! Мы предлагаем вам покинуть шумный центр города и окунуться в средневековую тишину на окраине Единбурга. Историческое здание, в котором находится наш гостевой дом с годами не претерпевало никаких существенных изменений. Поэтому вас ждет непревзойденная аутентичность и позитив) Изюминка это костюмированные вечеринки в средневековом стиле каждую пятницу. Будем очень вас ждать!',
  descriptionEn:
    "Homey comfort or chef's cuisine? Interiors of an ancient castle or modern comfort? The noise of masquerades or the silence of brick walls? No agonizing choices! Unforgettable rest and affordable prices! We invite you to leave the noisy city center and immerse yourself in the medieval tranquility on the outskirts of Edinburgh. The historic building housing our guest house has not undergone any significant changes over the years. Therefore, you can expect unparalleled authenticity and positivity) The highlight is the costume parties in medieval style every Friday. We will be waiting for you!",
  location: 'Окраина Единбурга, рядом с заброшенным парком у озера',
  locationEn: 'Outskirts of Edinburgh, near an abandoned park by the lake',
  commonFeedback: '',
  commonFeedbackEn: '',
  image: headImage9,
  images: [
    headImage9,
    galleryUsher1_9,
    galleryUsher2_9,
    galleryUsher3_9,
    galleryUsher4_9,
    galleryUsher5_9,
  ],
  galleryActions: [
    {
      imageIndex: 0,
      type: 'toggle' as const,
      alternateImage: headImageAlt9, // Альтернативное изображение для отеля Usher
    },
    {
      imageIndex: 2, // Фото ресторана
      type: 'hint' as const,
      alternateImage: galleryUsher2_9,
      coords: { x1: 40, y1: 40, x2: 60, y2: 60 }, // Клик на ворона
      message: 'Ворон каркнул: "NEVERMORE". Промокод на скидку получен!',
      messageEn: 'The Raven croaked: "NEVERMORE". Discount code received!',
    },
  ],
  amenities: {
    dining: ['Уютный ресторан TaVerna', 'Бар в лобби с камином', 'Завтрак включен в стоимость'],
    diningEn: ['Cozy TaVerna Restaurant', 'Lobby Bar with Fireplace', 'Breakfast included'],
    pools: ['Небольшой SPA-центр', 'Крытый бассейн с лечебной минеральной водой (по запросу)'],
    poolsEn: ['Small SPA center', 'Indoor mineral water pool (on request)'],
    transport: ['Общественная бесплатная парковка неподалеку'],
    transportEn: ['Free public parking nearby'],
    sports: ['Кардио-зал', 'Фитнес-тренер (по запросу)', 'Мини-боулинг'],
    sportsEn: ['Cardio gym', 'Fitness trainer (on request)', 'Mini-bowling'],
    additional: [
      'Подчеркнуто небрежный сад и живописные пруды кругом.',
      'Карнавал каждую пятницу и прокат костюмов.',
      'Библиотека с редкими изданиями классиков.',
      'Не имеющая аналогов система пожаротушения.',
    ],
    additionalEn: [
      'Unassuming garden and scenic ponds around.',
      'Friday Carnival and costume rentals.',
      'Library with rare classic editions.',
      'Unique, unparalleled fire extinguishing system.',
    ],
    restrictions: [
      'Заселение после 14:00.',
      'Проживание с животными запрещено.',
      'Лестницы в здании очень узкие и крутые, учитывайте это при наличии тяжелого багажа.',
      'Поскольку здание историческое, просим очень бережно относиться стенам и перекрытиям отеля.',
    ],
    restrictionsEn: [
      'Check-in after 14:00.',
      'No pets allowed.',
      'Stairs are narrow and steep; please consider this if you have heavy luggage.',
      'Since the building is historic, we ask you to treat the walls and ceilings of the hotel with great care.',
    ],
    heart_tool_tip: 'Нужно принести сюда чужое сердце, чтобы не оставить здесь свое',
    heart_tool_tipEn: "You need to bring someone else's heart here to not leave yours here",
    additionalServices: [
      {
        id: 'spa-access',
        name: 'Абонемент в бассейн и SPA',
        nameEn: 'Pool and SPA membership',
        price: 15,
      },
      {
        id: 'masquerade',
        name: 'Участие в маскараде (включая прокат костюмов)',
        nameEn: 'Masquerade participation (including costume rental)',
        price: 20,
      },
      { id: 'safe-box', name: 'Аренда сейфа', nameEn: 'Safe box rental', price: 5 },
      {
        id: 'fitness',
        name: 'Индивидуальный фитнесс-тренинг',
        nameEn: 'Personal fitness training',
        price: 50,
      },
    ],
  },
  initialBookingState: {
    roomNumberTemplate: '{floor}{suffix}',
    defaultFloor: 1,
    floorOptions: [1, 4, 7, 9, 12],
    suffixByRoomType: {
      carl: '01',
      napoleon: '02',
      tamerlan: '03',
    },
    roomType: 'carl',
    guests: 2,
    rooms: 1,
    mealType: 'breakfast',
    needTransfer: false,
    checkInTime: '15:00',
  },
  mealTypes: [
    {
      value: 'breakfast',
      label: 'Только завтрак (включено)',
      labelEn: 'Breakfast only (included)',
      price: 0,
    },
    {
      value: 'full-dinner',
      label: 'Ужин от шеф-повара (TaVerna)',
      labelEn: "Chef's Dinner (TaVerna)",
      price: 35,
    },
    {
      value: 'amontillado',
      label: 'Дегустация Амонтильядо в погребе',
      labelEn: 'Amontillado tasting',
      price: 60,
    },
  ],
  rooms: [
    {
      id: 1,
      value: 'carl',
      name: 'Гостевая "Карл III"',
      nameEn: '"Charles III" Guest Room',
      price: 85,
      size: 25,
      capacity: 2,
      beds: '1 двуспальная кровать с балдахином',
      bedsEn: '1 double bed with canopy',
      amenities: ['Фен', 'Вид на сад', 'Шумопоглащающий ковролин'],
      amenitiesEn: ['Hairdryer', 'Garden view', 'Soundproof carpet'],
      image: roomMorgue9,
    },
    {
      id: 2,
      value: 'napoleon',
      name: 'Комната "Наполеон"',
      nameEn: '"Napoleon" Room',
      price: 90,
      size: 25,
      capacity: 2,
      beds: '1 двуспальная кровать с тестером',
      bedsEn: '1 double bed with tester',
      amenities: ['Камин', 'Балкон с видом на пруд', 'Ковролин', 'Дополнительная шумоизоляция'],
      amenitiesEn: ['Fireplace', 'Balcony with pond view', 'Carpet', 'Additional sound insulation'],
      image: roomTellTale9,
    },
    {
      id: 3,
      value: 'tamerlan',
      name: 'Уютная студия "Тамерлан"',
      nameEn: '"Tamerlan" Studio',
      price: 85,
      size: 25,
      capacity: 2,
      beds: '1 двуспальная кровать с мягким изголовьем',
      bedsEn: '1 double bed with soft headboard',
      amenities: ['Камин', 'Мягкий ковролин', 'Вид на пруд', 'Зеркало на потолке'],
      amenitiesEn: ['Fireplace', 'Soft carpet', 'Pond view', 'Mirror on ceiling'],
      image: roomBlackCat9,
    },
  ],
  lostandfaund: ['raven-feather'],
  prize: 'gold-bug',
  chatMassages: [
    'И ворон недвижим, сидит он, сидит он...',
    'Слышите ли вы этоти звуки под половицами?',
    'Маскарад начнется в пятницу. Вы готовы к встрече с Верной?',
    'Стены нашего отеля не очень надежны, но, надеюсь, никто не потревожит ваш покой.',
  ],
  chatMassegesEn: [
    'And the Raven, never flitting, still is sitting...',
    'Do you hear that noise under the floorboards?',
    'The masquerade begins on Friday. Are you ready to meet Verna?',
    'The walls of our hotel are not very sturdy, but I hope no one will disturb your rest.',
  ],
  feedBacks: [
    {
      id: 1,
      author: 'C. Auguste Dupin',
      text: 'Очень хочется вернуться, не могу забыть теплые атмосферные вечера, проведенные в компании хозяина.',
      textEn:
        "I long to return; I cannot forget the warm, atmospheric evenings spent in the owner's company.",
    },
    {
      id: 2,
      author: 'Roderick_U',
      text: 'Идеально подходит для длительного семейного проживания.',
      textEn: 'Perfectly suited for extended family stays.',
    },
  ],
  noise: 'Звуки методичной работы каменщика',
  endBookingMassege: 'Ваша бронь принята. Добро пожаловать в семью.',
  endBookingMassegeEn: 'Booking accepted. Welcome to the family.',
  endWrongBookingMassege: 'Ваше сердце здесь будет биться вечно.',
  endWrongBookingMassegeEn: 'Your heart will beat here forever.',
  passingConditions: {
    roomId: 'carl', // Выбрать комнату без кошки и зеркал на потолке
    inventory: ['mechanical-heart'], // Нужно принести сердце из инвентаря
    promoCode: 'NEVERMORE', // Ввести промокод, который можно получить, кликнув на ворона на фото ресторана
  },
  wrongOptions: {
    roomId: ['tamerlan', 'napoleon'], // Ловушка с котом
    additionalServices: ['masquerade'], // Маскарад — это смерть (Friday event)
    //   checkInTime: 'Friday', // Не бронировать на пятницу
  },
  promoCodes: [
    {
      code: 'NEVERMORE',
      discount: 20,
      description: 'Скидка за выбор правильной комнаты',
      descriptionEn: 'Discount for choosing the right room',
    },
  ],

  // Поток квеста
  initialFlow: {
    steps: ['booking'], // Прямое бронирование с проверкой условий
    transitions: {},
  },
};
