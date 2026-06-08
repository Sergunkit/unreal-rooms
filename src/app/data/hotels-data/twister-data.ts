/* eslint-disable prettier/prettier */
import type { Chain } from './hotelTypes';
// Изображения
import headImage from '../images/twister/head-image.jpg';
import room1 from '../images/twister/room1.jpg';
import room2 from '../images/twister/room2.jpg';
import room3 from '../images/twister/room3.jpg';
import tequila_table from '../images/twister/tequila-table.jpg';
import gellery_twister1 from '../images/twister/gellery-twister1.jpg';
import gallery_twister2 from '../images/twister/gallery-twister2.jpg';
import gallery_twister3 from '../images/twister/gallery-twister3.jpg';
// import  golden_snake from './artefacts.ts'


export const twisterData = {
  id: 4,
  name: 'TWISTER BAR and BED',
  nameEn: 'TWISTER BAR and BED',
  stars: 2,
  rating: 4.2,
  price: 13,
  slogan:
    'Мы открыты от заката до рассвета. Байкерам и водителям грузовиков вход... приветствуется.',
  sloganEn:
    'We`re open from dusk until dawn. Bikers and truck drivers are welcome.',
  description:
    'Забудьте о правилах. Самое жаркое место на трассе 404. Текила, живая музыка, легкие знакомства и атмосфера, от которой закипает кровь. Отель предлагает не самый большой ассортимент услуг, но есть все для отрыва и последующего восстановления. Идеальная остановка для тех, кому нечего терять.',
  descriptionEn:
    'Forget the rules. The hottest spot on Route 404. Tequila, live music, easy company and an atmosphere that makes your blood boil. The hotel offers a limited range of services, but everything you need to party hard and recover. The perfect stop for those with nothing to lose.',
  location:
    'Трасса 404, посреди пустыни. Рядом — древние ацтекские храмы и заброшенные раскопки.',
  locationEn:
    'Route 404, in the middle of the desert. Nearby are ancient Aztec temples and abandoned excavations.',
  commonFeedback: 'Здесь каждый найдёт, что искал. Или кого.',
  commonFeedbackEn: 'Everyone finds what they are looking for here. Or who.',
  image: headImage,
  images: [headImage, tequila_table, gellery_twister1, gallery_twister2, gallery_twister3],
  amenities: {
    dining: [
      'Самая вкусная еда в Мексике',
      'Эксклюзивные блюда по местным старинным рецептам',
      'Cerveza & Tequila',
      'Blood Mary (Real Mix) — строго для «постоянных» гостей',
      // 'Без питания (если вы сами — питание)',
    ],
    diningEn: [
      'The most delicious food in Mexico',
      'Exclusive dishes based on local ancient recipes',
      'Cerveza & Tequila (main menu)',
      'Bloody Mary (Real Mix) — strictly for «regular» guests',
      // 'No meal (if you are the meal)',
    ],
    pools: [
      // 'Грязевые ванны в ацтекских руинах',
      // 'SPA «Яд и лед» (мексиканская народная медицина)',
    ],
    poolsEn: [
      // 'Mud baths in Aztec ruins',
      // 'SPA «Venom & Ice» (Mexican folk medicine)',
    ],
    transport: [
      // 'Трансфер осуществляется только до отеля',
      'Регулярно очищаемая парковка перед отелем',
    ],
    transportEn: [
      // 'Transfer to the hotel only',
      'Regularly cleaned parking in front of the hotel',
    ],
    sports: [
      'Бильярд',
      'Стрельба из арбалета',
      'Турниры по стрельбе из водяных пистолетов',
      // 'Тир с очень детализированными мишенями',
      // 'Такой кардиотренировки как на нашем танцполе вы не получите ни в одном спортзале',
    ],
    sportsEn: [
      'Billiards',
      'Crossbow Shooting',
      'Water Pistol Shooting Tournaments'
      // 'Shooting range with highly detailed targets',
      // 'You won`t get the same cardio workout as on our dance floor in any gym.',
    ],
    additional: [
      'Стриптиз',
      '"Живая" музыка',
      'Пиротехнические шоу',
      'Контактный зоопарк',
      // 'Легендарный текиловый стол',
    ],
    additionalEn: [
      'Striptease',
      '"Live" Music',
      'Pyrotechnic Shows',
      'Petting Zoo',
      // 'The legendary tequila table',
    ],
    additionalServices: [
      {
        id: 'privat-dance',
        name: 'Приватный танец с жрицей «Santanico’s Kiss»',
        nameEn: 'Private dance with the priestess «Santanico’s Kiss»',
        price: 200,
      },
      // {
      //   id: 'pyro-show',
      //   name: 'Пиротехническое шоу «Отрыв башки»',
      //   nameEn: 'Pyrotechnic show «Mind Blow»',
      //   price: 150, Такой кардиотренировки как на нашем танцполе вы не получите ни в одном спортзале
      // },
      // Киски / ответит 44 / серебряный крест / колья-кии / арбалет / сятая вода / отбойный молоток / зажигалки / священик 
      // бутылка виски и пять стаканов / еда разогретая в микроволновке / Сантанико Пандемониум (Santanico Pandemonium) / Джейкоб Фуллер (Jacob Fuller) / Sex Machine, Razor Charlie, Richie Gekk, Sed, Scotie, Keite
      //  змеи / летучие мыши / кровь - дыра в ладони / номер в поземелье snake - нет с выходом наружу нет he "Gimp\'s Hideout - нет
      // Кактусы / капча байкер - водитель трэка: Подтверди что ты байкер или водитель грузовика. Выбери все средства пассивной (активной) безопасности: Церковная свеча 
      // Иконка Святая вода Крест (из ружья и биты) Водяной пистолет Хлыст Пистолет Зажигалка Кий Домино Презервативы Подушка (ремень) безопасности/
      // Шлем Бита Осиновый кол Аптечка (средство для остановки крови) Криминал ()
      
      {
        id: 'tequila-table',
        name: 'Текиловый стол «Tequila Sunrise for the Whole Tribe»',
        nameEn: 'Tequila table «Tequila Sunrise for the Whole Tribe»',
        price: 150,
      },
    ],
    restrictions: [
      'Только для байкеров и водителей грузовиков',
      'Фэйс-контроль на входе',
      'Заселение только после заката',
      'Можно даже с крупными теплокровными животными',
      'Курение разрешено везде',
    ],
    restrictionsEn: [
      'Bikers and truck drivers are welcome',
      'Face control at the entrance',
      'Check-in only after sunset',
      'Even with large warm-blooded animals it is possible',
      'Smoking allowed everywhere',
    ],
    heart_tool_tip: 'Мы похитим Ваше сердце',
    heart_tool_tipEn: 'We will steal your heart',
  },

  mealTypes: [
    {
      value: 'cerveza-tequila',
      label: 'Cerveza & Tequila (основное меню)',
      labelEn: 'Cerveza & Tequila (main menu)',
      price: 15,
    },
    {
      value: 'tasty-taco',
      label: 'Мясной безлимит (самое вкусное тако)',
      labelEn: 'Meat all you can eat (the tastiest tacos)',
      price: 20,
    },
    {
      value: 'whiskey-glasses',
      label: 'Бутылка виски и пять стаканов',
      labelEn: 'Whiskey bottle and five glasses',
      price: 25,
    },
    {
      value: 'blood-mary',
      label: 'Blood Mary (Real Mix) — для «постоянных» гостей',
      labelEn: 'Bloody Mary (Real Mix) — for «regular» guests',
      price: 50,
    },
    {
      value: 'no-meal/Room-only',
      label: 'Без питания (для тех, кто пришел на ужин)',
      labelEn: 'No meal (for those who came to dinner)',
      price: 0,
    },
  ],

  rooms: [
    {
      id: 2,
      roomNumber: null,
      name: 'The "Gimp\'s Hideout"',
      nameEn: 'The "Royal Snake" Room',
      value: 'royal-snake',
      price: 13,
      size: 18,
      capacity: 1,
      beds: '1 Кровать',
      bedsEn: '1 Single bed',
      amenities: ['Древнеацтекский шик', 'Мексиканские арнаменты на стенах', 'Подвальное помещение'],
      amenitiesEn: ['Ancient Aztec Chic', 'Mexican Wall Art', 'Basement room'],
      image: room1,
    },
    {
      id: 3,
      roomNumber: null,
      name: 'The "Tarantula Lounge"',
      nameEn: 'The "Tarantula Lounge"',
      value: 'tarantula-lounge',
      price: 80,
      size: 20,
      capacity: 2,
      beds: '1 King size',
      bedsEn: '1 King size',
      amenities: ['Четыре стены', 'Потолок', 'Кровать'],
      amenitiesEn: ['Four walls', 'Ceiling', 'Bed'],
      image: room2,
    },
    {
      id: 4,
      roomNumber: null,
      name: 'The "Royal Snake" Room',
      nameEn: 'The "Gimp\'s Hideout"',
      value: 'gimps-hideout',
      price: 66,
      size: 25,
      capacity: 2,
      beds: '1 King size',
      bedsEn: '1 King size',
      amenities: ['Каменное ложе', 'Постельное белье из змеиной кожи', 'Отдельный вход с собственной террасы'],
      amenitiesEn: ['Stone bed', 'Snakeskin bed linen', 'Separate Entrance from a Private Terrace'],
      image: room3,
    },
    // {
    //   id: 1,
    //   roomNumber: null,
    //   name: 'The "Pussy Wagon" Suite',
    //   nameEn: 'The "Pussy Wagon" Suite',
    //   value: 'pussy-wagon',
    //   price: 99,
    //   size: 15,
    //   capacity: 2,
    //   beds: '1 Truck-bed',
    //   bedsEn: '1 Truck-bed',
    //   amenities: ['Пещерный антураж', 'Кровать в форме кузова Chevrolet Silverado', 'Номер для атмосферного экстаза'],
    //   amenitiesEn: ['Cave entourage', 'Chevrolet Silverado bed', 'A room for atmospheric ecstasy'],
    //   image: room_pussy_wagon,
    // },
  ],

  lostandfaund: [],

  chatMassages: [
    'Эй, амиго, заходи. У нас тут жарко, как в аду, и весело, как на похоронах.',
    'В Twister тебе рады все, не важно, во что ты веришь и какая у тебя группа крови.',
    'Жрицы этого храма не оставят равнодушным никого.',
    'Уицилопочтли',
  ],
  chatMassegesEn: [
    'Hey, amigo, come on in. It\'s hot as hell and fun as a funeral here.',
    'In Twister you are always welcome! No matter what you believe in or what your blood type is.',
    'The priestesses of this temple will not leave anyone indifferent.',
    'Уицилопочтли',
  ],

  prize: 'golden-snake',

  promoCodes: [],

  feedBacks: [
    {
      id: 1,
      author: 'Richie_G',
      text: 'Хотел тут провести одну ночь, но после знакомства с хозяйкой и её фирменной текилой остался навсегда. Не пожалел ни секунды.',
      textEn: 'I wanted to spend one night here, but after getting to know the hostess and her signature tequila, I stayed forever. I haven\'t regretted it for a second.',
    },
    {
      id: 2,
      author: 'Frost',
      text: 'Тут настолько гостепреимная атмосфера, что уже на первом же ужине ты чувствуешь себя частью дружного коллектива этого заведения.',
      textEn: "The atmosphere here is so hospitable that at the very first dinner you feel like part of the friendly team of this establishment.",
    },
  ],

  noise: 'Гитарный рифф Tito & Tarantula, звук взрывов, крики.',

  endBookingMassege: 'Добро пожаловать в ад! Самое жаркое место на трассе 404.',
  endBookingMassegeEn: 'Welcome to hell! The hottest spot on Route 404.',

  endWrongBookingMassege: 'Ужин подан.',
  endWrongBookingMassegeEn: 'Dinner is served.',


  bookingStates: {
    default: {
      roomType: 'gimps-hideout',
      mealType: 'blood-mary',
      additionalServices: [],
      guests: 1,
      rooms: 1,
      checkInTime: '22:00',
      lockedFields: [],
    },
  },
};

// ==================== ЦЕПОЧКА КВЕСТА ====================
export const twisterChain: Chain = {
  hotelId: 4,
  type: 'custom',
  steps: {
    hotelPage: {
      id: 'hotelPage',
      step: 1,
      actions: [
        {
          id: 'hint-dancer',
          type: 'galleryClick',
          trigger: { imageIndex: 1, coords: { x1: 45, y1: 20, x2: 53, y2: 40 } },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'hint',
            message: 'Возьми пистолет, но помни, что он может дать осечку. Тебе нужен кол из осины.',
            messageEn: 'Take the gun, but remember it might jam. You need an aspen stake.',
          },
        },
        {
          id: 'artifact-gun',
          type: 'galleryClick',
          trigger: { imageIndex: 1, coords: { x1: 20, y1: 60, x2: 70, y2: 80 } },
          nextStep: 'hotelPage',
          galleryData: {
            type: 'artifact-find',
            artefact: 'gun',
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
        submitSafe: {
      conditions: [
        { field: 'inventory', operator: 'contains', value: 'wooden-stake' },
        { field: 'roomType', operator: 'eq', value: 'tarantula-lounge' },
        { field: 'mealType', operator: 'eq', value: 'whiskey-glasses' },
        { field: 'needTransfer', operator: 'eq', value: false },
        { field: 'additionalServices', operator: 'not-contains', value: 'privat-dance' },
        { field: 'additionalServices', operator: 'not-contains', value: 'tequila-table' },
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
      step: 4,
      transitions: {
        confirm: { 
          nextStep: 'bookingComplete',
          effects: [
            { type: 'consumeInventory', item: 'wooden-stake' }
          ]
        },
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
