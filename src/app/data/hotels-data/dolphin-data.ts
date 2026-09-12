/* eslint-disable prettier/prettier */
import type { Chain, Hotel } from './hotelTypes';
// Изображения (заглушки — заменятся на реальные)
import headImage from '../images/Dolphin/head-image.png';
import galleryConcierge from '../images/Dolphin/gallery1.png';
import galleryRadio from '../images/Dolphin/room2.jpg';
import gallery2 from '../images/Dolphin/gallery2.png';
import headImage1 from '../images/Dolphin/head-image1.jpg';
// import galleryWindow from '../images/Dolphin/gallery-window.jpg';
import roomStandardImg from '../images/Dolphin/room1.jpg';
import roomSuperiorImg from '../images/Dolphin/room3.png';
import room1408Img from '../images/Dolphin/room4.png';
// Изображения для капчи (9 ключей)
import key1408 from '../images/Dolphin/1408.png';
import key1401 from '../images/Dolphin/1.jpg';
import key1402 from '../images/Dolphin/5.png';
import key1403 from '../images/Dolphin/13.png';
import key1404 from '../images/Dolphin/237.png';
import key1405 from '../images/Dolphin/back-door.png';
import key1406 from '../images/Dolphin/hell-key.jpg';
import key1407 from '../images/Dolphin/paradis-key.jpg';
import key1409 from '../images/Dolphin/tempus-fugit.jpg';

export const dolphinData: Hotel = {
  id: 5,
  name: 'Dolphin King Hotel',
  nameEn: 'Dolphin King Hotel',
  stars: 5,
  rating: 4.8,
  price: 140.8,
  slogan: 'Наш отель будет рад стать для вас домом',
  sloganEn: 'Our hotel will be happy to become your home.',
  description:
    'Отель «Дельфин» — это классика нью-йоркского гостеприимства. Мы гордимся тем, что предлагаем нашим гостям абсолютное спокойствие в самом центре шумного мегаполиса. Наши стены хранят тишину, а сервис предугадывает ваши желания еще до того, как вы о них подумаете. У нас всегда найдется место для особенного гостя.',
  descriptionEn:
    'The Dolphin is the classic of New York hospitality. We pride ourselves on offering our guests absolute tranquility in the heart of the bustling metropolis. Our walls keep the silence, and our service anticipates your wishes before you even think of them. We always have room for a special guest.',
  location: 'Нью-Йорк, Лексингтон-авеню, 1408',
  locationEn: 'New York, Lexington Avenue, 1408',
  commonFeedback: '(Отличный сервис, роскошные номера. У дельфина есть своя волна.)',
  commonFeedbackEn: '(Excellent service, luxurious rooms. The dolphin has its own wave.)',
  image: headImage1,
  images: [
    headImage,
    galleryConcierge,
    galleryRadio,
    gallery2,
    // galleryNightstand,
    // galleryWindow,
  ],

  amenities: {
    dining: [
      'Ресторан "Морской лещ"',
      'Круглосуточная доставка еды и напитков',
      'Мини-бар с комплиментарным выдержанным виски',
    ],
    diningEn: [
      'Sea Bass Restaurant',
      '24/7 food and drink delivery',
      'Minibar with complimentary aged whiskey',
    ],
    pools: ['SPA','Массаж','Индивидуальные термальные процедуры прямо в вашем номере по запросу',],
    poolsEn: ['SPA','Massage', 'Individual thermal treatments directly in your room upon request',],
    transport: ['Парковка не предусмотрена.'],
    transportEn: ['No parking.'],
    sports: ['Пробежки по карнизам', 'Ползанье по вентиляционным шахтам', 'Серфинг'],
    sportsEn: ['Hotel library. Reading - a charge for the mind.', 'Chess board - upon request.', 'Surfing'],
    additional: [
      '*Радиоточка*',
      'Дом кирпичный',
      'Пол - белый мрамор',
      'Много подсобных помещений',
      'Санузел раздельный',
      'Рядом с метро. Центр.',
    ],
    additionalEn: [
      '*Radio* outlet',
      'Brick house',
      'White marble floor',
      'Many utility rooms',
      'Separate bathroom',
      'Near the metro. Central',
    ],
    additionalServices: [
      {
        id: 'thermal-treatment',
        name: 'Индивидуальные термальные процедуры',
        nameEn: 'Individual thermal treatment',
        price: 50,
      },
      {
        id: 'library-access',
        name: 'Доступ к библиотеке отеля',
        nameEn: 'Hotel library access',
        price: 0,
      },
    ],
    restrictions: [
      'Возможность предоставления определенного номера определяется администрацией',
      'За психическое состояние клиентов отель ответственности не несет',
      'В обслуживании в номере может быть отказано без объяснения причин',
    
    ],
    restrictionsEn: [
      'The possibility of providing a specific number is determined by the administration',
      'The hotel is not responsible for the mental state of its clients.',
      'Room service may be refused without explanation.',
    ],
    heart_tool_tip: 'Вы полюбите свой номер до смерти.',
    heart_tool_tipEn: 'You will love your room to death.',
  },

  mealTypes: [
    {
      value: 'continental-breakfast',
      label: 'Континентальный завтрак',
      labelEn: 'Continental breakfast',
      price: 25,
    },
    {
      value: 'room-service',
      label: 'Круглосуточная доставка еды и напитков',
      labelEn: '24/7 food and drink delivery',
      price: 40,
    },
    {
      value: 'mini-bar-whiskey',
      label: 'Мини-бар с комплиментарным виски',
      labelEn: 'Minibar with complimentary whiskey',
      price: 0,
    },
    {
      value: 'room-only',
      label: 'Без питания',
      labelEn: 'Room only',
      price: 0,
    },
  ],

  rooms: [
    {
      id: 1,
      roomNumber: null,
      name: 'Standard «Манхэттен»',
      nameEn: 'Standard «Manhattan»',
      value: 'standard',
      price: 140.7,
      size: 22,
      capacity: 2,
      beds: '1 двуспальная кровать',
      bedsEn: '1 double bed',
      amenities: ['Балкон', 'Wi-fi', 'Кондиционер', 'Сауна', 'Дополнительная шумоизоляция', 'Письменный стол', 'Письменные принадлежности', 'Джакузи', 'Кофемашина',  ],
      amenitiesEn: ['Balcony', 'Wi-fi', 'Air conditioning', 'Sauna', 'Additional sound insulation', 'Writing desk', 'Writing supplies', 'Jacuzzi', 'Coffee machine',],
      image: room1408Img,
    },
    {
      id: 2,
      roomNumber: null,
      name: 'Superior «Лексингтон»',
      nameEn: 'Superior «Lexington»',
      value: 'superior',
      price: 140.6,
      size: 28,
      capacity: 2,
      beds: '1 King Size',
      bedsEn: '1 King Size',
      amenities: ['Эркер', 'Письменный стол', 'Письменные принадлежности', 'Джакузи', 'Кофемашина', 'Wi-fi', 'Кондиционер', 'Сауна', 'Дополнительная шумоизоляция', ],
      amenitiesEn: ['Bay window', 'Writing desk', 'Writing supplies',  'Jacuzzi', 'Coffee machine', 'Wi-fi', 'Air conditioning', 'Sauna', 'Additional sound insulation',],
      image: roomSuperiorImg,
    },
    {
      id: 3,
      roomNumber: 1408,
      name: "The Writer's Suite",
      nameEn: "The Writer's Suite",
      value: 'room-1408',
      price: 140.8,
      size: 32,
      capacity: 2,
      beds: '1 King Size',
      bedsEn: '1 King Size',
      amenities: [
        'Телевизор',
        '*Радио*',
        'Факс',
        'Холодильник',
        'Терморегуляция',
        'Система умного дома',
        'Система пожаротушения',
        'Авторские картины',
        'Обслуживание в номере',
        'Система экспресс-выселения',
        'Вид на Лексингтон-авеню',
        'Мини-бар',
      ],
      amenitiesEn: [
        'TV',
        '*Radio*',
        'Fax',
        'Thermoregulation',
        'Refrigerator',
        'Smart home system',
        'Fire extinguishing system',
        'Author`s paintings',
        'Room service',
        'Express check-out system',
        'Lexington Avenue view',
        'Minibar',
      ],
      image: roomStandardImg,
    },
  ],

  lostandfaund: ['radio'],

  prize: '',

  chatMassages: [
    'Добрый день. Могу ли я предложить вам другой номер? 1408... не самый тихий.',
    'За 95 лет в этом номере случилось 56 смертей. Вас это не смущает?',
    '*Радио* в номере 1408 — антиквариат. Некоторые гости... оставляли его в потеряшках. Оно всегда возвращается.',
    'Вы уверены, что хотите именно этот ключ? У нас есть другие. Прекрасные номера. Без истории.',
  ],
  chatMassegesEn: [
    'Good afternoon. May I offer you another room? 1408... is not the quietest.',
    'There have been 56 deaths in this room over 95 years. Does that bother you?',
    'The *radio* in room 1408 is an antique. Some guests... left it in lost & found. It always comes back.',
    'Are you sure you want this key? We have others. Lovely rooms. Without history.',
  ],

  feedBacks: [
    {
      id: 1,
      author: 'Mike_E',
      text: 'Провёл час — он показался вечностью. *Часы* шли назад. Хорошо, что у меня были с собой *часы* альпиниста — они хотя бы тикали в правильную сторону.',
      textEn:
        'Spent an hour — it felt like eternity. The *clock* ran backwards. It`s a good thing I had my mountaineer`s watch with me—at least it was ticking in the right direction.',
    },
    {
      id: 2,
      author: 'Mr. Enslin:',
      text: 'Зашел в 22:00. В 22:10 я понял, что всё, что я писал раньше — ложь. Код подтверждения события: 69, 32, 57. Надеюсь, вы успеете. Кто-то со мной говорил через *радио*, наверное его оставил прежний жилец. Отдал *радио* консьержу, за ним могут вернуться.',
      textEn:
        'I checked in at 10:00 PM. At 10:10 PM, I realized everything I`d written before was a lie. Event confirmation code: 69, 32, 57. I hope you`ll make it in time. Someone spoke to me through the *radio*; the previous tenant must have left it behind. I gave the *radio* to the concierge; they might come back for it.',
    },
    {
      id: 3,
      author: 'Clockmaker_77',
      text: 'Сначала сьехала каритина, потом поехала крыша. Попросил консьержа поменять номер, взял ключ и очнулся в другом месте.',
      textEn:
        'First the picture went wrong, then the roof went off. I asked the concierge to change my room, took the key, and woke up in a different place.',
    },
    {
      id: 4,
      author: 'Anonymous',
      text: 'Спички в номере всегда зажжены. Кто-то ждёт.',
      textEn: 'The matches in the room are always lit. Someone is waiting.',
    },
  ],

  noise: 'Тиканье часов, которое постепенно ускоряется. Треск радиопомех. Далёкий шум Манхэттена.',

  endBookingMassege: 'Спичка погасла. Тишина. Вы свободны.',
  endBookingMassegeEn: 'The match went out. Silence. You are free.',

  endWrongBookingMassege: '*Радио* включается. «У вас есть 60 минут». Добро пожаловать домой.',
  endWrongBookingMassegeEn: 'The *radio* turns on. "You have 60 minutes." Welcome home.',

  bookingStates: {
    default: {
      roomNumber: '1408',
      roomType: 'superior',
      mealType: 'room-service',
      //   additionalServices: ['thermal-treatment'],
      guests: 1,
      rooms: 1,
      checkInTime: '15:00',
      lockedFields: [],
    },
  },

  captcha: {
    question: 'Возьмите ключ от вашего номера:',
    questionEn: 'Take the key to your room:',
    items: [
      { id: '01', isCorrect: false, label: '', image: key1401 },
      { id: '05', isCorrect: false, label: '', image: key1402 },
      { id: '13', isCorrect: false, label: '', image: key1403 },
      { id: '237', isCorrect: false, label: '', image: key1404 },
      { id: 'ESC', isCorrect: false, label: '', image: key1405 },
      { id: '666', isCorrect: false, label: '', image: key1406 },
      { id: '23', isCorrect: false, label: '', image: key1407 },
      { id: '1408', isCorrect: true, label: '', image: key1408 },
      { id: '404', isCorrect: false, label: '', image: key1409 },
    ],
    errorResponse: '"Это ключ от другой истории. Попробуйте ещё раз."',
    errorResponseEn: '"This key is from another history. Try again."',
    successResponse: 'Добро пожаловать.',
    successResponseEn: 'Welcome.',
    correctSequence: [1408],
  },
};

// ==================== ЦЕПОЧКА КВЕСТА ====================
export const dolphinChain: Chain = {
  hotelId: 5,
  type: 'custom',
  steps: {
    hotelPage: {
      id: 'hotelPage',
      step: 1,
      actions: [
        // Клик по консьержу → капча с ключами
        {
          id: 'concierge-click',
          type: 'galleryClick',
          trigger: { imageIndex: 1, coords: { x1: 11, y1: 45, x2: 26, y2: 65 } },
          nextStep: 'captcha',
          galleryData: {
            type: 'capcha-get',
            // message: 'Консьерж протягивает связку ключей. «Выберите один. Только осторожно — некоторые двери не открываются обратно.»',
            // messageEn: 'The concierge holds out a bunch of keys. «Choose one. Just be careful — some doors don\'t open back.»',
            resetOnReentry: true,
          },
        },
        // Клик по радио → артефакт
        {
          id: 'artifact-radio',
          type: 'galleryClick',
          trigger: { imageIndex: 2, coords: { x1: 13, y1: 57, x2: 28, y2: 68 } },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'artifact-find',
            artefact: 'radio',
            // message: 'Радио шипит. Оно хочет, чтобы вы его оставили.',
            // messageEn: 'The radio crackles. It wants you to leave it behind.',
            resetOnReentry: false,
          },
        },
        {
          id: 'book-now-btn',
          type: 'buttonClick',
          trigger: { elementId: 'book-now-button' },
          nextStep: 'bookingForm',
          transitions: {
            success: {
              conditions: [{ field: 'inventory', operator: 'contains', value: 'room-key' }],
              nextStep: 'bookingForm',
            },
            fail: {
              nextStep: 'conciergeRequired',
            },
          },
        },
        {
          id: 'room-card-open',
          type: 'roomOpen',
          trigger: { source: 'roomCard' },
          nextStep: 'roomCard',
        },
      ],
    },

    conciergeRequired: {
      id: 'conciergeRequired',
      step: 2,
      modal: {
        id: 'concierge-required',
        message: 'У вас нет ключа от номера. Поговорите с консьержем.',
        messageEn: "You don't have the room key. Talk to the concierge.",
      },
    },

    roomCard: {
      id: 'roomCard',
      step: 3,
      actions: [
        {
          id: 'room-card-book',
          type: 'roomSelect',
          trigger: { source: 'roomDetailModal' },
          nextStep: 'conciergeRequired',
          blocked: {
            conditions: [{ field: 'inventory', operator: 'not-contains', value: 'room-key' }],
            message: 'У вас нет ключа от номера. Поговорите с консьержем.',
            messageEn: "You don't have the room key. Talk to the concierge.",
          },
        },
        {
          id: 'room-card-close',
          type: 'buttonClick',
          trigger: { elementId: 'room-modal-close' },
          nextStep: 'hotelPage',
        },
      ],
    },

    captcha: {
      id: 'captcha',
      step: 4,
      transitions: {
        success: { nextStep: 'hotelPage', params: { addToInventory: 'room-key' } },
        fail: { nextStep: 'captchaFail' },
        close: { nextStep: 'hotelPage' },
      },
    },

    captchaFail: {
      id: 'captchaFail',
      step: 10,
      modal: {
        id: 'captcha-fail',
        title: 'Выход',
        titleEn: 'Exit',
        message: '"Это ключ от другой истории. Попробуйте ещё раз."',
        messageEn: '"This key is from another history. Try again."',
      },
      nextStep: 'homePage',
    },

    bookingForm: {
      id: 'bookingForm',
      step: 5,
      formConfig: {
        initialStateId: 'default',
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
        // Безопасный путь: правильный ключ, часы из Last Peak, радио в потеряшках, виски, нет термальных процедур
        submitSafe: {
          conditions: [
            { field: 'inventory', operator: 'contains', value: 'strange-watch' },
            // { field: 'inventory', operator: 'contains', value: 'room-key-1408' },
            { field: 'lostAndFound', operator: 'contains', value: 'radio' },
            { field: 'roomType', operator: 'eq', value: 'room-1408' },
            { field: 'mealType', operator: 'eq', value: 'mini-bar-whiskey' },
            { field: 'additionalServices', operator: 'not-contains', value: 'thermal-treatment' },
          ],
          nextStep: 'bookingConfirm',
          params: { bookingResult: 'safe' },
        },
        // Всё остальное — провал
        submitUnsafe: {
          nextStep: 'bookingConfirm',
          params: { bookingResult: 'unsafe' },
        },
      },
    },

    bookingConfirm: {
      id: 'bookingConfirm',
      step: 6,
      transitions: {
        confirm: {
          nextStep: 'bookingComplete',
          effects: [{ type: 'consumeInventory', item: 'room-key' }],
        },
        cancel: { nextStep: 'bookingForm' },
      },
    },

    bookingComplete: {
      id: 'bookingComplete',
      step: 7,
      transitions: {
        default: { nextStep: 'prizeModal', delay: 3000 },
      },
    },

    prizeModal: {
      id: 'prizeModal',
      step: 8,
      conditions: [{ field: 'isSafeToBook', operator: 'eq', value: true }],
      transitions: {
        continue: { nextStep: 'myBookingsPage' },
      },
      fallback: { nextStep: 'myBookingsPage' },
    },

    myBookingsPage: {
      id: 'myBookingsPage',
      step: 9,
      transitions: {
        default: { nextStep: 'hotelPage' },
      },
    },
  },
};
