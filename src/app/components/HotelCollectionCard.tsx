import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Hotel } from '../data/hotels-data/hotelTypes';

interface HotelCollectionCardProps {
  hotel: Hotel;
  language: 'ru' | 'en';
  isFavorite: boolean;
}

export function HotelCollectionCard({ hotel, language, isFavorite }: HotelCollectionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
      className="group relative overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hotel.image}
          alt={language === 'ru' ? hotel.name : hotel.nameEn}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-sm">
          <Heart
            aria-label={
              isFavorite
                ? language === 'ru'
                  ? 'Любимый отель'
                  : 'Favorite hotel'
                : language === 'ru'
                  ? 'Не в избранном'
                  : 'Not a favorite'
            }
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/50'}`}
          />
        </span>
      </div>
      <span className="block p-3 font-medium text-foreground transition-colors group-hover:text-primary">
        {language === 'ru' ? hotel.name : hotel.nameEn}
      </span>
    </button>
  );
}
