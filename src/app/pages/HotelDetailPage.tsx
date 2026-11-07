/* eslint-disable prettier/prettier */
import React, { useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Star,
  MapPin,
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
  Sparkle,
  MessageSquare,
  Search,
  TriangleAlert,
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { BookingFormPage } from './BookingFormPage';
import useEmblaCarousel from 'embla-carousel-react';
import { ConciergeChat } from '../components/ConciergeChat';
import { CaptchaModal } from '../components/modals/CaptchaModal';
import { useHotelProgress } from '../hooks/useHotelProgress';
import { useHotelFlow } from '../hooks/useHotelFlow';
import { useGame } from '../contexts/GameContext';
import { useCatalog } from '../contexts/CatalogContext';
import type { Artefact, LegacyChainStep, Room } from '../data/hotels-data/hotelTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { ArtifactModal } from '../components/artifacts/ArtifactModal';
import { LostAndFoundModal } from '../components/artifacts/LostAndFoundModal';
import { MarkdownText } from '../components/MarkdownText';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { FeedbackModal } from '../components/modals/FeedbackModal';
import { FloorSelectModal } from '../components/modals/FloorSelectModal';
import { BookingFlowModal } from '../components/modals/BookingFlowModal';
import { BookingCompleteModal } from '../components/modals/BookingCompleteModal';
import { ConfirmationDialog } from '../components/modals/ConfirmationDialog';
import { RoomDetailModal } from '../components/modals/RoomDetailModal';
import { getRouteForStep } from '../utils/getRouteForStep';
import { shouldResetHotelProgress } from '../utils/shouldResetHotelProgress';

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const catalog = useCatalog();
  const artefacts: Record<string, Artefact> = useMemo(
    () => (catalog.status === 'loaded' ? catalog.artefacts : {}),
    [catalog]
  );

  const {
    playerStatus,
    hasInInventory,
    addToInventory,
    addToLostAndFound,
    clearCurrentHotelProgress,
    setCurrentHotelProgress,
    addFavoriteHotel,
    isLoading,
  } = useGame();
  const {
    chain,
    currentChain,
    activeStep,
    chainType,
    currentChainIndex,
    completedSteps,
    galleryStates,
    triggeredActions,
    captchaCompleted,
    floorSelected,
    handleGalleryClick,
    handleCaptchaSuccess,
    handleCaptchaFailure,
    handleCaptchaClose,
    handleFloorSelect,
    getGalleryActions,
    nextChainStep,
    updateFlowState,
    handleChainAction,
    canBook,
  } = useHotelFlow(id);
  const { hotel, floor, tempBookingForm, roomNumber, roomType } = useHotelProgress(id);
  const isHotelCompleted = playerStatus.visitedHotels.some(
    (visitedHotel) => visitedHotel.hotelId === id && visitedHotel.completed
  );
  const isFavorite = !isHotelCompleted && playerStatus.favoriteHotelIds.includes(id ?? '');

  React.useEffect(() => {
    if (!isLoading && id && hotel && !isHotelCompleted) {
      addFavoriteHotel(id);
    }
  }, [isLoading, id, hotel, isHotelCompleted, addFavoriteHotel]);

  // Устанавливаем hotelId при загрузке страницы отеля
  React.useEffect(() => {
    const shouldReset = shouldResetHotelProgress({
      currentStep: playerStatus.currentHotelProgress?.activeStep,
      hotelId: id,
      progressHotelId: playerStatus.currentHotelProgress?.hotelId,
      isHotelRoute: !!id,
    });

    if (shouldReset) {
      setCurrentHotelProgress({
        hotelId: id,
        tempBookingForm: null,
        startedAt: new Date().toISOString(),
        currentChain: [],
        activeStep: 'hotelPage',
        currentChainIndex: 0,
        chainType: 'standard',
        galleryStates: {},
        triggeredActions: {},
        captchaCompleted: false,
        floorSelected: false,
        completedSteps: [],
        lostAndFoundItems: [],
      });
    }
  }, [id, playerStatus.currentHotelProgress?.activeStep, playerStatus.currentHotelProgress?.hotelId, setCurrentHotelProgress]);

  // Создаём flowState для обратной совместимости с существующим кодом
  const flowState = useMemo(
    () => ({
      currentStep: activeStep,
      completedSteps,
      galleryStates,
      triggeredActions,
      captchaCompleted,
      floorSelected,
      currentChain,
      currentChainIndex,
      chainType,
      captchaReason: playerStatus.currentHotelProgress?.captchaReason,
      bookingMessage: playerStatus.currentHotelProgress?.bookingMessage,
    }),
    [
      activeStep,
      completedSteps,
      galleryStates,
      triggeredActions,
      captchaCompleted,
      floorSelected,
      currentChain,
      currentChainIndex,
      chainType,
      playerStatus.currentHotelProgress?.captchaReason,
      playerStatus.currentHotelProgress?.bookingMessage,
    ]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [showBookingFlowModal, setShowBookingFlowModal] = useState(false); // Controls the main booking flow modal
  const [selectedRoomTypeForBooking, setSelectedRoomTypeForBooking] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showGalleryMessage, setShowGalleryMessage] = useState<{ show: boolean; text: string }>({
    show: false,
    text: '',
  });
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [foundArtifactId, setFoundArtifactId] = useState<string | null>(null);
  const [lostFoundArtifactId, setLostFoundArtifactId] = useState<string | null>(null);
  const [isPrizeAlreadyCollected, setIsPrizeAlreadyCollected] = useState(false);

  // States for CaptchaModal, moved from BookingFormPage
  const [captchaSelected, setCaptchaSelected] = useState<string[]>([]);
  const [captchaError, setCaptchaError] = useState(false);

  const [showFloorSelectModal, setShowFloorSelectModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [blockedAlert, setBlockedAlert] = useState<{
    message: string;
    messageEn: string;
    title?: string;
    titleEn?: string;
  } | null>(null);

  React.useEffect(() => {
    const modal = playerStatus.currentHotelProgress?.activeModal;
    if (modal) {
      setBlockedAlert({
        message: modal.message,
        messageEn: modal.messageEn,
        title: modal.title,
        titleEn: modal.titleEn,
      });
    } else {
      setBlockedAlert(null);
    }
  }, [playerStatus.currentHotelProgress?.activeModal]);

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

  // Close room modal when leaving roomCard step
  React.useEffect(() => {
    if (flowState.currentStep !== 'roomCard') {
      setSelectedRoom(null);
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

  React.useEffect(() => {
    const route = getRouteForStep(flowState.currentStep);

    if (route) {
      if (flowState.currentStep === 'myBookingsPage' || flowState.currentStep === 'homePage') {
        clearCurrentHotelProgress();
      }

      navigate(route, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowState.currentStep, navigate]);

  // Effect to handle awarding the prize when the 'prizeModal' step is reached
  useEffect(() => {
    if (activeStep === 'prizeModal') {
      const isSafeBooking = playerStatus.currentHotelProgress?.bookingResult === 'safe';

      if (isSafeBooking && hotel?.prize) {
        const prizeArtefact = artefacts[hotel.prize];
        if (prizeArtefact) {
          const alreadyCollected = hasInInventory(prizeArtefact.id);
          setIsPrizeAlreadyCollected(alreadyCollected);

          if (!alreadyCollected) {
            addToInventory(hotel.prize);
            window.dispatchEvent(new Event('prizeCollected'));
          }

          setFoundArtifactId(hotel.prize);
          setShowArtifactModal(true);
        } else {
          nextChainStep();
        }
      } else {
        nextChainStep();
      }
    }
  }, [
    activeStep,
    hotel,
    playerStatus.currentHotelProgress?.bookingResult,
    hasInInventory,
    addToInventory,
    artefacts,
    nextChainStep,
  ]);

  const galleryStatesKey = useMemo(() => JSON.stringify(galleryStates), [galleryStates]);

  // Re-init embla after gallery image src changes so loop clones pick up new images
  useLayoutEffect(() => {
    if (emblaApi && Object.keys(galleryStates).length > 0) {
      const idx = emblaApi.selectedScrollSnap();
      emblaApi.reInit();
      emblaApi.scrollTo(idx, false);
    }
  }, [emblaApi, galleryStates, galleryStatesKey]);

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

  const onFinalizeBooking = useCallback(() => {
    // This triggers the 'confirm' transition from the 'bookingConfirm' step.
    // The chain will handle the effects (consuming coin) and moving to the next step.
    nextChainStep();
  }, [nextChainStep]);

  // Moved useMemo hooks outside of conditional return
  const selectedBookingRoomType = useMemo(() => {
    return hotel?.rooms?.find((r) => r.value === tempBookingForm?.roomType);
  }, [hotel?.rooms, tempBookingForm?.roomType]);

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

  const handleCollectArtefact = (item: {
    id: number | string;
    name: string;
    nameEn: string;
    image: string;
  }) => {
    if (!hasInInventory(String(item.id))) {
      addToInventory(String(item.id));
      window.dispatchEvent(new Event('artefactCollected'));
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
                    const galleryActions = getGalleryActions(index);
                    const toggleAction = galleryActions.find(
                      (a) => a.galleryData?.type === 'toggle'
                    );
                    const hintAction = galleryActions.find((a) => a.galleryData?.type === 'hint');
                    const artifactAction = galleryActions.find(
                      (a) => a.galleryData?.type === 'artifact-find'
                    );
                    const captchaAction = galleryActions.find(
                      (a) => a.galleryData?.type === 'capcha-get'
                    );

                    const isHeadImageToggled =
                      toggleAction && (flowState.galleryStates[index] ?? false);
                    const isFigurinesToggled =
                      hintAction && (flowState.galleryStates[index] ?? false);
                    const isArtifactToggled =
                      artifactAction && (flowState.galleryStates[index] ?? false);

                    const handleGalleryImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;

                      const triggeredAction = handleGalleryClick(index, { x, y });
                      if (!triggeredAction) return;

                      // Handle hint type
                      if (triggeredAction.galleryData?.type === 'hint') {
                        setShowGalleryMessage({
                          show: true,
                          text:
                            language === 'ru'
                              ? (triggeredAction.galleryData?.message ?? '')
                              : (triggeredAction.galleryData?.messageEn ?? ''),
                        });
                        setTimeout(() => setShowGalleryMessage({ show: false, text: '' }), 3000);
                      }

                      // Handle artifact-find type
                      if (
                        triggeredAction.galleryData?.type === 'artifact-find' &&
                        triggeredAction.galleryData?.artefact
                      ) {
                        const artefactData = artefacts[triggeredAction.galleryData.artefact];
                        if (artefactData) {
                          // Check if this artifact is in the hotel's lost & found
                          const isLostAndFound = hotel.lostandfaund?.includes(artefactData.id);

                          if (isLostAndFound) {
                            setLostFoundArtifactId(artefactData.id);
                          } else {
                            setFoundArtifactId(artefactData.id);
                            const alreadyInInventory = hasInInventory(artefactData.id);
                            setIsPrizeAlreadyCollected(alreadyInInventory);
                          }
                          setShowArtifactModal(true);
                        }
                      }

                      // Handle capcha-get type
                      if (triggeredAction.galleryData?.type === 'capcha-get') {
                        setShowGalleryMessage({
                          show: true,
                          text:
                            language === 'ru'
                              ? (triggeredAction.galleryData?.message ?? '')
                              : (triggeredAction.galleryData?.messageEn ?? ''),
                        });
                        setTimeout(() => setShowGalleryMessage({ show: false, text: '' }), 3000);
                      }
                    };

                    const hasInteractiveActions = hintAction || artifactAction || captchaAction;

                    return (
                      <div key={index} className="flex-[0_0_100%] min-w-0">
                        {toggleAction ? (
                          <img
                            src={
                              isHeadImageToggled ? toggleAction.galleryData?.alternateImage : image
                            }
                            alt={`${hotel.name} ${index + 1}`}
                            className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[750px] object-cover cursor-pointer"
                            onClick={() => handleGalleryClick(index)}
                          />
                        ) : hasInteractiveActions ? (
                          <div className="relative" onClick={handleGalleryImageClick}>
                            <img
                              src={
                                isFigurinesToggled && hintAction?.galleryData?.alternateImage
                                  ? hintAction.galleryData.alternateImage
                                  : isArtifactToggled && artifactAction?.galleryData?.alternateImage
                                    ? artifactAction.galleryData.alternateImage
                                    : image
                              }
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
                        <button
                          type="button"
                          aria-label={language === 'ru' ? 'Добавить в любимые отели' : 'Add to favorites'}
                          aria-pressed={isFavorite}
                          disabled={isLoading || isHotelCompleted || isFavorite}
                          onClick={() => id && addFavoriteHotel(id)}
                          className="p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition-all disabled:cursor-default"
                        >
                          <Heart
                            className={`w-6 h-6 transition-all cursor-pointer ${
                              isFavorite ? 'fill-red-500 text-red-500' : 'text-primary-foreground/60'
                            } ${canBook ? 'opacity-0' : 'opacity-100'}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={5}>
                        <p className="text-sm">
                          <MarkdownText
                            text={
                              language === 'ru'
                                ? (hotel.amenities.heart_tool_tip ?? '')
                                : (hotel.amenities.heart_tool_tipEn ?? '')
                            }
                          />
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      type="button"
                      aria-label={language === 'ru' ? 'Добавить в любимые отели' : 'Add to favorites'}
                      aria-pressed={isFavorite}
                      disabled={isLoading || isHotelCompleted || isFavorite}
                      onClick={() => id && addFavoriteHotel(id)}
                      className="p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition-all disabled:cursor-default"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${
                          isFavorite ? 'fill-red-500 text-red-500' : 'text-primary-foreground/60'
                        } ${canBook ? 'opacity-0' : 'opacity-100'}`}
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
                if (!chain) return;
                const action = chain.steps.hotelPage?.actions?.find((a) => a.id === 'book-now-btn');
                if (action) {
                  const result = handleChainAction(action);
                  if (result?.blocked) {
                    setBlockedAlert({
                      message: result.message ?? '',
                      messageEn: result.messageEn ?? '',
                    });
                  }
                }
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
                    <span className="text-primary">•</span>
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
                    <span className="text-primary">•</span>
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
                    <span className="text-primary">•</span>
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
                    <span className="text-primary">•</span>
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
                  <MarkdownText text={item} />
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
            {hotel.rooms.map((room) => {
              return (
                <div
                  key={room.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => {
                    if (chain) {
                      const action = chain.steps.hotelPage?.actions?.find(
                        (a) => a.id === 'room-card-open'
                      );
                      if (action) {
                        setSelectedRoom(room);
                        handleChainAction(action);
                      } else {
                        setSelectedRoom(room);
                      }
                    } else {
                      setSelectedRoom(room);
                    }
                  }}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-[19.2rem] object-cover"
                  />
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
              );
            })}
          </div>
        </div>

        <RoomDetailModal
          room={selectedRoom}
          isOpen={(selectedRoom || flowState.currentStep === 'roomCard') && !!selectedRoom}
          language={language}
          onClose={() => {
            setSelectedRoom(null);
            if (flowState.currentStep === 'roomCard') {
              updateFlowState({ currentStep: 'hotelPage' });
            }
          }}
          onBook={(room) => {
            if (!chain) return;
            const currentStepId = flowState.currentStep === 'roomCard' ? 'roomCard' : 'hotelPage';
            const action = chain.steps[currentStepId]?.actions?.find(
              (a) => a.type === 'roomSelect' || a.id === 'room-card-book'
            );
            const matchingRoomType = hotel.rooms?.find(
              (r) => r.name === room?.name || r.nameEn === room?.nameEn
            );
            if (matchingRoomType?.value && playerStatus.currentHotelProgress) {
              const existingForm = playerStatus.currentHotelProgress.tempBookingForm;
              const updatedTempBookingForm = {
                guests: existingForm?.guests ?? 1,
                rooms: existingForm?.rooms ?? 1,
                roomType: matchingRoomType.value,
                checkInDate: existingForm?.checkInDate ?? null,
                checkOutDate: existingForm?.checkOutDate ?? null,
                mealType: existingForm?.mealType ?? '',
                needTransfer: existingForm?.needTransfer ?? false,
                checkInTime: existingForm?.checkInTime ?? '14:00',
                selectedServices: existingForm?.selectedServices ?? [],
                promoCode: existingForm?.promoCode,
                paymentMethod: existingForm?.paymentMethod,
              };
              setCurrentHotelProgress({
                ...playerStatus.currentHotelProgress,
                tempBookingForm: updatedTempBookingForm,
              });
            }
            if (action) {
              const result = handleChainAction(action);
              if (result?.blocked) {
                setBlockedAlert({
                  message: result.message ?? '',
                  messageEn: result.messageEn ?? '',
                });
                return;
              }
            }
            setSelectedRoom(null);
          }}
        />

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
                <MarkdownText text={item} />
              </div>
            ))}
          </div>
        </div>

        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedbacks={feedbacks}
          language={language}
        />

        {/* Lost & Found Modal */}
        {showLostFoundModal && (
          <LostAndFoundModal
            isOpen={showLostFoundModal}
            onClose={() => setShowLostFoundModal(false)}
            hotelId={id!}
            staticLostAndFound={hotel.lostandfaund || []}
          />
        )}

        {/* Artifact Found Modal */}
        {showArtifactModal && foundArtifactId && !lostFoundArtifactId && (
          <ArtifactModal
            isOpen={showArtifactModal}
            onClose={() => {
              setShowArtifactModal(false);
              // After closing the prize modal, move to the next step
              nextChainStep();
            }}
            artifactId={foundArtifactId}
            hotelId={id}
            mode="collect"
            isCollected={isPrizeAlreadyCollected}
            onAction={() => {
              // Add artifact to inventory if not already there
              if (foundArtifactId && !hasInInventory(foundArtifactId)) {
                const artefact = artefacts[foundArtifactId];
                if (artefact) {
                  handleCollectArtefact({
                    id: artefact.id,
                    name: artefact.name,
                    nameEn: artefact.nameEn,
                    image: artefact.image,
                  });
                }
              }
              setShowArtifactModal(false);
              // onNextStep is called in onClose to ensure the flow continues
            }}
          />
        )}

        {/* Artifact Modal for Lost & Found items */}
        {showArtifactModal && lostFoundArtifactId && (
          <ArtifactModal
            isOpen={showArtifactModal}
            onClose={() => {
              setShowArtifactModal(false);
              setLostFoundArtifactId(null);
            }}
            artifactId={lostFoundArtifactId}
            hotelId={id}
            mode="collect"
            onAction={() => {
              const artefact = artefacts[lostFoundArtifactId];
              if (artefact) {
                // Add to lost & found collection instead of inventory
                addToLostAndFound(artefact.id);
                // Also add to collected artifacts for display
                handleCollectArtefact({
                  id: artefact.id,
                  name: artefact.name,
                  nameEn: artefact.nameEn,
                  image: artefact.image,
                });
              }
              setShowArtifactModal(false);
              setLostFoundArtifactId(null);
            }}
          />
        )}

        {/* Captcha Modal (controlled by flowState) */}
        {hotel?.captcha && flowState.currentStep === 'captcha' && (
          <CaptchaModal
            open={flowState.currentStep === 'captcha'}
            onClose={() => {
              setCaptchaSelected([]);
              setCaptchaError(false);
              const nextStep = handleCaptchaClose();
              if (nextStep) {
                const route = getRouteForStep(nextStep);
                if (route) {
                  navigate(route, { replace: true });
                }
                updateFlowState({
                  activeStep: nextStep,
                  currentStep: nextStep as LegacyChainStep,
                  captchaReason: undefined,
                });
              }
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
            confirmLabel={language === 'ru' ? 'Подтвердить' : 'Confirm'}
            mode={hotel.captcha?.correctSequence ? 'sequence' : 'toggle'}
            showSelection={true}
            captchaReason={flowState.captchaReason || 'human'} // ← Передаём captchaReason
            onConfirm={() => {
              // Если есть correctSequence — проверяем последовательность
              if (hotel.captcha?.correctSequence) {
                const expectedSequence = hotel.captcha.correctSequence.map(String);
                const isCorrect =
                  expectedSequence.length === captchaSelected.length &&
                  expectedSequence.every((v, i) => v === captchaSelected[i]);

                if (!isCorrect) {
                  setCaptchaError(true);
                  setCaptchaSelected([]);
                  const nextStep = handleCaptchaFailure();
                  const route = getRouteForStep(nextStep);
                  if (route) {
                    window.setTimeout(() => {
                      navigate(route, { replace: true });
                    }, 1000);
                  }
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
                setCaptchaSelected([]);
                const nextStep = handleCaptchaFailure();
                const route = getRouteForStep(nextStep);
                if (route) {
                  window.setTimeout(() => {
                    navigate(route, { replace: true });
                  }, 1000);
                }
                return;
              }
              setCaptchaError(false);
              setCaptchaSelected([]);
              handleCaptchaSuccess(captchaSelected);
            }}
          />
        )}

        <FloorSelectModal
          isOpen={
            !!hotel?.bookingStates?.default?.floorOptions &&
            flowState.currentStep === 'floorSelect' &&
            showFloorSelectModal
          }
          floorOptions={hotel?.bookingStates?.default?.floorOptions ?? []}
          language={language}
          selectedFloor={selectedFloor}
          onSelectFloor={setSelectedFloor}
          onConfirm={() => {
            if (selectedFloor !== null) {
              handleFloorSelect(selectedFloor);
              setShowFloorSelectModal(false);
              setSelectedFloor(null);
            }
          }}
          onClose={() => {
            setShowFloorSelectModal(false);
            setSelectedFloor(null);
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
        />

        {/* Concierge Chat */}
        {id && <ConciergeChat hotelId={id} />}

        <BookingFlowModal
          isOpen={showBookingFlowModal && flowState.currentStep === 'bookingForm'}
          language={language}
          onClose={() => {
            setSelectedRoomTypeForBooking(null);
            setShowBookingFlowModal(false);
            updateFlowState({
              currentStep: 'hotelPage',
              completedSteps: [],
              currentChainIndex: 0,
              chainType: 'standard',
            });
          }}
        >
          <BookingFormPage
            onNextStep={onNextStep}
            onFinalizeBooking={onFinalizeBooking}
            flowState={flowState}
            selectedRoomType={selectedRoomTypeForBooking}
          />
        </BookingFlowModal>

        <BookingCompleteModal
          isOpen={flowState.currentStep === 'bookingComplete'}
          bookingResult={playerStatus.currentHotelProgress?.bookingResult}
          bookingConfirmed={t.bookingConfirmed}
          endBookingMessage={hotel.endBookingMassege ?? ''}
          endBookingMessageEn={hotel.endBookingMassegeEn ?? ''}
          endWrongBookingMessage={hotel.endWrongBookingMassege ?? ''}
          endWrongBookingMessageEn={hotel.endWrongBookingMassegeEn ?? ''}
          language={language}
        />

        <ConfirmationDialog
          isOpen={flowState.currentStep === 'bookingConfirm' && !!tempBookingForm}
          onOpenChange={(open) => {
            if (!open) {
              updateFlowState({
                currentStep: 'bookingForm',
                currentChainIndex: 1,
                completedSteps: ['hotelPage', 'bookingForm'],
              });
            }
          }}
          t={t}
          roomType={roomType}
          roomNumber={roomNumber}
          showFloor={!!hotel?.bookingStates?.default?.floorOptions}
          floor={floor}
          language={language}
          tempBookingForm={tempBookingForm!}
          selectedBookingMealType={selectedBookingMealType}
          additionalBookingServices={additionalBookingServices}
          calculateTotalDisplay={calculateTotalDisplay}
          onConfirm={onFinalizeBooking}
          onCancel={() => {
            updateFlowState({
              currentStep: 'bookingForm',
              currentChainIndex: 1,
              completedSteps: ['hotelPage', 'bookingForm'],
            });
          }}
        />

        <AlertDialog
          open={blockedAlert !== null}
          onOpenChange={(open) => {
            if (!open) {
              setBlockedAlert(null);
              if (playerStatus.currentHotelProgress) {
                const modal = playerStatus.currentHotelProgress.activeModal;
                setCurrentHotelProgress({
                  ...playerStatus.currentHotelProgress,
                  activeStep: modal?.nextStep ?? playerStatus.currentHotelProgress.activeStep,
                  activeModal: null,
                });
              }
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {blockedAlert?.title
                  ? (language === 'ru' ? blockedAlert.title : blockedAlert.titleEn ?? blockedAlert.title)
                  : (language === 'ru' ? 'Действие заблокировано' : 'Action blocked')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'ru' ? blockedAlert?.message : blockedAlert?.messageEn}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogAction
              onClick={() => {
                setBlockedAlert(null);
                if (playerStatus.currentHotelProgress) {
                  const modal = playerStatus.currentHotelProgress.activeModal;
                  setCurrentHotelProgress({
                    ...playerStatus.currentHotelProgress,
                    activeStep: modal?.nextStep ?? playerStatus.currentHotelProgress.activeStep,
                    activeModal: null,
                  });
                }
              }}
            >
              {language === 'ru' ? 'OK' : 'OK'}
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </TooltipProvider>
  );
}
