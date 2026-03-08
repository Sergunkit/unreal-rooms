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
  basePrice: number;
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
  id: number | string;
  name: string;
  nameEn: string;
  image: string;
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
  type: 'toggle' | 'hint' | 'figurines' | 'artifact-find';
  alternateImage?: string;
  coords?: { x1: number; y1: number; x2: number; y2: number };
  message?: string;
  messageEn?: string;
  artefact?: { id: number; name: string; nameEn: string; image: string };
}

export interface Prize {
  name: string;
  nameEn: string;
  image: string;
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
  alienQuestion?: string;
  alienQuestionEn?: string;
  alienItems?: CaptchaItem[];
  alienCorrectAnswers?: string[];
  humanCorrectAnswers?: string[];
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
  lostandfaund: LostAndFoundItem[];
  rooms: Room[];
  roomTypes?: RoomType[];
  mealTypes?: MealType[];
  prize?: Prize;
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
}
