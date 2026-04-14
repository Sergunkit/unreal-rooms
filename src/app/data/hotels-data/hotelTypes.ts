export interface Amenities {
  dining: string[];
  diningEn: string[];
  pools: string[];
  poolsEn: string[];
  transport: string[];
  transportEn: string[];
  sports: string[];
  sportsEn: string[];
  additional: string[];
  additionalEn: string[];
  restrictions: string[];
  restrictionsEn: string[];
  heart_tool_tip?: string;
  heart_tool_tipEn?: string;
  additionalServices?: { id: string; name: string; nameEn: string; price: number }[];
}

// ==================== НОВЫЕ ТИПЫ ДЛЯ ЦЕПОЧЕК ====================

/**
 * Операторы для условий
 */
export type ConditionOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'includes' | 'notIncludes';

/**
 * Условие для проверки
 */
export interface Condition {
  field: string; // 'isSafeToBook', 'inventory', 'paymentMethod', etc.
  operator: ConditionOperator;
  value: any;
  or?: Condition[]; // ← Для сложных условий (A или B)
}

/**
 * Типы действий (триггеров)
 */
export type ActionType =
  | 'galleryClick'
  | 'buttonClick'
  | 'formSubmit'
  | 'formFieldChange'
  | 'roomSelect'
  | 'inventoryUse'
  | 'paymentSelect'
  | 'timer'
  | 'chatMessage'
  | 'achievement'
  | 'externalLink';

/**
 * Триггер действия
 */
export interface ActionTrigger {
  imageIndex?: number;
  coords?: { x1: number; y1: number; x2: number; y2: number };
  elementId?: string;
  roomId?: string;
  field?: string;
  formId?: string;
  source?: string;
}

/**
 * Действие в шаге цепочки
 */
export interface Action {
  id: string;
  type: ActionType;
  trigger?: ActionTrigger; // ← Опционально (например для formSubmit)
  nextStep: string;
  params?: Record<string, any>; // ← Параметры для передачи в контекст
}

/**
 * Переходы из шага
 */
export interface Transitions {
  [key: string]: {
    // 'submit', 'cancel', 'success', 'fail', 'confirm', 'default'
    conditions?: Condition[];
    nextStep: string;
    params?: Record<string, any>;
    delay?: number; // ← Задержка перед переходом (в мс)
  };
}

/**
 * Входные данные для шага (для UI)
 */
export interface StepInput {
  [key: string]: any;
}

/**
 * Шаг цепочки
 */
export interface ChainStep {
  id: string;
  step: number;
  conditions?: Condition[]; // ← Условия для входа на шаг
  input?: StepInput; // ← Данные для UI (показать/скрыть элементы)
  actions?: Action[]; // ← Триггеры (клики, выборы, отправки)
  transitions?: Transitions; // ← Куда идём после действия
  fallback?: { nextStep: string }; // ← Если условия не выполнены
}

/**
 * Тип цепочки
 */
export type ChainType = 'standard' | 'custom';

/**
 * Цепочка шагов отеля
 */
export interface Chain {
  hotelId: number;
  type: ChainType;
  steps: Record<string, ChainStep>; // { hotelPage: {...}, bookingForm: {...} }
}

// ==================== СТАРЫЕ ТИПЫ (для обратной совместимости) ====================

export interface PromoCode {
  code: string;
  discount: number; // percentage
  description?: string;
  descriptionEn?: string;
}

export interface RoomType {
  value: string;
  label: string;
  labelEn: string;
  price: number;
  size: number;
  capacity: number;
  beds: string;
  bedsEn: string;
  amenities: string[];
  amenitiesEn: string[];
  image: string;
}

export interface MealType {
  value: string;
  label: string;
  labelEn: string;
  price: number;
  description?: string;
  descriptionEn?: string;
}

export interface FeedBack {
  id: number;
  author: string;
  text: string;
  textEn: string;
}

export interface LostAndFoundItem {
  id: string;
}

export interface Room {
  id: number;
  roomNumber: number | null;
  name: string;
  nameEn: string;
  price: number;
  size: number;
  capacity: number;
  beds: string;
  bedsEn: string;
  amenities: string[];
  amenitiesEn: string[];
  image: string;
  value?: string;
}

export interface GalleryImageAction {
  imageIndex: number;
  type: 'toggle' | 'hint' | 'figurines' | 'artifact-find' | 'capcha-get';
  alternateImage?: string;
  coords?: { x1: number; y1: number; x2: number; y2: number };
  message?: string;
  messageEn?: string;
  artefact?: string; // id артефакта
  capcha?: Captcha; // Капча для capcha-get действия
  actionChain?: LegacyActionChain;
  resetOnReentry?: boolean; // Сбрасывать прогресс при повторном входе
}

export interface PassingConditions {
  roomId?: string;
  mealTypes?: string[];
  additionalServices?: string[];
  inventory?: string[]; // Артефакты, которые нужно иметь (возвращаются после бронирования)
  inventoryPayment?: string[]; // Артефакты, которые забираются как оплата (не возвращаются)
  promoCode?: string;
  paymentType?: string;
}

export interface WrongOptions {
  mealTypes?: string[];
  additionalServices?: string[];
  inventory?: string[];
  roomId?: string[];
  checkInTime?: string;
  paymentMethod?: string;
  date?: string | { from: string; to: string }; // string = exact match, object = date range (YYYY-MM-DD)
  floor?: string;
  exitCode?: string;
  avoidRoom?: string;
  paymentType?: string;
}

export interface InitialFlow {
  steps: string[];
  transitions: Record<string, string>;
}

// ==================== УСТАРЕВШИЕ ТИПЫ (для обратной совместимости) ====================
// Эти типы используются только в старых данных отелей и будут удалены после полной миграции

export type LegacyChainStep =
  | 'hotelPage'
  | 'bookingForm'
  | 'captcha'
  | 'floorSelect'
  | 'bookingConfirm'
  | 'bookingComplete'
  | 'prizeModal'
  | 'myBookingsPage'
  | 'gallery';

export interface LegacyTransitionCondition {
  requires?: {
    roomType?: string;
    roomTypes?: string[];
    mealType?: string;
    mealTypes?: string[];
    services?: string[];
    inventory?: string[];
    floor?: number;
    promoCode?: string;
  };
  alternative?: {
    step: LegacyChainStep;
    reason?: 'alien' | 'wrong' | 'blocked';
  };
}

export interface LegacyChainConfig {
  steps: LegacyChainStep[];
  transitions?: {
    [from: string]: LegacyTransitionCondition;
  };
}

export interface LegacyActionChain {
  steps: LegacyChainStep[];
}

export interface BookingFormDataConditions {
  conditionsNotDone: string;
  conditionsIsDone: string;
  afterReset: string;
  afterComeback: string;
  conditionType?: string;
}

export interface CaptchaItem {
  id: string;
  isCorrect: boolean;
  label: string;
  image: string;
}

export interface Captcha {
  question: string;
  questionEn: string;
  items: CaptchaItem[];
  errorResponse: string;
  errorResponseEn: string;
  successResponse?: string;
  successResponseEn?: string;
  correctSequence?: Array<string | number>;
  alienQuestion?: string;
  alienQuestionEn?: string;
  alienItems?: CaptchaItem[];
  alienCorrectAnswers?: string[];
  humanCorrectAnswers?: string[];
}

export interface InitialBookingState {
  roomNumber?: string;
  roomNumberTemplate?: string; // e.g. '{floor}{suffix}'
  defaultFloor?: number;
  floorOptions?: number[];
  suffixByRoomType?: Record<string, string>;
  roomType?: string;
  guests?: number;
  rooms?: number;
  mealType?: string;
  needTransfer?: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  checkInTime?: string;
  dateRange?: { from: string; to: string }; // Pre-set date range (YYYY-MM-DD)
  selectedServices?: string[];
  promoCode?: string;
  paymentMethod?: string;
  hasCoin?: boolean;
}

// Временные данные формы бронирования
export interface TempBookingFormData {
  guests: number;
  rooms: number;
  roomType: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  mealType: string;
  needTransfer: boolean;
  checkInTime: string;
  selectedServices: string[];
  promoCode?: string;
  paymentMethod?: 'cash' | 'card';
}

export interface Hotel {
  id: number;
  name: string;
  nameEn: string;
  stars: number;
  rating: number;
  price: number;
  slogan: string;
  sloganEn: string;
  description: string;
  descriptionEn: string;
  location: string;
  locationEn: string;
  commonFeedback: string;
  commonFeedbackEn: string;
  image: string;
  images: string[];
  galleryActions?: GalleryImageAction[];
  amenities: Amenities;
  heart_tool_tip?: string;
  heart_tool_tipEn?: string;
  feedBacks: FeedBack[];
  lostandfaund: string[];
  rooms: Room[];
  roomTypes?: RoomType[];
  mealTypes?: MealType[];
  prize?: string;
  chatMassages?: string[];
  chatMassegesEn?: string[];
  noise?: string;
  endBookingMassege?: string;
  endBookingMassegeEn?: string;
  endAlienBookingMassege?: string;
  endAlienBookingMassegeEn?: string;
  endWrongBookingMassege?: string;
  endWrongBookingMassegeEn?: string;
  passingConditions?: PassingConditions;
  wrongOptions?: WrongOptions;
  captcha?: Captcha;
  promoCodes?: PromoCode[];
  initialBookingState?: InitialBookingState;
  // Устаревшие поля (для обратной совместимости)
  initialFlow?: InitialFlow;
  customBookingChain?: LegacyChainConfig;
  bookingFormDataConditions?: BookingFormDataConditions;
  anotherBookingState?: Partial<InitialBookingState>;
}
