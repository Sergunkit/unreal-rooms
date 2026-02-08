import { useState, useMemo } from 'react';
import { SearchBar } from '@/app/components/SearchBar';
import { FilterPanel } from '@/app/components/FilterPanel';
import { HotelCard } from '@/app/components/HotelCard';
import { hotelData } from '../data/hotels';
import { useLanguage } from '../contexts/LanguageContext';

interface Hotel {
  id: number;
  name: string;
  nameEn: string;
  stars: number;
  rating: number;
  price: number;
  description: string;
  descriptionEn: string;
  image: string;
}

// Convert hotelData object to array
const mockHotels: Hotel[] = Object.values(hotelData).map((hotel) => ({
  id: hotel.id,
  name: hotel.name,
  nameEn: hotel.nameEn,
  stars: hotel.stars,
  rating: hotel.rating,
  price: hotel.price,
  description: hotel.description,
  descriptionEn: hotel.descriptionEn,
  image: hotel.image,
}));

export function HomePage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [minRating, setMinRating] = useState(0);

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = mockHotels.filter((hotel) => {
      const nameMatch =
        language === 'ru'
          ? hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
          : hotel.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

      const priceMatch = hotel.price >= minPrice && hotel.price <= maxPrice;
      const starsMatch = selectedStars.length === 0 || selectedStars.includes(hotel.stars);
      const ratingMatch = hotel.rating >= minRating;

      return nameMatch && priceMatch && starsMatch && ratingMatch;
    });

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return language === 'ru'
              ? a.name.localeCompare(b.name, 'ru')
              : a.nameEn.localeCompare(b.nameEn);
          case 'rating':
            return b.rating - a.rating;
          case 'stars':
            return b.stars - a.stars;
          case 'price':
            return a.price - b.price;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [searchQuery, sortBy, minPrice, maxPrice, selectedStars, minRating, language]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar
          language={language}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <FilterPanel
            language={language}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            selectedStars={selectedStars}
            onStarsChange={setSelectedStars}
            minRating={minRating}
            onRatingChange={setMinRating}
          />
        </aside>

        <div className="lg:col-span-3">
          {filteredAndSortedHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  name={hotel.name}
                  nameEn={hotel.nameEn}
                  stars={hotel.stars}
                  rating={hotel.rating}
                  price={hotel.price}
                  description={hotel.description}
                  descriptionEn={hotel.descriptionEn}
                  image={hotel.image}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-xl text-foreground mb-2">
                {language === 'ru' ? 'Ничего не найдено' : 'No hotels found'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ru'
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Try changing your search parameters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
