import { Star, Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface HotelCardProps {
  id: number;
  name: string;
  nameEn: string;
  stars: number;
  rating: number;
  price: number;
  description: string;
  descriptionEn: string;
  image: string;
  language: 'ru' | 'en';
}

export function HotelCard({ 
  id,
  name, 
  nameEn,
  stars, 
  rating, 
  price, 
  description,
  descriptionEn, 
  image,
  language 
}: HotelCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full cursor-pointer"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={language === 'ru' ? name : nameEn} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-white">${price}/{language === 'ru' ? 'ночь' : 'night'}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-white hover:text-red-500'
            }`} 
          />
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="flex-1 text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
            {language === 'ru' ? name : nameEn}
          </h3>
          <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg h-fit">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm text-primary">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`w-4 h-4 ${
                i < stars 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            ({stars} {language === 'ru' ? 'звезд' : 'stars'})
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {language === 'ru' ? description : descriptionEn}
        </p>
        
        <button 
          className="w-full mt-6 bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/hotel/${id}`);
          }}
        >
          {language === 'ru' ? 'Посмотреть детали' : 'View Details'}
        </button>
      </div>
    </div>
  );
}