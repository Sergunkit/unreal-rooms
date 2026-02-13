/* eslint-disable prettier/prettier */
import { useState } from 'react';
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
  // TV,
  // BriefcaseMedical,
  // Snowflake,
  // ConciergeBell,
} from 'lucide-react';
// { , , , , , Wind, Coffee, , Baby, , , , , , , , ,  }
import { useLanguage } from '../contexts/LanguageContext';
import { hotelData } from '../data/hotels';
import useEmblaCarousel from 'embla-carousel-react';
import { ConciergeChat } from '../components/ConciergeChat';

interface Room {
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

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);

  const hotel = hotelData[id as keyof typeof hotelData];

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

  // Mock lost & found items
  // 
  const lostFoundItems = hotel.lostandfaund;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{language === 'ru' ? 'Назад к списку' : 'Back to list'}</span>
      </button>

      <div className="flex gap-8 mb-8">
        {/* Left side: Gallery */}
        <div className="w-[50%]">
          {/* Gallery */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
              <div className="flex">
                {hotel.images.map((image, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <img
                      src={image}
                      alt={`${hotel.name} ${index + 1}`}
                      className="w-full h-[750px] object-cover"
                    />
                  </div>
                ))}
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
        </div>

        {/* Right side: Header */}
        <div className="w-[50%]">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl text-foreground">
                  {language === 'ru' ? hotel.name : hotel.nameEn}
                </h1>
                <div className="flex items-center gap-1">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5  text-primary" />
                  ))}
                </div>
              </div>
              <div className="flex items-right gap-2 ml-auto">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition-all"
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-primary-foreground hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Slogan */}
            <div  className="flex items-center gap-8 flex-wrap mb-6">
              <div className="flex items-center gap-2 italic text-xl text-muted-foreground">
                {/* <ConciergeBell className="w-5 h-5 text-primary" /> */}
                <span>{language === 'ru' ? hotel.slogan : hotel.sloganEn}</span>
              </div>
            </div>

            <div className="mt-15">
              <button
                onClick={() => navigate(`/hotel/${id}/book`)}
                className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                {language === 'ru' ? 'Забронировать номер' : 'Book a room'}
              </button>

              {/* Description */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8 mt-15">
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
                <div  className="flex items-center gap-8 flex-wrap mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5  text-primary" />
                    <span>{language === 'ru' ? hotel.location : hotel.locationEn}</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
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
            <h3 className="text-xl text-foreground">{language === 'ru' ? 'Питание' : 'Dining'}</h3>
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
            {language === 'ru' ? 'Дополнительные услуги и удобства' : 'Additional Services & Amenities'}
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
          <div className="bg-card border border-border rounded-lg w-full h-full max-w-6xl max-h-[90vh] overflow-hidden flex relative">
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
                  onClick={() => navigate(`/hotel/${id}/book`)}
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
              {language === 'ru' ? 'Потеряшки' : 'Lost & Found'}
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
          {(language === 'ru' ? hotel.amenities.restrictions : hotel.amenities.restrictionsEn).map(
            (item, i) => (
              <div key={i} className="text-muted-foreground flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </div>
            )
          )}
        </div>
      </div>


      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
                    <p className="text-sm text-muted-foreground leading-relaxed">{feedback.text}</p>
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
                {lostFoundItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-secondary/50 rounded-lg p-4 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-3 rounded-lg" />
                    <h4 className="text-sm font-medium text-foreground">
                      {language === 'ru' ? item.name : item.nameEn}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

       
      {/* Concierge Chat */}
      {id && <ConciergeChat hotelId={id} />}
    </main>
  );
}
