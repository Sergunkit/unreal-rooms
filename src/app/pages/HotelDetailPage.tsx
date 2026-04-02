/* eslint-disable prettier/prettier */
import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Star,
  MapPin,
  // Wifi,
  UtensilsCrossed,
  Dumbbell,
  Waves,
  Car,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Users,
  BedDouble,
  X,
  Sparkles,
  Sparkle,
  MessageSquare,
  Search,
  TriangleAlert,
  Calendar,
  // TV,
  // BriefcaseMedical,
  // Snowflake,
  // ConciergeBell,
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { BookingFormPage } from './BookingFormPage';
import useEmblaCarousel from 'embla-carousel-react';
import { ConciergeChat } from '../components/ConciergeChat';
import { CaptchaModal } from '../components/CaptchaModal';
import { useHotelProgress } from '../hooks/useHotelProgress';
import { useHotelFlow } from '../hooks/useHotelFlow';
import { useGame } from '../contexts/GameContext';
import { artefacts } from '../data/artefacts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'; // Importing Dialog components
import { Button } from '@/app/components/ui/button'; // Importing Button component
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const { playerStatus, addArtefact, hasArtefact, addToInventory, removeFromInventory, clearCurrentHotelProgress } =
    useGame();
  const {
    currentChain,
    activeStep,
    chainType,
    currentChainIndex,
    completedSteps,
    galleryStates,
    galleryActionsTriggered,
    captchaCompleted,
    floorSelected,
    handleGalleryClick,
    handleCaptchaSuccess,
    handleFloorSelect,
    canBook,
    nextChainStep,
    updateFlowState,
  } = useHotelFlow(id);
  const { hotel, floor, tempBookingForm, roomNumber } = useHotelProgress(id);

  // Создаём flowState для обратной совместимости с существующим кодом
  const flowState = useMemo(
    () => ({
      currentStep: activeStep,
      completedSteps,
      galleryStates,
      galleryActionsTriggered,
      captchaCompleted,
      floorSelected,
      currentChain,
      currentChainIndex,
      chainType,
      captchaReason: playerStatus.currentHotelProgress?.captchaReason,
      bookingMessage: playerStatus.currentHotelProgress?.bookingMessage,  // ← Добавляем
    }),
    [
      activeStep,
      completedSteps,
      galleryStates,
      galleryActionsTriggered,
      captchaCompleted,
      floorSelected,
      currentChain,
      currentChainIndex,
      chainType,
      playerStatus.currentHotelProgress?.captchaReason,
      playerStatus.currentHotelProgress?.bookingMessage,  // ← Добавляем
    ]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [showBookingFlowModal, setShowBookingFlowModal] = useState(false); // Controls the main booking flow modal
  const [selectedRoomTypeForBooking, setSelectedRoomTypeForBooking] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number;
    name: string;
    nameEn: string;
    image: string;
    size: number;
    capacity: number;
    beds: string;
    bedsEn: string;
    price: number;
    amenities: string[];
    amenitiesEn: string[];
  } | null>(null);
  const [showGalleryMessage, setShowGalleryMessage] = useState<{ show: boolean; text: string }>({
    show: false,
    text: '',
  });
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [foundArtifact, setFoundArtifact] = useState<{
    id: string;
    name: string;
    nameEn: string;
    image: string;
    alreadyCollected?: boolean;
  } | null>(null);

  // States for CaptchaModal, moved from BookingFormPage
  const [captchaSelected, setCaptchaSelected] = useState<string[]>([]);
  const [captchaError, setCaptchaError] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloorSelectModal, setShowFloorSelectModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  // Force re-render when tempBookingForm changes to update heart icon in real-time
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => {
    forceUpdate((prev) => prev + 1);
  }, [playerStatus.currentHotelProgress, playerStatus.currentBooking]);

  // Auto-open main booking flow modal when the current step implies it
  React.useEffect(() => {
    // Открываем модалку бронирования для шагов bookingForm, bookingConfirm, bookingComplete, prizeModal
    // При bookingConfirm показываем Dialog подтверждения поверх модалки
    // captcha и floorSelect открываются в отдельных модалках на весь экран
    // hotelPage и gallery — это страница отеля, модалка не нужна
    if (
      flowState.currentStep === 'bookingForm' ||
      flowState.currentStep === 'bookingConfirm' ||
      flowState.currentStep === 'bookingComplete' ||
      flowState.currentStep === 'prizeModal'
    ) {
      setShowBookingFlowModal(true);
    } else {
      setShowBookingFlowModal(false);
    }
  }, [flowState.currentStep]);

  // Auto-open floor select modal when currentStep is floorSelect
  React.useEffect(() => {
    if (flowState.currentStep === 'floorSelect') {
      setShowFloorSelectModal(true);
      // Сбрасываем предыдущий выбор этажа при открытии модального окна
      setSelectedFloor(null);
    }
  }, [flowState.currentStep]);

  // Reset captcha selection when captcha step starts
  React.useEffect(() => {
    if (flowState.currentStep === 'captcha') {
      // Сбрасываем предыдущий выбор капчи при открытии модального окна
      setCaptchaSelected([]);
      setCaptchaError(false);
    }
  }, [flowState.currentStep]);

  // Clear current hotel progress when the flow transitions to myBookingsPage
  React.useEffect(() => {
    if (flowState.currentStep === 'myBookingsPage') {
      clearCurrentHotelProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowState.currentStep]); // clearCurrentHotelProgress removed from dependencies

  // Helper for text translation
  const t = useMemo(
    () => ({
      room: language === 'ru' ? 'Номер' : 'Room',
      roomNumberLabel: language === 'ru' ? 'Номер комнаты' : 'Room number',
      floorLabel: language === 'ru' ? 'Этаж' : 'Floor',
      checkIn: language === 'ru' ? 'Дата заезда' : 'Check-in date',
      checkOut: language === 'ru' ? 'Дата выезда' : 'Check-out date',
      mealType: language === 'ru' ? 'Тип питания' : 'Meal type',
      additionalServices: language === 'ru' ? 'Дополнительные услуги' : 'Additional services',
      totalCost: language === 'ru' ? 'Общая стоимость' : 'Total cost',
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
      bookingConfirmed: language === 'ru' ? 'Бронирование подтверждено!' : 'Booking Confirmed!',
      bookingConfirmedHuman:
        language === 'ru' && hotel ? hotel?.endBookingMassege : hotel?.endBookingMassegeEn,
      bookingConfirmedAlien:
        language === 'ru' && hotel
          ? hotel?.endAlienBookingMassege
          : hotel?.endAlienBookingMassegeEn,
      artifactAlreadyCollected:
        language === 'ru' ? 'Артефакт уже получен' : 'Artifact Already Collected',
      artifactFound: language === 'ru' ? 'Артефакт найден!' : 'Artifact Found!',
      artifactAlreadyInSuitcase:
        language === 'ru'
          ? 'Этот артефакт уже есть в вашем чемодане.'
          : 'This artifact is already in your suitcase.',
      artifactFoundDescription:
        language === 'ru'
          ? 'Вы нашли артефакт! Нажмите кнопку ниже, чтобы добавить его в чемодан.'
          : 'You found an artifact! Click the button below to add it to your suitcase.',
      addToSuitcase: language === 'ru' ? 'Забрать в чемодан' : 'Add to Suitcase',
    }),
    [
      language,
      hotel, // Keep only hotel, as individual properties are covered by its change
    ]
  );

  // Functions passed to BookingFormPage
  const onNextStep = useCallback(() => {
    nextChainStep();
  }, [nextChainStep]);

  // Функция для открытия формы бронирования
  const openBookingForm = useCallback(() => {
    console.log('[openBookingForm] called');
    updateFlowState({
      activeStep: 'bookingForm',
      currentStep: 'bookingForm',
      currentChainIndex: 1,
      completedSteps: ['hotelPage', 'bookingForm'],
    });
  }, [updateFlowState]);

  const isSafeToBook = canBook;

  const onFinalizeBooking = useCallback(
    (_isAlien: boolean = false) => {
      // Всегда позволяем бронирование, просто показываем разное сообщение
      // Устанавливаем тип сообщения в зависимости от isSafeToBook
      updateFlowState({
        currentStep: 'bookingComplete',
        currentChainIndex: flowState.currentChain.indexOf('bookingComplete'),
        completedSteps: [...flowState.completedSteps, 'bookingComplete'],
        bookingMessage: isSafeToBook ? 'human' : 'alien',  // ← Сохраняем тип сообщения
      });

      // Consume artifacts if booking is safe (inventoryPayment items are consumed)
      if (isSafeToBook && hotel?.passingConditions?.inventoryPayment) {
        hotel.passingConditions.inventoryPayment.forEach((artifactId) => {
          removeFromInventory(artifactId);
        });
      }

      // Handle prize logic after a short delay (similar to original logic)
      const prizeTimer = setTimeout(() => {
        if (hotel?.prize && isSafeToBook) {
          // If there's a prize AND booking is safe, add it to inventory and show artifact modal
          const prizeArtefact = artefacts[hotel.prize];
          if (prizeArtefact) {
            addArtefact({
              artefactId: prizeArtefact.id,
              name: prizeArtefact.name,
              nameEn: prizeArtefact.nameEn,
              image: prizeArtefact.image,
              collectedAt: new Date().toISOString(),
            });
            addToInventory(hotel.prize);
            window.dispatchEvent(new Event('prizeCollected'));
            setFoundArtifact({
              id: prizeArtefact.id,
              name: prizeArtefact.name,
              nameEn: prizeArtefact.nameEn,
              image: prizeArtefact.image,
              alreadyCollected: false,
            });
            setShowArtifactModal(true);
          }
          // Go to myBookingsPage after showing prize
          updateFlowState({
            currentStep: 'myBookingsPage',
            currentChainIndex: flowState.currentChain.indexOf('myBookingsPage'),
            completedSteps: [...flowState.completedSteps, 'myBookingsPage'],
          });
        } else {
          // No prize or unsafe booking, skip prizeModal and go to myBookingsPage
          updateFlowState({
            currentStep: 'myBookingsPage',
            currentChainIndex: flowState.currentChain.indexOf('myBookingsPage'),
            completedSteps: [...flowState.completedSteps, 'myBookingsPage'],
          });
        }
      }, 2000); // 2 seconds delay for bookingComplete modal

      return () => clearTimeout(prizeTimer); // Cleanup for the timer
    },
    [
      isSafeToBook,
      hotel?.prize,
      hotel?.passingConditions?.inventoryPayment,
      flowState.currentChain,
      flowState.completedSteps,
      updateFlowState,
      addArtefact,
      addToInventory,
      removeFromInventory,
    ]
  );

  // Moved useMemo hooks outside of conditional return
  const selectedBookingRoomType = useMemo(() => {
    return hotel?.roomTypes?.find((r) => r.value === tempBookingForm?.roomType);
  }, [hotel?.roomTypes, tempBookingForm?.roomType]);

  const selectedBookingMealType = useMemo(() => {
    return hotel?.mealTypes?.find((m) => m.value === tempBookingForm?.mealType);
  }, [hotel?.mealTypes, tempBookingForm?.mealType]);

  const additionalBookingServices = useMemo(() => {
    const services = hotel?.amenities?.additionalServices || [];
    return tempBookingForm?.selectedServices
      ?.map((id: string) => services.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined && s !== null);
  }, [hotel?.amenities?.additionalServices, tempBookingForm?.selectedServices]);

  const calculateTotalDisplay = useMemo(() => {
    let total = 0;
    if (!hotel || !tempBookingForm) return 0;

    if (
      selectedBookingRoomType &&
      tempBookingForm.rooms &&
      tempBookingForm.checkInDate &&
      tempBookingForm.checkOutDate
    ) {
      const checkInDate = new Date(tempBookingForm.checkInDate);
      const checkOutDate = new Date(tempBookingForm.checkOutDate);
      const diff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        total = selectedBookingRoomType.price * tempBookingForm.rooms * nights;
      }
    }

    if (
      selectedBookingMealType &&
      tempBookingForm.guests &&
      tempBookingForm.checkInDate &&
      tempBookingForm.checkOutDate
    ) {
      const checkInDate = new Date(tempBookingForm.checkInDate);
      const checkOutDate = new Date(tempBookingForm.checkOutDate);
      const diff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        total += selectedBookingMealType.price * tempBookingForm.guests * nights;
      }
    }

    if (tempBookingForm.needTransfer) {
      total += 3000 * (tempBookingForm.rooms || 1); // Assuming 3000 per room for transfer
    }

    hotel.amenities.additionalServices?.forEach((service) => {
      if (tempBookingForm.selectedServices?.includes(service.id)) {
        total += service.price;
      }
    });

    const foundPromo = hotel.promoCodes?.find(
      (p) => p.code.toUpperCase() === tempBookingForm.promoCode?.toUpperCase()
    );
    if (foundPromo) {
      total -= total * (foundPromo.discount / 100);
    }

    return total;
  }, [hotel, tempBookingForm, selectedBookingRoomType, selectedBookingMealType]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-foreground mb-4">
            {language === 'ru' ? 'Отель не найден' : 'Hotel not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {language === 'ru' ? 'На главную' : 'Go home'}
          </button>
        </div>
      </div>
    );
  }

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const feedbacks = hotel.feedBacks;

  const lostFoundItems = hotel.lostandfaund?.map((item) => artefacts[item]).filter(Boolean) || [];

  const handleCollectArtefact = (item: {
    id: number | string;
    name: string;
    nameEn: string;
    image: string;
  }) => {
    if (!hasArtefact(String(item.id))) {
      addArtefact({
        artefactId: String(item.id),
        name: item.name,
        nameEn: item.nameEn,
        image: item.image,
        collectedAt: new Date().toISOString(),
      });
      // Add to inventory
      addToInventory(String(item.id)); // Dispatch event for suitcase animation
      window.dispatchEvent(new Event('artefactCollected'));
      alert(language === 'ru' ? 'Артефакт добавлен в чемодан!' : 'Artefact added to suitcase!');
    }
  };

  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 py-8">
        {/* <main className="flex flex-col lg:flex-row gap-8 mb-8"> */}
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'ru' ? 'Назад к списку' : 'Back to list'}</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left side: Gallery */}
          <div className="w-full lg:w-[50%]">
            {/* Gallery */}
            <div className="relative">
              <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                <div className="flex">
                  {hotel.images.map((image, index) => {
                    const galleryAction = hotel.galleryActions?.find(
                      (action) => action.imageIndex === index
                    );
                    const isHeadImageToggled =
                      galleryAction?.type === 'toggle' && (flowState.galleryStates[index] ?? false);
                    const isFigurinesToggled =
                      galleryAction?.type === 'hint' && (flowState.galleryStates[index] ?? false);
                    const isArtifactToggled =
                      galleryAction?.type === 'artifact-find' &&
                      (flowState.galleryStates[index] ?? false);

                    return (
                      <div key={index} className="flex-[0_0_100%] min-w-0">
                        {galleryAction?.type === 'toggle' ? (
                          <img
                            src={isHeadImageToggled ? galleryAction.alternateImage : image}
                            alt={`${hotel.name} ${index + 1}`}
                            className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[750px] object-cover cursor-pointer"
                            onClick={() => handleGalleryClick(index)}
                          />
                        ) : galleryAction?.type === 'hint' ? (
                          <div
                            className="relative"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = ((e.clientX - rect.left) / rect.width) * 100;
                              const y = ((e.clientY - rect.top) / rect.height) * 100;

                              if (
                                galleryAction.coords &&
                                x >= galleryAction.coords.x1 &&
                                x <= galleryAction.coords.x2 &&
                                y >= galleryAction.coords.y1 &&
                                y <= galleryAction.coords.y2
                              ) {
                                const triggeredAction = handleGalleryClick(index, { x, y });
                                if (triggeredAction) {
                                  setShowGalleryMessage({
                                    show: true,
                                    text:
                                      language === 'ru'
                                        ? galleryAction.message!
                                        : galleryAction.messageEn!,
                                  });
                                  setTimeout(
                                    () => setShowGalleryMessage({ show: false, text: '' }),
                                    3000
                                  );
                                }
                              }
                            }}
                          >
                            <img
                              src={
                                isFigurinesToggled && galleryAction.alternateImage
                                  ? galleryAction.alternateImage
                                  : image
                              }
                              alt={`${hotel.name} ${index + 1}`}
                              className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[750px] object-cover"
                            />
                          </div>
                        ) : galleryAction?.type === 'artifact-find' ? (
                          <div
                            className="relative"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = ((e.clientX - rect.left) / rect.width) * 100;
                              const y = ((e.clientY - rect.top) / rect.height) * 100;

                              if (
                                galleryAction.coords &&
                                x >= galleryAction.coords.x1 &&
                                x <= galleryAction.coords.x2 &&
                                y >= galleryAction.coords.y1 &&
                                y <= galleryAction.coords.y2
                              ) {
                                const triggeredAction = handleGalleryClick(index, { x, y });
                                if (triggeredAction) {
                                  // Show artifact modal
                                  if (galleryAction.artefact) {
                                    const artefactData = artefacts[galleryAction.artefact];
                                    if (artefactData) {
                                      const alreadyHas = hasArtefact(artefactData.id);
                                      setFoundArtifact({
                                        id: artefactData.id,
                                        name: artefactData.name,
                                        nameEn: artefactData.nameEn,
                                        image: artefactData.image,
                                        alreadyCollected: alreadyHas,
                                      });
                                      setShowArtifactModal(true);
                                    }
                                  }
                                }
                              }
                            }}
                          >
                            <img
                              src={
                                isArtifactToggled && galleryAction.alternateImage
                                  ? galleryAction.alternateImage
                                  : image
                              }
                              alt={`${hotel.name} ${index + 1}`}
                              className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[750px] object-cover"
                            />
                          </div>
                        ) : galleryAction?.type === 'capcha-get' ? (
                          <div
                            className="relative"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = ((e.clientX - rect.left) / rect.width) * 100;
                              const y = ((e.clientY - rect.top) / rect.height) * 100;

                              const triggeredAction = handleGalleryClick(index, { x, y });
                              if (triggeredAction) {
                                setShowGalleryMessage({
                                  show: true,
                                  text:
                                    language === 'ru'
                                      ? galleryAction.message!
                                      : galleryAction.messageEn!,
                                });
                                setTimeout(
                                  () => setShowGalleryMessage({ show: false, text: '' }),
                                  3000
                                );
                              }
                            }}
                          >
                            <img
                              src={image}
                              alt={`${hotel.name} ${index + 1}`}
                              className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[750px] object-cover"
                            />
                          </div>
                        ) : (
                          <img
                            src={image}
                            alt={`${hotel.name} ${index + 1}`}
                            className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[750px] object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {showGalleryMessage.show && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
                {showGalleryMessage.text}
              </div>
            )}
          </div>

          {/* Right side: Header */}
          <div className="w-full lg:w-[50%] flex flex-col justify-between">
            <div className="flex-grow flex flex-col">
              {' '}
              {/* This div will now grow and contain header, slogan, and the description block */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl lg:text-5xl text-foreground">
                    {language === 'ru' ? hotel.name : hotel.nameEn}
                  </h1>
                  <div className="flex items-center gap-1">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5  text-primary" />
                    ))}
                  </div>
                </div>
                <div className="flex items-right gap-2 ml-auto">
                  {hotel.amenities.heart_tool_tip ? (
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <button className="p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition-all">
                          <Heart
                            className={`w-6 h-6 transition-all cursor-pointer ${
                              !isSafeToBook
                                ? 'fill-red-500 text-red-500'
                                : 'text-primary-foreground'
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={5}>
                        <p className="text-sm">
                          {language === 'ru'
                            ? hotel.amenities.heart_tool_tip
                            : hotel.amenities.heart_tool_tipEn}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition-all"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${
                          !isSafeToBook ? 'fill-red-500 text-red-500' : 'text-primary-foreground'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
              {/* Slogan */}
              <div className="flex items-center gap-8 flex-wrap mb-6">
                <div className="flex items-center gap-2 italic text-xl text-muted-foreground">
                  {/* <ConciergeBell className="w-5 h-5 text-primary" /> */}
                  <span>{language === 'ru' ? hotel.slogan : hotel.sloganEn}</span>
                </div>
              </div>
              {/* Description (now containing rating/location) */}
              <div className="bg-card border border-border rounded-lg p-6 mb-15 mt-8 flex-grow">
                {' '}
                {/* Removed flex-grow from here */}
                <h2 className="text-2xl text-foreground mb-4">
                  {language === 'ru' ? 'Об отеле' : 'About the hotel'}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {language === 'ru' ? hotel.description : hotel.descriptionEn}
                </p>
                {/* Raiting */}
                <div className="flex items-center gap-8 flex-wrap mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-semibold text-primary">{hotel.rating}</span>
                    <span>{language === 'ru' ? hotel.commonFeedback : hotel.commonFeedbackEn}</span>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-center gap-8 flex-wrap mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5  text-primary" />
                    <span>{language === 'ru' ? hotel.location : hotel.locationEn}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book a room button - pushed to bottom with mt-auto */}
            <button
              onClick={() => {
                console.log('[Book button] clicked!');
                openBookingForm();
              }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 mt-auto"
            >
              {language === 'ru' ? 'Забронировать номер' : 'Book a room'}
            </button>
          </div>
        </div>

        {/* Description
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-2xl text-foreground mb-4">
          {language === 'ru' ? 'Об отеле' : 'About the hotel'}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {language === 'ru' ? hotel.description : hotel.descriptionEn}
        </p>
      </div> */}

        {/* Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              <h3 className="text-xl text-foreground">
                {language === 'ru' ? 'Питание' : 'Dining'}
              </h3>
            </div>
            <ul className="space-y-2">
              {(language === 'ru' ? hotel.amenities.dining : hotel.amenities.diningEn).map(
                (item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="w-6 h-6 text-primary" />
              <h3 className="text-xl text-foreground">
                {language === 'ru' ? 'Бассейны и SPA' : 'Pools & SPA'}
              </h3>
            </div>
            <ul className="space-y-2">
              {(language === 'ru' ? hotel.amenities.pools : hotel.amenities.poolsEn).map(
                (item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Car className="w-6 h-6 text-primary" />
              <h3 className="text-xl text-foreground">
                {language === 'ru' ? 'Транспорт' : 'Transport'}
              </h3>
            </div>
            <ul className="space-y-2">
              {(language === 'ru' ? hotel.amenities.transport : hotel.amenities.transportEn).map(
                (item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="w-6 h-6 text-primary" />
              <h3 className="text-xl text-foreground">
                {language === 'ru' ? 'Спорт и активности' : 'Sports & Activities'}
              </h3>
            </div>
            <ul className="space-y-2">
              {(language === 'ru' ? hotel.amenities.sports : hotel.amenities.sportsEn).map(
                (item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Additional Services & Amenities */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkle className="w-6 h-6 text-primary" />
            <h3 className="text-xl text-foreground">
              {language === 'ru'
                ? 'Дополнительные услуги и удобства'
                : 'Additional Services & Amenities'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(language === 'ru' ? hotel.amenities.additional : hotel.amenities.additionalEn).map(
              (item, i) => (
                <div key={i} className="text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Rooms */}
        <div className="mb-8">
          <h2 className="text-2xl text-foreground mb-6">
            {language === 'ru' ? 'Доступные номера' : 'Available Rooms'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <div
                key={room.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <img src={room.image} alt={room.name} className="w-full h-[19.2rem] object-cover" />
                <div className="p-4">
                  <h3 className="text-lg text-foreground mb-2">
                    {language === 'ru' ? room.name : room.nameEn}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4" />
                      <span>{room.size} м²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {room.capacity} {language === 'ru' ? 'гостя' : 'guests'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4" />
                      <span>{language === 'ru' ? room.beds : room.bedsEn}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-2xl text-primary font-semibold">${room.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {language === 'ru' ? 'за ночь' : 'per night'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Detail Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg w-full h-full max-w-6xl max-h-[95vh] overflow-hidden flex relative">
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 p-2 bg-primary rounded-full hover:bg-primary/80 transition-colors z-20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-[57.5%] h-full relative">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              <div className="w-[42.5%] flex flex-col p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl text-foreground font-semibold">
                    {language === 'ru' ? selectedRoom.name : selectedRoom.nameEn}
                  </h3>
                </div>
                <div className="space-y-4 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5" />
                      <span>{selectedRoom.size} м²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>
                        {selectedRoom.capacity} {language === 'ru' ? 'гостя' : 'guests'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-5 h-5" />
                    <span>{language === 'ru' ? selectedRoom.beds : selectedRoom.bedsEn}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-lg text-foreground mb-3">
                    {language === 'ru' ? 'Удобства' : 'Amenities'}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(language === 'ru' ? selectedRoom.amenities : selectedRoom.amenitiesEn).map(
                      (amenity, i) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <Sparkle className="w-4 h-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                  <div>
                    <div className="text-3xl text-primary font-semibold">${selectedRoom.price}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ru' ? 'за ночь' : 'per night'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Find matching roomType by name
                      const matchingRoomType = hotel.roomTypes?.find(
                        (rt) => rt.label === selectedRoom.name || rt.labelEn === selectedRoom.nameEn
                      );
                      if (matchingRoomType) {
                        setSelectedRoomTypeForBooking(matchingRoomType.value);
                      }
                      nextChainStep(); // Changed to advance flow
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                  >
                    {language === 'ru' ? 'Забронировать' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback and Lost & Found */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {/* Feedback Button */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all cursor-pointer text-left flex items-center gap-3"
          >
            <MessageSquare className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl text-foreground font-medium">
                {language === 'ru' ? 'Отзывы' : 'Feedback'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Смотреть отзывы' : 'View reviews'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary/50 flex-shrink-0" />
          </button>

          {/* Lost & Found Button */}
          <button
            onClick={() => setShowLostFoundModal(true)}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all cursor-pointer text-left flex items-center gap-3"
          >
            <Search className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl text-foreground font-medium">
                {language === 'ru' ? 'Lost & Found' : 'Lost & Found'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Поиск предметов' : 'Find items'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary/50 flex-shrink-0" />
          </button>
        </div>

        {/* Limits and condions */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TriangleAlert className="w-6 h-6 text-primary" />
            <h3 className="text-xl text-foreground">
              {language === 'ru' ? 'Условия проживания' : ' Services & Amenities'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(language === 'ru'
              ? hotel.amenities.restrictions
              : hotel.amenities.restrictionsEn
            ).map((item, i) => (
              <div key={i} className="text-muted-foreground flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-foreground font-medium">
                    {language === 'ru' ? 'Отзывы' : 'Feedback'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-6">
                  {feedbacks.map((feedback, index) => (
                    <div key={feedback.id}>
                      <p className="text-sm font-medium text-foreground mb-2">{feedback.author}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === 'ru' ? feedback.text : feedback.textEn}
                      </p>
                      {index < feedbacks.length - 1 && (
                        <div className="flex items-center justify-center my-6">
                          <Sparkles className="w-5 h-5 text-primary/50" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lost & Found Modal */}
        {showLostFoundModal && (
          <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-foreground font-medium">
                    {language === 'ru' ? 'Потеряшки' : 'Lost & Found'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowLostFoundModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {lostFoundItems.map((item) => {
                    const alreadyCollected = hasArtefact(String(item.id));
                    return (
                      <div
                        key={item.id}
                        className={`rounded-lg p-4 transition-colors cursor-pointer ${
                          alreadyCollected
                            ? 'opacity-50 cursor-not-allowed bg-secondary/30'
                            : 'bg-secondary/50 hover:bg-secondary'
                        }`}
                        onClick={() =>
                          !alreadyCollected &&
                          handleCollectArtefact({
                            id: item.id,
                            name: item.name,
                            nameEn: item.nameEn,
                            image: item.image,
                          })
                        }
                      >
                        <div className="w-full aspect-[2/3] bg-secondary rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h4 className="text-sm font-medium text-foreground">
                          {language === 'ru' ? item.name : item.nameEn}
                        </h4>
                        {alreadyCollected && (
                          <p className="text-xs text-primary mt-1">
                            {language === 'ru' ? 'Уже в чемодане' : 'Already in suitcase'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artifact Found Modal */}
        {showArtifactModal && foundArtifact && (
          <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkle className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-foreground font-medium">
                    {foundArtifact.alreadyCollected
                      ? language === 'ru'
                        ? 'Артефакт уже получен'
                        : 'Artifact Already Collected'
                      : language === 'ru'
                        ? 'Артефакт найден!'
                        : 'Artifact Found!'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowArtifactModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6 flex flex-col items-center">
                <div className="w-full max-w-xs aspect-[2/3] bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={foundArtifact.image}
                    alt={foundArtifact.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {language === 'ru' ? foundArtifact.name : foundArtifact.nameEn}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {foundArtifact.alreadyCollected
                    ? language === 'ru'
                      ? 'Этот артефакт уже есть в вашем чемодане.'
                      : 'This artifact is already in your suitcase.'
                    : language === 'ru'
                      ? 'Вы нашли артефакт! Нажмите кнопку ниже, чтобы добавить его в чемодан.'
                      : 'You found an artifact! Click the button below to add it to your suitcase.'}
                </p>
                {!foundArtifact.alreadyCollected && (
                  <button
                    onClick={() => {
                      handleCollectArtefact(foundArtifact);
                      setShowArtifactModal(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                  >
                    {language === 'ru' ? 'Забрать в чемодан' : 'Add to Suitcase'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Captcha Modal (controlled by flowState) */}
        {hotel?.captcha && flowState.currentStep === 'captcha' && (
          <CaptchaModal
            open={flowState.currentStep === 'captcha'}
            onClose={() => {
              // При закрытии капчи крестиком сбрасываем выбор и возвращаемся на bookingForm
              setCaptchaSelected([]);
              setCaptchaError(false);
              updateFlowState({
                activeStep: 'bookingForm',
                currentStep: 'bookingForm',
                captchaReason: undefined,
              });
            }}
            captcha={hotel.captcha}
            selection={captchaSelected}
            setSelection={setCaptchaSelected}
            errorMessage={
              captchaError
                ? language === 'ru'
                  ? hotel.captcha.errorResponse
                  : hotel.captcha.errorResponseEn
                : undefined
            }
            title={language === 'ru' ? 'Капча' : 'Captcha'}
            confirmLabel={language === 'ru' ? 'Подтвердить' : 'Confirm'}
            mode={hotel.captcha?.correctSequence ? 'sequence' : 'toggle'}
            showSelection={true}
            captchaReason={flowState.captchaReason || 'human'}  // ← Передаём captchaReason
            onConfirm={() => {
              // Если есть correctSequence — проверяем последовательность
              if (hotel.captcha?.correctSequence) {
                const expectedSequence = hotel.captcha.correctSequence.map(String);
                const isCorrect =
                  expectedSequence.length === captchaSelected.length &&
                  expectedSequence.every((v, i) => v === captchaSelected[i]);

                if (!isCorrect) {
                  setCaptchaError(true);
                  return;
                }
                setCaptchaError(false);
                setCaptchaSelected([]);
                handleCaptchaSuccess(captchaSelected);
                return;
              }

              // Определяем тип капчи из flowState (устанавливается в useHotelFlow)
              const captchaReason = flowState.captchaReason || 'human';
              const correctAnswers =
                captchaReason === 'alien'
                  ? (hotel.captcha?.alienCorrectAnswers ?? [])
                  : (hotel.captcha?.humanCorrectAnswers ?? []);

              // Сортируем для сравнения
              const selectedSorted = [...captchaSelected].sort();
              const correctSorted = [...correctAnswers].sort();

              const isCorrect =
                selectedSorted.length === correctSorted.length &&
                selectedSorted.every((v, i) => v === correctSorted[i]);

              if (!isCorrect) {
                setCaptchaError(true);
                return;
              }
              setCaptchaError(false);
              setCaptchaSelected([]);
              handleCaptchaSuccess(captchaSelected);
            }}
          />
        )}

        {hotel?.initialBookingState?.floorOptions &&
          flowState.currentStep === 'floorSelect' &&
          showFloorSelectModal && (
            <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-lg max-w-md w-full overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-2xl text-foreground font-medium">
                    {language === 'ru' ? 'Выберите этаж' : 'Choose a floor'}
                  </h2>
                  <button
                    onClick={() => {
                      // При закрытии окна выбора этажа возвращаемся к капче
                      setShowFloorSelectModal(false);
                      setSelectedFloor(null);
                      // Возвращаемся к шагу капчи, чтобы пользователь мог снова пройти процесс
                      if (flowState.chainType === 'action' && flowState.currentChain) {
                        const captchaIndex = flowState.currentChain.indexOf('captcha');
                        if (captchaIndex !== -1) {
                          updateFlowState({
                            currentStep: 'captcha',
                            currentChainIndex: captchaIndex,
                            captchaCompleted: false,
                            floorSelected: false,
                          });
                        }
                      }
                    }}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {language === 'ru'
                      ? 'Выберите этаж, на который вы хотите забронировать комнату.'
                      : 'Select the floor you would like to book a room on.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {hotel.initialBookingState.floorOptions.map((floorOption) => (
                      <button
                        key={floorOption}
                        type="button"
                        className={`w-full rounded-lg border px-4 py-2 text-left transition ${
                          selectedFloor === floorOption
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background text-foreground'
                        }`}
                        onClick={() => setSelectedFloor(floorOption)}
                      >
                        {language === 'ru' ? 'Этаж' : 'Floor'}{' '}
                        {floorOption.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={selectedFloor === null}
                    onClick={() => {
                      if (selectedFloor !== null) {
                        handleFloorSelect(selectedFloor);
                        setShowFloorSelectModal(false);
                        setSelectedFloor(null); // Clear selection after confirming
                      }
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'ru' ? 'Подтвердить' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Concierge Chat */}
        {id && <ConciergeChat hotelId={id} />}

        {/* Main Booking Flow Modal - только для bookingForm */}
        {showBookingFlowModal && flowState.currentStep === 'bookingForm' && (
          <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-foreground font-medium">
                    {language === 'ru' ? 'Бронирование номера' : 'Room Booking'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedRoomTypeForBooking(null);
                    setShowBookingFlowModal(false);
                    updateFlowState({
                      currentStep: 'hotelPage',
                      completedSteps: [],
                      currentChainIndex: 0,
                      chainType: 'standard',
                    });
                  }}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                <BookingFormPage
                  onNextStep={onNextStep}
                  onFinalizeBooking={onFinalizeBooking}
                  flowState={flowState}
                  selectedRoomType={selectedRoomTypeForBooking}
                />
              </div>
            </div>
          </div>
        )}

        {/* Booking Complete Modal - rendered separately */}
        {flowState.currentStep === 'bookingComplete' && (
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
                  {t.bookingConfirmed}
                </h3>
                {/* Используем bookingMessage из flowState */}
                <p className="text-muted-foreground">
                  {flowState.bookingMessage === 'alien'
                    ? t.bookingConfirmedAlien
                    : t.bookingConfirmedHuman}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog - rendered separately, not inside the main modal */}
        {flowState.currentStep === 'bookingConfirm' && tempBookingForm && (
          <Dialog
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                // User closed the confirmation dialog. Go back to the booking form.
                updateFlowState({
                  currentStep: 'bookingForm',
                  currentChainIndex: 1, // Index of 'bookingForm'
                  completedSteps: ['hotelPage', 'bookingForm'],
                });
              }
            }}
          >
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
                        ? selectedBookingRoomType?.label
                        : selectedBookingRoomType?.labelEn}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.roomNumberLabel}:</span>
                    <span>#{roomNumber}</span>
                  </div>
                  {hotel?.initialBookingState?.floorOptions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.floorLabel}:</span>
                      <span>{floor}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.checkIn}:</span>
                    <span>
                      {tempBookingForm.checkInDate &&
                        format(new Date(tempBookingForm.checkInDate), 'PP', {
                          locale: language === 'ru' ? ru : enUS,
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.checkOut}:</span>
                    <span>
                      {tempBookingForm.checkOutDate &&
                        format(new Date(tempBookingForm.checkOutDate), 'PP', {
                          locale: language === 'ru' ? ru : enUS,
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.mealType}:</span>
                    <span>
                      {language === 'ru'
                        ? selectedBookingMealType?.label
                        : selectedBookingMealType?.labelEn}
                    </span>
                  </div>
                  {additionalBookingServices && additionalBookingServices.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {t.additionalServices}:
                      </span>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {additionalBookingServices.map(
                          (service: (typeof additionalBookingServices)[number]) => (
                            <li key={service.id}>
                              {language === 'ru' ? service.name : service.nameEn}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span>{t.totalCost}:</span>
                    <span className="text-primary">
                      ₽{calculateTotalDisplay.toLocaleString()}
                    </span>
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
                  onClick={() => {
                    // Возвращаемся к предыдущему шагу (форме бронирования)
                    updateFlowState({
                      currentStep: 'bookingForm',
                      currentChainIndex: 1, // Index of 'bookingForm'
                      completedSteps: ['hotelPage', 'bookingForm'],
                    });
                  }}
                  className="flex-1 border-border"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={() => onFinalizeBooking(false)}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
                >
                  {t.confirm}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </TooltipProvider>
  );
}
