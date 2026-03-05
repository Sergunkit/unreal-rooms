import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGame } from '../contexts/GameContext';
import { hotelData } from '../data/hotels';
import {
  Users,
  BedDouble,
  Calendar,
  UtensilsCrossed,
  Car,
  Clock,
  CreditCard,
  Wallet,
  Tag,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface HotelAdditionalService {
  id: string;
  name: string;
  nameEn: string;
  price: number;
}

interface HotelRoomType {
  value: string;
  label: string;
  labelEn: string;
  basePrice: number;
}

interface HotelMealType {
  value: string;
  label: string;
  labelEn: string;
  price: number;
}

interface BookingFormPageProps {
  onClose?: () => void;
  isSafeToBook?: boolean;
  selectedRoomType?: string | null;
}

export function BookingFormPage({
  onClose,
  selectedRoomType: selectedRoomTypeProp,
}: BookingFormPageProps) {
  const { language } = useLanguage();
  const { id: hotelId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentBooking, addVisitedHotel, playerStatus, saveTempBookingForm } = useGame();

  // Get temp booking form data if exists
  const tempForm = playerStatus.tempBookingForm;

  // Get saved booking if exists
  const savedBooking = playerStatus.currentBooking;

  // Get hotel data from hotels.ts
  const hotel = hotelId ? hotelData[hotelId] : null;
  const hotelAdditionalServices: HotelAdditionalService[] =
    hotel?.amenities?.additionalServices || [];
  const hotelRoomTypes: HotelRoomType[] = hotel?.roomTypes || [];
  const hotelMealTypes: HotelMealType[] = hotel?.mealTypes || [];

  // Fallback data if hotel data is not available
  const additionalServices: HotelAdditionalService[] =
    hotelAdditionalServices.length > 0
      ? hotelAdditionalServices
      : [
          { id: 'spa', name: 'СПА-процедуры', nameEn: 'SPA treatments', price: 5000 },
          { id: 'massage', name: 'Массаж', nameEn: 'Massage', price: 3500 },
          { id: 'excursion', name: 'Экскурсия', nameEn: 'Excursion', price: 2500 },
          {
            id: 'breakfast-in-room',
            name: 'Завтрак в номер',
            nameEn: 'Breakfast in room',
            price: 1500,
          },
          { id: 'late-checkout', name: 'Поздний выезд', nameEn: 'Late checkout', price: 2000 },
          {
            id: 'airport-meeting',
            name: 'Встреча в аэропорту',
            nameEn: 'Airport pickup',
            price: 3000,
          },
        ];

  const roomTypes: HotelRoomType[] =
    hotelRoomTypes.length > 0
      ? hotelRoomTypes
      : [
          { value: 'standard', label: 'Стандартный', labelEn: 'Standard', basePrice: 8000 },
          { value: 'deluxe', label: 'Делюкс', labelEn: 'Deluxe', basePrice: 12000 },
          { value: 'suite', label: 'Люкс', labelEn: 'Suite', basePrice: 18000 },
          { value: 'premium', label: 'Премиум', labelEn: 'Premium', basePrice: 25000 },
        ];

  const mealTypes: HotelMealType[] =
    hotelMealTypes.length > 0
      ? hotelMealTypes
      : [
          { value: 'no-meal', label: 'Без питания', labelEn: 'No meals', price: 0 },
          { value: 'breakfast', label: 'Завтрак', labelEn: 'Breakfast', price: 1500 },
          { value: 'half-board', label: 'Полупансион', labelEn: 'Half board', price: 3000 },
          { value: 'full-board', label: 'Полный пансион', labelEn: 'Full board', price: 5000 },
        ];

  // Form state
  const [guests, setGuests] = useState(tempForm?.guests || 2);
  const [rooms, setRooms] = useState(tempForm?.rooms || 1);
  const [roomType, setRoomType] = useState(
    selectedRoomTypeProp ||
      tempForm?.roomType ||
      (savedBooking ? String(savedBooking.roomId) : roomTypes[0]?.value || 'standard')
  );
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    tempForm?.checkInDate ? new Date(tempForm.checkInDate) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    tempForm?.checkOutDate ? new Date(tempForm.checkOutDate) : undefined
  );
  const [mealType, setMealType] = useState(
    tempForm?.mealType || savedBooking?.mealType || mealTypes[0]?.value || 'no-meal'
  );
  const [needTransfer, setNeedTransfer] = useState(
    tempForm?.needTransfer ?? savedBooking?.additionalServices?.includes('Cater-transfer') ?? false
  );
  const [checkInTime, setCheckInTime] = useState(tempForm?.checkInTime || '14:00');
  const [selectedServices, setSelectedServices] = useState<string[]>(
    tempForm?.selectedServices || savedBooking?.additionalServices || []
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardType, setCardType] = useState<'visa' | 'mastercard'>('visa');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaSelected, setCaptchaSelected] = useState<string[]>([]);
  const [captchaError, setCaptchaError] = useState(false);
  const [isAlienCaptcha, setIsAlienCaptcha] = useState(false);
  const [roomNumber] = useState(() => Math.floor(Math.random() * 900 + 100));
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const t = {
    title: language === 'ru' ? 'Бронирование номера' : 'Room Booking',
    section1: language === 'ru' ? 'Параметры бронирования' : 'Booking Parameters',
    section2: language === 'ru' ? 'Оплата' : 'Payment',
    guests: language === 'ru' ? 'Количество гостей' : 'Number of guests',
    roomsCount: language === 'ru' ? 'Количество номеров' : 'Number of rooms',
    roomType: language === 'ru' ? 'Тип номера' : 'Room type',
    checkIn: language === 'ru' ? 'Дата заезда' : 'Check-in date',
    checkOut: language === 'ru' ? 'Дата выезда' : 'Check-out date',
    selectDate: language === 'ru' ? 'Выберите дату' : 'Select date',
    mealType: language === 'ru' ? 'Тип питания' : 'Meal type',
    transfer: language === 'ru' ? 'Требуется трансфер' : 'Transfer needed',
    checkInTime: language === 'ru' ? 'Время заезда' : 'Check-in time',
    additionalServices: language === 'ru' ? 'Дополнительные услуги' : 'Additional services',
    paymentMethod: language === 'ru' ? 'Способ оплаты' : 'Payment method',
    cash: language === 'ru' ? 'Наличными' : 'Cash',
    card: language === 'ru' ? 'Картой' : 'Card',
    promoCode: language === 'ru' ? 'Промокод' : 'Promo code',
    enterPromo: language === 'ru' ? 'Введите промокод' : 'Enter promo code',
    applyPromo: language === 'ru' ? 'Применить' : 'Apply',
    totalCost: language === 'ru' ? 'Общая стоимость' : 'Total cost',
    withDiscount: language === 'ru' ? 'С учетом скидок' : 'With discounts',
    reset: language === 'ru' ? 'Сбросить' : 'Reset',
    continue: language === 'ru' ? 'Продолжить' : 'Continue',
    confirmTitle: language === 'ru' ? 'Подтверждение бронирования' : 'Booking Confirmation',
    confirmDesc:
      language === 'ru'
        ? 'Пожалуйста, проверьте детали вашего бронирования'
        : 'Please review your booking details',
    warning:
      language === 'ru'
        ? 'Отменить данное бронирование невозможно'
        : 'This booking cannot be cancelled',
    cancel: language === 'ru' ? 'Отменить' : 'Cancel',
    confirm: language === 'ru' ? 'Подтвердить' : 'Confirm',
    room: language === 'ru' ? 'Номер' : 'Room',
    nights: language === 'ru' ? 'ночей' : 'nights',
    promoApplied: language === 'ru' ? 'Промокод применен!' : 'Promo code applied!',
    invalidPromo: language === 'ru' ? 'Неверный промокод' : 'Invalid promo code',
    bookingSuccess:
      language === 'ru' ? 'Бронирование успешно подтверждено!' : 'Booking confirmed successfully!',
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const selectedRoom = roomTypes.find((r) => r.value === roomType);
    const selectedMeal = mealTypes.find((m) => m.value === mealType);
    const nights = calculateNights();

    let total = 0;
    if (selectedRoom && nights > 0) {
      total = selectedRoom.basePrice * rooms * nights;
    }

    if (selectedMeal) {
      total += selectedMeal.price * guests * nights;
    }

    if (needTransfer) {
      total += 3000 * rooms;
    }

    selectedServices.forEach((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });

    const discountAmount = total * (discount / 100);
    return { total, discountAmount, finalTotal: total - discountAmount };
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleApplyPromo = () => {
    // Mock promo codes
    const validPromos: { [key: string]: number } = {
      UNREAL10: 10,
      UNREAL20: 20,
      MYSTERY15: 15,
      NEVERMORE: 20, // Usher Guest House promo code
    };

    const upperPromo = promoCode.toUpperCase();
    if (validPromos[upperPromo]) {
      setAppliedPromo(upperPromo);
      setDiscount(validPromos[upperPromo]);
    } else {
      setAppliedPromo('');
      setDiscount(0);
    }
  };

  // Save form data when it changes
  useEffect(() => {
    saveTempBookingForm({
      guests,
      rooms,
      roomType,
      checkInDate: checkInDate?.toISOString() || null,
      checkOutDate: checkOutDate?.toISOString() || null,
      mealType,
      needTransfer,
      checkInTime,
      selectedServices,
      promoCode: appliedPromo || undefined,
    });
  }, [
    guests,
    rooms,
    roomType,
    checkInDate,
    checkOutDate,
    mealType,
    needTransfer,
    checkInTime,
    selectedServices,
    appliedPromo,
    saveTempBookingForm,
  ]);

  // Check if hotel has captcha and if user selected wrong options
  const hasHotelCaptcha = hotel?.captcha && hotelId === '8';
  const hasWrongSelections: boolean = !!(
    hotel?.wrongOptions &&
    ((hotel.wrongOptions.roomId && roomType === hotel.wrongOptions.roomId) ||
      (hotel.wrongOptions.mealTypes && hotel.wrongOptions.mealTypes.includes(mealType)) ||
      (hotel.wrongOptions.additionalServices &&
        hotel.wrongOptions.additionalServices.some((s: string) => selectedServices.includes(s))) ||
      (hotel.wrongOptions.checkInTime && checkInTime === hotel.wrongOptions.checkInTime))
  );

  const handleContinue = () => {
    if (!checkInDate || !checkOutDate) {
      alert(
        language === 'ru'
          ? 'Пожалуйста, выберите даты заезда и выезда'
          : 'Please select check-in and check-out dates'
      );
      return;
    }

    // If hotel has captcha, show it instead of confirmation
    if (hasHotelCaptcha) {
      setIsAlienCaptcha(hasWrongSelections);
      setCaptchaSelected([]);
      setCaptchaError(false);
      setShowCaptcha(true);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleCaptchaSubmit = () => {
    const captcha = hotel?.captcha;
    if (!captcha) return;

    if (isAlienCaptcha) {
      // Check alien captcha answers
      const correctAnswers = captcha.alienCorrectAnswers || [];
      const isCorrect =
        correctAnswers.every((id) => captchaSelected.includes(id)) &&
        captchaSelected.length === correctAnswers.length;

      if (isCorrect) {
        // Alien passed - show alien success and complete booking
        setShowCaptcha(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          finalizeBooking(true);
        }, 3000);
      } else {
        setCaptchaError(true);
      }
    } else {
      // Check human captcha answers
      const correctAnswers = captcha.humanCorrectAnswers || ['apple', 'bread'];
      const isCorrect =
        correctAnswers.every((id) => captchaSelected.includes(id)) &&
        captchaSelected.length === correctAnswers.length;

      if (isCorrect) {
        // Human passed - show human success and complete booking
        setShowCaptcha(false);
        setShowConfirmDialog(true);
      } else {
        // Wrong answer - show error
        setCaptchaError(true);
      }
    }
  };

  const handleCaptchaToggle = (itemId: string) => {
    setCaptchaSelected((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
    setCaptchaError(false);
  };

  const finalizeBooking = (_isAlien: boolean = false) => {
    const selectedRoom = roomTypes.find((r) => r.value === roomType);

    // Save booking to game state
    setCurrentBooking({
      roomId: roomType,
      roomName: selectedRoom?.label || '',
      roomNameEn: selectedRoom?.labelEn || '',
      price: finalTotal,
      mealType: mealType as 'no-meal' | 'diet-menu' | 'half-board' | 'all-inclusive',
      additionalServices: selectedServices as (
        | 'sauna'
        | 'fishing'
        | 'excursion'
        | 'breakfast-in-room'
        | 'diving'
        | 'Cater-transfer'
      )[],
      bookedAt: new Date().toISOString(),
    });

    // Add hotel to visited if not already visited
    if (hotelId) {
      addVisitedHotel({
        hotelId,
        hotelName: hotel?.name || '',
        hotelNameEn: hotel?.nameEn || '',
        visitedAt: new Date().toISOString(),
        completed: false,
      });
    }

    setShowConfirmDialog(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/bookings');
    }, 3000);
  };

  const { total, discountAmount, finalTotal } = calculateTotal();
  const nights = calculateNights();

  return (
    <div className={onClose ? '' : 'min-h-screen bg-background py-8'}>
      <div className={onClose ? '' : 'container mx-auto px-4 max-w-5xl'}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Section I: Booking Parameters */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg shadow-primary/5">
              <h2 className="text-xl mb-6 flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                {t.section1}
              </h2>

              <div className="space-y-4">
                {/* Guests & Rooms Count - on one row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Guests */}
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      {t.guests}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="bg-input-background border-border h-9"
                    />
                  </div>

                  {/* Rooms Count */}
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 text-sm">
                      <BedDouble className="h-4 w-4 text-primary" />
                      {t.roomsCount}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                      className="bg-input-background border-border h-9"
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <Label>{t.roomType}</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {language === 'ru' ? type.label : type.labelEn} - ₽
                          {type.basePrice.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Check-in Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t.checkIn}
                  </Label>
                  <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-input-background border-border"
                      >
                        {checkInDate ? (
                          format(checkInDate, 'PPP', { locale: language === 'ru' ? ru : enUS })
                        ) : (
                          <span className="text-muted-foreground">{t.selectDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={checkInDate}
                        onSelect={(date) => {
                          setCheckInDate(date);
                          setIsCheckInOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        locale={language === 'ru' ? ru : enUS}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t.checkOut}
                  </Label>
                  <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-input-background border-border"
                      >
                        {checkOutDate ? (
                          format(checkOutDate, 'PPP', { locale: language === 'ru' ? ru : enUS })
                        ) : (
                          <span className="text-muted-foreground">{t.selectDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={checkOutDate}
                        onSelect={(date) => {
                          setCheckOutDate(date);
                          setIsCheckOutOpen(false);
                        }}
                        disabled={(date) => !checkInDate || date <= checkInDate}
                        locale={language === 'ru' ? ru : enUS}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Meal Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-primary" />
                    {t.mealType}
                  </Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypes.map((meal) => (
                        <SelectItem key={meal.value} value={meal.value}>
                          {language === 'ru' ? meal.label : meal.labelEn}
                          {meal.price > 0 && ` - ₽${meal.price.toLocaleString()}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transfer */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transfer"
                    checked={needTransfer}
                    onCheckedChange={(checked) => setNeedTransfer(checked as boolean)}
                  />
                  <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer">
                    <Car className="h-4 w-4 text-primary" />
                    {t.transfer}
                  </Label>
                </div>

                {/* Check-in Time - inline with label */}
                <div className="flex items-center gap-4">
                  <Label className="flex items-center gap-2 whitespace-nowrap">
                    <Clock className="h-4 w-4 text-primary" />
                    {t.checkInTime}
                  </Label>
                  <Input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="bg-input-background border-border flex-1 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>

                {/* Additional Services */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t.additionalServices}
                  </Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label
                          htmlFor={service.id}
                          className="cursor-pointer text-sm flex justify-between flex-1"
                        >
                          <span>{language === 'ru' ? service.name : service.nameEn}</span>
                          <span className="text-primary">₽{service.price.toLocaleString()}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section II: Payment */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg shadow-primary/5">
              <h2 className="text-xl mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {t.section2}
              </h2>

              <div className="space-y-6">
                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>{t.paymentMethod}</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'cash' | 'card') => setPaymentMethod(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-4 w-4 text-primary" />
                        {t.cash}
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-4 w-4 text-primary" />
                          {t.card}
                        </Label>
                      </div>
                      {/* Card Type - nested under card option */}
                      {paymentMethod === 'card' && (
                        <div className="ml-6 pl-4 border-l-2 border-border space-y-2">
                          <RadioGroup
                            value={cardType}
                            onValueChange={(value: 'visa' | 'mastercard') => setCardType(value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="visa" id="visa" />
                              <Label htmlFor="visa" className="cursor-pointer text-sm">
                                Visa
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mastercard" id="mastercard" />
                              <Label htmlFor="mastercard" className="cursor-pointer text-sm">
                                Mastercard
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>

                {/* Promo Code */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    {t.promoCode}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t.enterPromo}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-input-background border-border"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {t.applyPromo}
                    </Button>
                  </div>
                  {appliedPromo && (
                    <p className="text-sm text-green-500">
                      ✓ {t.promoApplied} ({discount}%)
                    </p>
                  )}
                </div>

                {/* Total Cost */}
                <div className="pt-6 border-t border-border space-y-3">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {nights > 0 && (
                      <div className="flex justify-between">
                        <span>
                          {nights} {t.nights}
                        </span>
                        <span>₽{total.toLocaleString()}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>
                          {language === 'ru' ? 'Скидка' : 'Discount'} ({discount}%)
                        </span>
                        <span>-₽{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xl pt-2">
                    <span>{t.totalCost}</span>
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ₽{finalTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.withDiscount}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setGuests(2);
                  setRooms(1);
                  setRoomType(roomTypes[0]?.value || 'standard');
                  setCheckInDate(undefined);
                  setCheckOutDate(undefined);
                  setMealType(mealTypes[0]?.value || 'no-meal');
                  setNeedTransfer(false);
                  setCheckInTime('14:00');
                  setSelectedServices([]);
                  setPaymentMethod('cash');
                  setCardType('visa');
                  setPromoCode('');
                  setAppliedPromo('');
                  setDiscount(0);
                  // Clear saved temp form
                  saveTempBookingForm({
                    guests: 2,
                    rooms: 1,
                    roomType: roomTypes[0]?.value || 'standard',
                    checkInDate: null,
                    checkOutDate: null,
                    mealType: mealTypes[0]?.value || 'no-meal',
                    needTransfer: false,
                    checkInTime: '14:00',
                    selectedServices: [],
                  });
                }}
                className="flex-1 border-border hover:bg-secondary"
              >
                {t.reset}
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
              >
                {t.continue}
              </Button>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.confirmTitle}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t.confirmDesc}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3 border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.room}:</span>
                  <span>
                    {language === 'ru'
                      ? roomTypes.find((r) => r.value === roomType)?.label
                      : roomTypes.find((r) => r.value === roomType)?.labelEn}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {language === 'ru' ? 'Номер комнаты:' : 'Room number:'}:
                  </span>
                  <span>#{roomNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.checkIn}:</span>
                  <span>
                    {checkInDate &&
                      format(checkInDate, 'PP', { locale: language === 'ru' ? ru : enUS })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.checkOut}:</span>
                  <span>
                    {checkOutDate &&
                      format(checkOutDate, 'PP', { locale: language === 'ru' ? ru : enUS })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.mealType}:</span>
                  <span>
                    {language === 'ru'
                      ? mealTypes.find((m) => m.value === mealType)?.label
                      : mealTypes.find((m) => m.value === mealType)?.labelEn}
                  </span>
                </div>
                {selectedServices.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t.additionalServices}:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {selectedServices.map((serviceId) => {
                        const service = additionalServices.find((s) => s.id === serviceId);
                        return (
                          <li key={serviceId}>
                            {language === 'ru' ? service?.name : service?.nameEn}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-border">
                  <span>{t.totalCost}:</span>
                  <span className="text-primary">₽{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{t.warning}</span>
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 border-border"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={() => finalizeBooking(false)}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
              >
                {t.confirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl text-foreground font-medium mb-2">
                  {language === 'ru' ? 'Бронирование подтверждено!' : 'Booking Confirmed!'}
                </h3>
                <p className="text-muted-foreground">
                  {isAlienCaptcha
                    ? language === 'ru'
                      ? hotel?.endAlienBookingMassege
                      : hotel?.endAlienBookingMassegeEn
                    : language === 'ru'
                      ? hotel?.endBookingMassege
                      : hotel?.endBookingMassegeEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Captcha Modal */}
        {showCaptcha && hotel?.captcha && (
          <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl text-foreground font-medium mb-2">
                  {isAlienCaptcha
                    ? language === 'ru'
                      ? hotel.captcha.alienQuestion
                      : hotel.captcha.alienQuestionEn
                    : language === 'ru'
                      ? hotel.captcha.question
                      : hotel.captcha.questionEn}
                </h3>
                {captchaError && (
                  <p className="text-red-500 text-sm">
                    {language === 'ru'
                      ? hotel.captcha.errorResponse
                      : hotel.captcha.errorResponseEn}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {(isAlienCaptcha ? (hotel.captcha.alienItems ?? []) : hotel.captcha.items).map(
                  (item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCaptchaToggle(item.id)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        captchaSelected.includes(item.id)
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <div className="w-full aspect-[1/1] bg-secondary flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                        {item.label}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCaptcha(false)}
                  className="border-border"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={handleCaptchaSubmit}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
                >
                  {language === 'ru' ? 'Подтвердить' : 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
