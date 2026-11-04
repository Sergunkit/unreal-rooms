import { Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGame } from '../contexts/GameContext';
import { useCatalog } from '../contexts/CatalogContext';
import { HotelCollectionCard } from '../components/HotelCollectionCard';

export function FavoritesPage() {
  const { language } = useLanguage();
  const { playerStatus, isLoading } = useGame();
  const catalog = useCatalog();
  const favoriteHotels =
    catalog.status === 'loaded'
      ? playerStatus.favoriteHotelIds
          .map((hotelId) => catalog.hotels[hotelId])
          .filter((hotel) => hotel !== undefined)
      : [];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl text-foreground">
            {language === 'ru' ? 'Любимые отели' : 'Favorite Hotels'}
          </h1>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-muted-foreground">
            {language === 'ru' ? 'Загрузка…' : 'Loading…'}
          </p>
        ) : favoriteHotels.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favoriteHotels.map((hotel) => (
              <HotelCollectionCard key={hotel.id} hotel={hotel} language={language} isFavorite />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-6xl">❤️</div>
            <h3 className="mb-2 text-xl text-foreground">
              {language === 'ru' ? 'Здесь пока пусто' : 'Nothing here yet'}
            </h3>
            <p className="max-w-md text-center text-muted-foreground">
              {language === 'ru'
                ? 'Начните добавлять отели в избранное, чтобы быстро находить их в будущем'
                : 'Start adding hotels to favorites to quickly find them in the future'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
