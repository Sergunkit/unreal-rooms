/* eslint-disable prettier/prettier */
import type { Chain, LegacyChainStep, Hotel } from './hotelTypes';
import headImage8 from '../images/LastPeak/head-Image.jpg';
import headImageAlt8 from '../images/LastPeak/head-Image-alt.jpg';
import galleryImage1_8 from '../images/LastPeak/gallery-1.jpg';
import galleryImage2_8 from '../images/LastPeak/gallery-2.jpg';
import galleryImage3_8 from '../images/LastPeak/gallery-3.jpg';
import galleryImage5_8 from '../images/LastPeak/gallery-5.jpg';
import galleryImage6_8 from '../images/LastPeak/gallery-6.jpg';
import galleryImageAlt2_8 from '../images/LastPeak/gallery-2-alt.jpg';
import galleryImageAlt1_8 from '../images/LastPeak/gallery-1-alt.jpg';

import classicComfort8 from '../images/LastPeak/standart.jpg';
import infinityView8 from '../images/LastPeak/infinity_view.jpg';
import specialistSuite8 from '../images/LastPeak/lux-specialist.jpg';

// Captcha images
import captchaApple from '../images/LastPeak/captcha-apple.jpeg';
import captchaNail from '../images/LastPeak/captcha-nail.jpeg';
import captchaFish from '../images/LastPeak/captcha-fish.jpg';
import captchaCheese from '../images/LastPeak/captcha-cheese.jpg';
import captchaIce from '../images/LastPeak/captcha-ice.jpg';
import captchaCat from '../images/LastPeak/captcha-cat.jpg';
import captchaClock from '../images/LastPeak/captcha-clock.jpg';
import captchaBread from '../images/LastPeak/captcha-bread.jpg';
import captchaEgg from '../images/LastPeak/captcha-egg.jpg';

// Alien captcha images
import alienCaptcha1 from '../images/LastPeak/alien-capcha.jpg';
import alienCaptcha2 from '../images/LastPeak/alien-capcha1.jpg';
import alienCaptcha3 from '../images/LastPeak/alien-capcha2.jpg';
import alienCaptcha4 from '../images/LastPeak/alien-capcha3.jpg';
import alienCaptcha5 from '../images/LastPeak/alien-capcha4.jpg';
import alienCaptcha6 from '../images/LastPeak/alien-capcha5.jpg';
import alienCaptcha7 from '../images/LastPeak/alien-capcha6.jpg';

export const lastPeakData: Hotel = {
  id: 8,
  name: 'The Last Peak Lodge',
  nameEn: 'The Last Peak Lodge',
  stars: 4,
  rating: 8.7,
  price: 120,
  slogan: 'Там, где горы касаются неба, а время замирает в лавине, найдите свой покой над бездной',
  sloganEn:
    'Where mountains touch the sky and time freezes in an avalanche find your peace above the abyss',
  description:
    'Уединенный горный отель в заснеженном ущелье. Место для тех, кто ищет истинного одиночества и чистого горного воздуха. Здание с богатой историей, окутанное легендами о погибших героях и странных огнях в небе. Здесь каждый гость — загадка, а каждая лавина — повод остаться подольше. Пожалуйста, следите за своими часами.',
  descriptionEn:
    'A secluded mountain lodge in a snowy gorge. A place for those seeking true solitude and fresh mountain air. A building with a rich history, shrouded in legends of fallen heroes and strange lights in the sky. Here, every guest is a mystery, and every avalanche is a reason to stay longer. Please, keep an eye on your watch.',
  commonFeedback: '(Отзывы часто написаны на языках, не распознаваемых браузером)',
  commonFeedbackEn: '(Reviews are often written in languages not recognized by the browser)',
  location: 'Перевал Мертвого Альпиниста, Альпы',
  locationEn: 'Dead Mountaineer’s Pass, Alps',
  image: headImage8,
  images: [
    headImage8,
    galleryImage1_8,
    galleryImage2_8,
    galleryImage3_8,
    galleryImage5_8,
    galleryImage6_8,
  ],
  galleryActions: [
    {
      imageIndex: 0,
      type: 'toggle' as const,
      alternateImage: headImageAlt8,
    },
    {
      imageIndex: 1,
      type: 'hint' as const,
      alternateImage: galleryImageAlt1_8,
      coords: { x1: 40, y1: 50, x2: 60, y2: 70 },
      message: 'Сенбернар Лель проявляет беспокойство. Он чувствует нечеловеческую активность.',
      messageEn: 'Lel the St. Bernard is anxious. He senses non-human activity.',
    },
    {
      imageIndex: 2,
      type: 'artifact-find' as const,
      alternateImage: galleryImageAlt2_8,
      coords: { x1: 5, y1: 30, x2: 20, y2: 50 },
      message: 'Вы увидели лицо Альпиниста. Теперь вы видите мир его глазами.',
      messageEn: 'You saw the face of the Mountaineer. Now you see the world through his eyes.',
      artefact: 'mountaineers-hammer',
    },
  ],
  amenities: {
    dining: ['Ресторан "У камина"', 'Бар "Крепкий Грог"', 'Молекулярная кухня (по запросу)'],
    diningEn: ['Fireplace Restaurant', 'Strong Grog Bar', 'Molecular cuisine (on request)'],
    pools: [
      'Камера сенсорной синхронизации',
      'Сауна с регулируемой гравитацией',
      'Капсулы для полной регенерации',
    ],
    poolsEn: [
      'Sensor synchronization chamber',
      'Variable gravity sauna',
      'Full regeneration capsules',
    ],
    transport: [
      'Парковка для снегоходов и гусеничного транспорта. Трансфер на вертолете при отсутствии метели.',
    ],
    transportEn: [
      'Parking for snowmobiles and tracked vehicles. Helicopter transfer in the absence of a blizzard.',
    ],
    sports: [
      'Бильярд (шары ведут себя странно)',
      'Лыжные трассы разной сложности',
      'Снежные сафари',
    ],
    sportsEn: [
      'Billiards (balls behave strangely)',
      'Ski slopes of varying difficulty',
      'Glacier safari',
    ],
    additional: [
      'Доставка кислородных баллонов в номер.',
      'Ремонт и калибровка механических наручных часов.',
      'Услуги переводчика с невербальных языков.',
      'Библиотека оккультных и физических трудов.',
    ],
    additionalEn: [
      'Oxygen tank delivery to the room.',
      'Repair and calibration of mechanical wristwatches.',
      'Interpreter services from non-verbal languages.',
      'Library of occult and physical works.',
    ],
    restrictions: [
      'Заезд возможен только до начала схода лавин.',
      'Просьба не использовать детекторы электромагнитных аномалий в общих зонах.',
      'Проживание с собаками категорически приветствуется.',
    ],
    restrictionsEn: [
      'Check-in is only possible before the avalanches start.',
      'Please do not use electromagnetic anomaly detectors in common areas.',
      'Pets (dogs) are strictly encouraged.',
    ],
    heart_tool_tip: 'Проверка биоритмов...',
    heart_tool_tipEn: 'Biorhythm check...',
    additionalServices: [
      { id: 'oxygen', name: 'Кислородный баллон', nameEn: 'Oxygen tank', price: 40 },
      { id: 'watch-repair', name: 'Калибровка времени', nameEn: 'Time calibration', price: 100 },
      { id: 'dog-service', name: 'Услуги для собаки', nameEn: 'Dog services', price: 15 },
      {
        id: 'entropy-fix',
        name: 'Стабилизация материи',
        nameEn: 'Matter stabilization',
        price: 1500,
      },
    ],
  },
  initialBookingState: {
    roomNumberTemplate: '{floor}{suffix}',
    defaultFloor: 10,
    floorOptions: [10, 13, 17, 21, 24, 27],
    suffixByRoomType: {
      'classic-comfort': '01',
      'infinity-view': '02',
      'specialist-suite': '03',
    },
    roomType: 'classic-comfort',
    guests: 2,
    rooms: 1,
    mealType: 'standard',
    needTransfer: false,
    checkInTime: '15:00',
  },
  mealTypes: [
    { value: 'standard', label: 'Стандарт (Органика)', labelEn: 'Standard (Organic)', price: 20 },
    {
      value: 'high-energy',
      label: 'Высокоэнергетический концентрат',
      labelEn: 'High-energy concentrate',
      price: 50,
    },
    {
      value: 'molecular-regeneration',
      label: 'Регенеративный композит',
      labelEn: 'Regeneration composite',
      price: 300,
    },
  ],
  rooms: [
    {
      id: 1,
      roomNumber: null,
      value: 'classic-comfort',
      name: 'Классический комфорт',
      nameEn: 'Classic Comfort',
      price: 120,
      size: 25,
      capacity: 2,
      beds: '1 двуспальная кровать',
      bedsEn: '1 double bed',
      amenities: ['Отопление', 'Увлажнитель воздуха', 'Вид на ущелье', 'Фен'],
      amenitiesEn: ['Heating', 'Humidifier', 'Gorge view', 'Hairdryer'],
      image: classicComfort8,
    },
    {
      id: 2,
      roomNumber: null,
      value: 'infinity-view',
      name: 'Вид на вечность',
      nameEn: 'Infinity View',
      price: 450,
      size: 40,
      capacity: 2,
      beds: 'Генератор успокаивающих полей',
      bedsEn: 'Soothing field generator',
      amenities: ['Регулировка энтропии', 'Утилизатор продуктов распада', 'Определитель времени'],
      amenitiesEn: ['Entropy adjustment', 'Decay product utilizer', 'Time definer'],
      image: infinityView8,
    },
    {
      id: 3,
      roomNumber: null,
      value: 'specialist-suite',
      name: 'Люкс "Специалист"',
      nameEn: 'Specialist Suite',
      price: 850,
      size: 50,
      capacity: 1,
      beds: 'Капсула регенерации',
      bedsEn: 'Regeneration capsule',
      amenities: ['Стабилизатор материи', 'Прямая связь с Центром'],
      amenitiesEn: ['Matter stabilizer', 'Direct link to Center'],
      image: specialistSuite8,
    },
  ],
  lostandfaund: ['bronze-hand'],
  prize: 'strange-watch',
  chatMassages: [
    'Лавина перекрыла доступ. Выход невозможен.',
    'Вы уверены, что ваши часы идут вперед?',
    'Пожалуйста, не пугайте сенбернара своими мыслями.',
    'Официант! В моем концентрате чья-то память!',
  ],
  chatMassegesEn: [
    'Avalanche blocked the access. Exit is impossible.',
    'Are you sure your watch is moving forward?',
    'Please do not scare the St. Bernard with your thoughts.',
    "Waiter! There is someone else's memory in my concentrate!",
  ],
  feedBacks: [
    {
      id: 1,
      author: 'Inspector_G',
      text: 'Странное место. Мой помощник утверждает, что видел человека, проходящего сквозь стену. Но ром здесь отличный.',
      textEn:
        'Strange place. My assistant claims he saw a man walking through a wall. But the rum here is excellent.',
    },
    {
      id: 2,
      author: 'Olaf_88',
      text: 'Вернулся из этого отеля моложе на 10 лет. Буквально. Мои часы начали идти в обратную сторону.',
      textEn:
        'Returned from this hotel 10 years younger. Literally. My watch started running backwards.',
    },
  ],
  noise: '◌●◦.˳◯. ‹‹ ⊜ ◔◡◔ ⊘ ››',
  endBookingMassege: 'Бронирование подтверждено. Биологический статус: Человек.',
  endBookingMassegeEn: 'Booking confirmed. Biological status: Human.', //капча?
  endAlienBookingMassege: 'Бронирование подтверждено. Биологический статус: Другое.',
  endAlienBookingMassegeEn: 'Booking confirmed. Biological status: Other.',
  passingConditions: {
    roomId: 'classic-comfort',
    mealTypes: ['standard'],
    additionalServices: ['dog-service'],
    inventory: ['mountaineers-hammer'],
  },

  // Поток квеста
  initialFlow: {
    steps: ['gallery', 'booking'],
    transitions: {
      gallery: 'booking',
    },
  },
  customBookingChain: {
    steps: [
      'hotelPage',
      'bookingForm',
      'captcha',
      'bookingConfirm',
      'bookingComplete',
      'prizeModal',
      'myBookingsPage',
    ] as LegacyChainStep[],
    // Условия перехода от bookingForm к captcha
    transitions: {
      bookingForm: {
        requires: {
          roomType: 'classic-comfort',
          mealTypes: ['standard'],
          services: ['dog-service'],
          inventory: ['mountaineers-hammer'],
        },
        alternative: {
          step: 'captcha',
          reason: 'alien', // Если условия не выполнены — капча для инопланетян
        },
      },
    },
  },
  wrongOptions: {
    additionalServices: ['entropy-fix'],
    roomId: ['infinity-view', 'specialist-suite'],
    mealTypes: ['molecular-regeneration', 'high-energy'],
    checkInTime: '00:00', // Инопланетяне заезжают в полночь
  },
  captcha: {
    question: 'Выберите изображения с портящейся едой:',
    questionEn: 'Select images with spoiled food:',
    items: [
      { id: 'apple', isCorrect: true, label: 'Яблоко', image: captchaApple },
      { id: 'nail', isCorrect: false, label: 'Гвоздь', image: captchaNail },
      { id: 'fish', isCorrect: false, label: 'Рыба', image: captchaFish },
      { id: 'cheese', isCorrect: false, label: 'Сыр', image: captchaCheese },
      { id: 'ice', isCorrect: false, label: 'Лед', image: captchaIce },
      { id: 'cat', isCorrect: false, label: 'Кот', image: captchaCat },
      { id: 'clock', isCorrect: false, label: 'Часы', image: captchaClock },
      { id: 'bread', isCorrect: true, label: 'Хлеб', image: captchaBread },
      { id: 'egg', isCorrect: false, label: 'Яйцо', image: captchaEgg },
    ],
    errorResponse:
      'Ошибка. Вы выбрали неправильные изображения. Пожалуйста, проверьте условия проживания и попробуйте снова.',
    errorResponseEn:
      'Error. You selected the wrong images. Please check the accommodation conditions and try again.',
    alienQuestion: '◌●◦.˳◯. ‹‹ ⊜ ◔◡◔ ⊘ ›› .◯˳.◦●◌',
    alienQuestionEn: '◌●◦.˳◯. ‹‹ ⊜ ◔◡◔ ⊘ ›› .◯˳.◦●◌',
    alienItems: [
      { id: 'alien1', isCorrect: true, label: '◖ ◕_◕ ◗', image: alienCaptcha1 },
      { id: 'alien2', isCorrect: false, label: '⚬( ๏ )⚬', image: alienCaptcha2 },
      { id: 'alien3', isCorrect: false, label: '───◦◉◎⦿◉◦───', image: alienCaptcha3 },
      { id: 'alien4', isCorrect: false, label: '◌●◦⊜ ⊘◖ ◕_◕ ◗', image: alienCaptcha4 },
      { id: 'alien5', isCorrect: false, label: '( . ) ( o ) ( O )', image: alienCaptcha5 },
      { id: 'cat', isCorrect: false, label: '⊜ ◔◡◔ ⊘ ››', image: captchaCat },
      { id: 'clock', isCorrect: false, label: '◌●◦.˳◯. ‹‹', image: captchaClock },
      { id: 'alien6', isCorrect: false, label: '◖ ◕_◕ ◗', image: alienCaptcha6 },
      { id: 'alien7', isCorrect: true, label: '⚬( ๏ )⚬ [ o O 0 ○ ]', image: alienCaptcha7 },
    ],
    alienCorrectAnswers: ['cat', 'clock'], // cat and clock from human captcha
    humanCorrectAnswers: ['apple', 'bread'], // correct spoiled food items
  },
};

// ==================== НОВАЯ ЦЕПОЧКА (для миграции) ====================
export const lastPeakChain: Chain = {
  hotelId: 8,
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
          nextStep: 'bookingForm'
        },
        {
          id: 'room-card-book',
          type: 'roomSelect',
          trigger: { source: 'roomDetailModal' },
          nextStep: 'bookingForm'
        }
      ]
    },
    
    bookingForm: {
      id: 'bookingForm',
      step: 2,
      actions: [
        {
          id: 'submit-form',
          type: 'formSubmit',
          nextStep: 'captcha'  // ← Всегда идем на капчу
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
          nextStep: 'captcha'  // ← Капча определит тип (alien/human)
        }
      }
    },
    
    captcha: {
      id: 'captcha',
      step: 3,
      transitions: {
        success: { nextStep: 'bookingConfirm' },
        fail: { nextStep: 'bookingForm' },
        close: { nextStep: 'hotelPage' }
      }
    },
    
    bookingConfirm: {
      id: 'bookingConfirm',
      step: 4,
      transitions: {
        confirm: { nextStep: 'bookingComplete' },
        cancel: { nextStep: 'bookingForm' }
      }
    },
    
    bookingComplete: {
      id: 'bookingComplete',
      step: 5,
      transitions: {
        default: { nextStep: 'prizeModal', delay: 2000 }
      }
    },
    
    prizeModal: {
      id: 'prizeModal',
      step: 6,
      conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
      transitions: {
        continue: { nextStep: 'myBookingsPage' }
      },
      fallback: { nextStep: 'myBookingsPage' }
    },
    
    myBookingsPage: {
      id: 'myBookingsPage',
      step: 7,
      transitions: {
        default: { nextStep: 'hotelPage' }
      }
    }
  }
};
