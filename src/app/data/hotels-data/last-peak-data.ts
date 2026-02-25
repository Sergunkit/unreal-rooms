/* eslint-disable prettier/prettier */
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

import bronzeHand8 from '../images/artefacts/Bronze-Hand.jpg';
import strangeWatch8 from '../images/artefacts/Strange-Watch.jpg';
import mountaineers_hammer8 from '../images/artefacts/Mountaineers-Hammer.jpg';

export const lastPeakData = {
    id: 8,
    name: 'The Last Peak Lodge',
    nameEn: 'The Last Peak Lodge',
    stars: 4,
    rating: 8.7,
    price: 120,
    slogan: 'Там, где горы касаются неба, а время замирает в лавине, найдите свой покой над бездной',
    sloganEn: 'Where mountains touch the sky and time freezes in an avalanche find your peace above the abyss',
    description:
      'Уединенный горный отель в заснеженном ущелье. Место для тех, кто ищет истинного одиночества и чистого горного воздуха. Здание с богатой историей, окутанное легендами о погибших героях и странных огнях в небе. Здесь каждый гость — загадка, а каждая лавина — повод остаться подольше. Пожалуйста, следите за своими часами.',
    descriptionEn:
      'A secluded mountain lodge in a snowy gorge. A place for those seeking true solitude and fresh mountain air. A building with a rich history, shrouded in legends of fallen heroes and strange lights in the sky. Here, every guest is a mystery, and every avalanche is a reason to stay longer. Please, keep an eye on your watch.',
    commonFeedback: '(Отзывы часто написаны на языках, не распознаваемых браузером)',
    commonFeedbackEn: '(Reviews are often written in languages not recognized by the browser)',
    location: 'Перевал Мертвого Альпиниста, Альпы',
    locationEn: 'Dead Mountaineer’s Pass, Alps',
    image: headImage8,
    images: [headImage8, galleryImage1_8, galleryImage2_8, galleryImage3_8, galleryImage5_8, galleryImage6_8 ],
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
        coords: { x1: 70, y1: 65, x2: 95, y2: 90 },
        message: 'Сенбернар Лель проявляет беспокойство. Он чувствует нечеловеческую активность.',
        messageEn: 'Lel the St. Bernard is anxious. He senses non-human activity.',
      },
      {
        imageIndex: 2,
        type: 'artifact-find' as const,
        alternateImage: galleryImageAlt2_8,
        coords: { x1: 40, y1: 20, x2: 55, y2: 45 },
        message: 'Вы всмотрелись в лицо Альпиниста. Теперь вы видите мир его глазами.',
        messageEn: 'You gazed into the face of the Mountaineer. Now you see the world through his eyes.',
        artefact: { id: 2, name: 'Молоток альпиниста', nameEn: 'Mountaineer\'s Hammer', image: mountaineers_hammer8 },
      },
    ],
    amenities: {
      dining: ['Ресторан "У камина"', 'Бар "Крепкий Грог"', 'Молекулярная кухня (по запросу)'],
      diningEn: ['Fireplace Restaurant', 'Strong Grog Bar', 'Molecular cuisine (on request)'],
      pools: ['Камера сенсорной синхронизации', 'Сауна с регулируемой гравитацией', 'Капсулы для полной регенерации'],
      poolsEn: ['Sensor synchronization chamber', 'Variable gravity sauna', 'Full regeneration capsules'],
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
        { id: 'entropy-fix', name: 'Стабилизация материи', nameEn: 'Matter stabilization', price: 1500 },
      ],
    },
    roomTypes: [
      {
        value: 'classic-comfort',
        label: 'Классический комфорт',
        labelEn: 'Classic Comfort',
        basePrice: 120,
      },
      {
        value: 'infinity-view',
        label: 'Вид на вечность',
        labelEn: 'Infinity View',
        basePrice: 450,
      },
      {
        value: 'specialist-suite',
        label: 'Люкс "Специалист"',
        labelEn: 'Specialist Suite',
        basePrice: 850,
      },
    ],
    mealTypes: [
      { value: 'standard', label: 'Стандарт (Органика)', labelEn: 'Standard (Organic)', price: 20 },
      { value: 'high-energy', label: 'Высокоэнергетический концентрат', labelEn: 'High-energy concentrate', price: 50 },
      { value: 'molecular-regeneration', label: 'Регенеративный композит', labelEn: 'Regeneration composite', price: 300 },
    ],
    rooms: [
      {
        id: 1,
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
    lostandfaund: [
      { id: 1, name: 'Бронзовая рука', nameEn: 'Bronze Hand', image: bronzeHand8 },
    //   { id: 2, name: 'Фрагмент портрета', nameEn: 'Portrait Piece', image: portraitPiece8 },
    ],
    prize: {
      name: 'Странные наручные часы',
      nameEn: 'Strange Wristwatch',
      image: strangeWatch8,
    },
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
      'Waiter! There is someone else\'s memory in my concentrate!',
    ],
    feedBacks: [
      {
        id: 1,
        author: 'Inspector_G',
        text: 'Странное место. Мой помощник утверждает, что видел человека, проходящего сквозь стену. Но ром здесь отличный.',
        textEn: 'Strange place. My assistant claims he saw a man walking through a wall. But the rum here is excellent.',
      },
      {
        id: 2,
        author: 'Olaf_88',
        text: 'Вернулся из этого отеля моложе на 10 лет. Буквально. Мои часы начали идти в обратную сторону.',
        textEn: 'Returned from this hotel 10 years younger. Literally. My watch started running backwards.',
      },
    ],
    noise: '◌●◦.˳◯. ‹‹ ⊜ ◔◡◔ ⊘ ››',
    endBookingMassege: 'Бронирование подтверждено. Биологический статус: Человек.',
    endBookingMassegeEn: 'Booking confirmed. Biological status: Human.', //капча?
    endWrongBookingMassege: 'Ошибка. Кремниевые формы жизни не допускаются в этот сектор.',
    endWrongBookingMassegeEn: 'Error. Silicon life forms are not allowed in this sector.',
    passingConditions: {
      roomId: 'classic-comfort',
      mealTypes: ['standard'],
      additionalServices: ['dog-service'],
      inventory: ['Mountaineer\'s Hammer'],
    },
    wrongOptions: {
      additionalServices: ['entropy-fix'],
      roomId: 'infinity-view',
      mealTypes: ['molecular-regeneration', 'high-energy'],
      checkInTime: '00:00', // Инопланетяне заезжают в полночь
    },
    captcha: {
      question: 'Выберите изображения с органическими продуктами в стадии распада (испорченная еда):',
      questionEn: 'Select images with organic products in a state of decay (spoiled food):',
      items: [
        { id: 'apple', isCorrect: true, label: 'Гнилое яблоко', image: 'captcha-apple.jpg' },
        { id: 'nail', isCorrect: false, label: 'Ржавый гвоздь', image: 'captcha-nail.jpg' },
        { id: 'fish', isCorrect: true, label: 'Вяленая рыба', image: 'captcha-fish.jpg' },
        { id: 'cheese', isCorrect: true, label: 'Сыр с плесенью', image: 'captcha-cheese.jpg' },
        { id: 'ice', isCorrect: false, label: 'Тающий лед', image: 'captcha-ice.jpg' },
      ],
      errorResponse: 'Ошибка. Окисление металла не является биологическим распадом. Кремниевые формы жизни не допускаются.',
      errorResponseEn: 'Error. Metal oxidation is not biological decay. Silicon life forms are not permitted.'
    },
};
