import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGame } from '../contexts/GameContext';
import { useCatalog } from '../contexts/CatalogContext';
import { HotelCollectionCard } from '../components/HotelCollectionCard';

export function BookingsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { playerStatus, isLoading } = useGame();
  const catalog = useCatalog();
  const bookedHotels =
    catalog.status === 'loaded'
      ? playerStatus.visitedHotels
          .filter((visitedHotel) => visitedHotel.completed)
          .map((visitedHotel) => catalog.hotels[visitedHotel.hotelId])
          .filter((hotel) => hotel !== undefined)
      : [];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ru' ? 'Назад' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-3xl text-foreground">
            {language === 'ru' ? 'Мои бронирования' : 'My Bookings'}
          </h1>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-muted-foreground">
            {language === 'ru' ? 'Загрузка…' : 'Loading…'}
          </p>
        ) : bookedHotels.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bookedHotels.map((hotel) => (
              <HotelCollectionCard
                key={hotel.id}
                hotel={hotel}
                language={language}
                isFavorite={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-6xl">📋</div>
            <h3 className="mb-2 text-xl text-foreground">
              {language === 'ru' ? 'У вас нет бронирований' : 'You have no bookings'}
            </h3>
            <p className="max-w-md text-center text-muted-foreground">
              {language === 'ru'
                ? 'Забронируйте свой первый отель и начните незабываемое путешествие'
                : 'Book your first hotel and start an unforgettable journey'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
