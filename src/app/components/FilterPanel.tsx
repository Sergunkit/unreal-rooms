import { SlidersHorizontal, Star } from 'lucide-react';

interface FilterPanelProps {
  language: 'ru' | 'en';
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  selectedStars: number[];
  onStarsChange: (stars: number[]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export function FilterPanel({
  language,
  minPrice,
  maxPrice,
  onPriceChange,
  selectedStars,
  onStarsChange,
  minRating,
  onRatingChange,
}: FilterPanelProps) {
  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      onStarsChange(selectedStars.filter(s => s !== star));
    } else {
      onStarsChange([...selectedStars, star]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h3 className="text-foreground">
          {language === 'ru' ? 'Фильтры' : 'Filters'}
        </h3>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-sm text-muted-foreground mb-3">
          {language === 'ru' ? 'Цена за ночь' : 'Price per night'}
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Min"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Stars Filter */}
      <div className="mb-6">
        <label className="block text-sm text-muted-foreground mb-3">
          {language === 'ru' ? 'Звездность' : 'Star Rating'}
        </label>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => toggleStar(star)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                selectedStars.includes(star)
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-input-background border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Star className={`w-4 h-4 ${selectedStars.includes(star) ? 'fill-primary' : ''}`} />
              <span>{star}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm text-muted-foreground mb-3">
          {language === 'ru' ? 'Минимальный рейтинг' : 'Minimum Rating'}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={minRating}
          onChange={(e) => onRatingChange(Number(e.target.value))}
          className="w-full h-2 bg-input-background rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">0</span>
          <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
            {minRating}+
          </span>
          <span className="text-sm text-muted-foreground">10</span>
        </div>
      </div>

      <button 
        onClick={() => {
          onPriceChange(0, 1000);
          onStarsChange([]);
          onRatingChange(0);
        }}
        className="w-full mt-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition-colors"
      >
        {language === 'ru' ? 'Сбросить фильтры' : 'Reset Filters'}
      </button>
    </div>
  );
}
