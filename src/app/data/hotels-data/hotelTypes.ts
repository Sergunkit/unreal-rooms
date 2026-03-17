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
  actionChain?: ActionChain;
}

export interface PassingConditions {
  roomId: string;
  mealTypes?: string[];
  additionalServices?: string[];
  inventory?: string[];
  promoCode?: string;
}

export interface WrongOptions {
  mealTypes?: string[];
  additionalServices?: string[];
  inventory?: string[];
  roomId?: string;
  checkInTime?: string;
  paymentMethod?: string;
  date?: string;
  floor?: string;
  exitCode?: string;
  avoidRoom?: string;
}

export interface InitialFlow {
  steps: string[];
  transitions: Record<string, string>;
}

export type ChainStep =
  | 'hotelPage'
  | 'bookingForm'
  | 'captcha'
  | 'floorSelect'
  | 'bookingConfirm'
  | 'bookingComplete'
  | 'prizeModal'
  | 'myBookingsPage'
  | 'gallery';

export interface ChainConfig {
  steps: ChainStep[];
  conditions?: Record<string, any>;
}

export interface ActionChain {
  steps: ChainStep[];
  conditions?: Record<string, any>;
}

export interface BookingFormDataConditions {
  conditionsNotDone: string;
  conditionsIsDone: string;
  afterReset: string;
  afterComeback: string;
  conditionType?: string; // Тип условия для проверки (например, 'floorSelected')
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
  selectedServices?: string[];
  promoCode?: string;
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
  initialFlow?: InitialFlow;
  customBookingChain?: ChainConfig;
  bookingFormDataConditions?: BookingFormDataConditions;
  anotherBookingState?: Partial<InitialBookingState>;
}
