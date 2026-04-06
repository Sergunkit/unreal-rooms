import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGame } from '../contexts/GameContext';
import { useHotelProgress } from '../hooks/useHotelProgress';
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

import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Room } from '../data/hotels-data/hotelTypes';

interface HotelAdditionalService {
  id: string;
  name: string;
  nameEn: string;
  price: number;
}

interface HotelRoomType extends Room {
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
  onNextStep: () => void;
  onFinalizeBooking: (isAlien: boolean) => void;
  flowState: { currentStep: string };
  selectedRoomType?: string | null;
}

export function BookingFormPage({
  onNextStep,
  onFinalizeBooking: _onFinalizeBooking, // Renamed to avoid unused variable warning
  flowState, // This prop is not directly used in BookingFormPage for now, but kept for future expansion or clarity
  selectedRoomType: selectedRoomTypeProp,
}: BookingFormPageProps) {
  const { language } = useLanguage();
  const { id: hotelId } = useParams<{ id: string }>();
  // navigate is no longer used in this component, and related prize logic moved
  // const navigate = useNavigate();
  // Removed unused variables from useGame destructuring
  const { playerStatus } = useGame();
  const {
    hotel,
    tempBookingForm,
    setRoomType: setRoomTypeInProgress,
    setTempBookingForm,
  } = useHotelProgress(hotelId);

  // Get temp booking form data if exists
  const tempForm = tempBookingForm;

  // Get saved booking if exists
  const savedBooking = playerStatus.currentBooking;

  const hotelAdditionalServices: HotelAdditionalService[] =
    hotel?.amenities?.additionalServices || [];
  const hotelRoomTypes: Room[] = hotel?.rooms || [];
  const hotelMealTypes: HotelMealType[] = hotel?.mealTypes || [];
  const hotelPromoCodes = hotel?.promoCodes || [];

  // Use hotel data or empty arrays if not available
  const additionalServices: HotelAdditionalService[] = hotelAdditionalServices;
  const roomTypes: HotelRoomType[] = hotelRoomTypes.map((room) => ({
    ...room,
    value: room.value ?? room.name,
    label: room.name,
    labelEn: room.nameEn,
    basePrice: room.price,
  }));
  const mealTypes: HotelMealType[] = hotelMealTypes;

  // Form state
  const [guests, setGuests] = useState(tempForm?.guests || 2);
  const [rooms, setRooms] = useState(tempForm?.rooms || 1);
  const [roomType, setRoomType] = useState(
    selectedRoomTypeProp ||
      tempForm?.roomType ||
      (savedBooking ? String(savedBooking.roomId) : roomTypes[0]?.value)
  );

  useEffect(() => {
    setRoomTypeInProgress(roomType);
  }, [roomType, setRoomTypeInProgress]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    tempForm?.checkInDate ? new Date(tempForm.checkInDate) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    tempForm?.checkOutDate ? new Date(tempForm.checkOutDate) : undefined
  );
  const [mealType, setMealType] = useState(
    tempForm?.mealType || savedBooking?.mealType || mealTypes[0]?.value
  );
  const [needTransfer, setNeedTransfer] = useState(
    tempForm?.needTransfer ?? savedBooking?.additionalServices?.includes('Cater-transfer') ?? false
  );
  const [checkInTime, setCheckInTime] = useState(tempForm?.checkInTime || '14:00');
  const [selectedServices, setSelectedServices] = useState<string[]>(
    tempForm?.selectedServices || savedBooking?.additionalServices || []
  );

  // Проверка: есть ли монета в инвентаре (для NY-Continental)
  const hasCoin = playerStatus.inventory.includes('gold-coin');

  // По умолчанию карта
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [cardType, setCardType] = useState<'visa' | 'mastercard'>('visa');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discount, setDiscount] = useState(0);

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
      total = selectedRoom.price * rooms * nights;
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
    // Find promo code in hotel config
    const upperPromo = promoCode.toUpperCase();
    const foundPromo = hotelPromoCodes.find((p) => p.code.toUpperCase() === upperPromo);

    if (foundPromo) {
      setAppliedPromo(foundPromo.code.toUpperCase());
      setDiscount(foundPromo.discount);
    } else {
      setAppliedPromo('');
      setDiscount(0);
    }
  };

  // Save form data when it changes
  useEffect(() => {
    setTempBookingForm({
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
      paymentMethod,
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
    paymentMethod,
    setTempBookingForm,
  ]);

  // Капча больше не проверяется здесь - логика в цепочке

  const handleContinue = () => {
    if (!checkInDate || !checkOutDate) {
      alert(
        language === 'ru'
          ? 'Пожалуйста, выберите даты заезда и выезда'
          : 'Please select check-in and check-out dates'
      );
      return;
    }
    // Instead of showing internal confirm dialog, move to next step in flow
    onNextStep();
  };

  const { total, discountAmount, finalTotal } = calculateTotal();
  const nights = calculateNights();

  return (
    <div
      className={flowState.currentStep === 'bookingForm' ? '' : 'min-h-screen bg-background py-8'}
    >
      <div
        className={
          flowState.currentStep === 'bookingForm' ? '' : 'container mx-auto px-4 max-w-5xl'
        }
      >
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

                    {/* Наличные - только если есть монета (для NY-Continental) */}
                    <div className="flex items-center space-x-2 mt-4">
                      <RadioGroupItem
                        value="cash"
                        id="cash"
                        disabled={!hasCoin} // ← Наличные только если есть монета
                      />
                      <Label
                        htmlFor="cash"
                        className={`flex items-center gap-2 ${!hasCoin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Wallet className="h-4 w-4 text-primary" />
                        {t.cash}
                        {!hasCoin && (
                          <span className="text-xs text-muted-foreground">(нужна монета)</span>
                        )}
                      </Label>
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
                  // Reset temp form state in progress
                  setTempBookingForm({
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
      </div>
    </div>
  );
}
