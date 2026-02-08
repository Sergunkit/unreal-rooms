import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface SearchBarProps {
  language: 'ru' | 'en';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SearchBar({
  language,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: SearchBarProps) {
  const sortOptions = [
    { value: 'name', labelRu: 'По названию', labelEn: 'By Name' },
    { value: 'rating', labelRu: 'По рейтингу', labelEn: 'By Rating' },
    { value: 'stars', labelRu: 'По звездности', labelEn: 'By Stars' },
    { value: 'price', labelRu: 'По цене', labelEn: 'By Price' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'ru' ? 'Поиск отелей...' : 'Search hotels...'}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="md:w-64">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full !h-auto py-3 px-4 bg-input-background border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 transition-all">
              <SelectValue placeholder={language === 'ru' ? 'Сортировка' : 'Sort by'} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-foreground focus:bg-primary/20 focus:text-primary cursor-pointer"
                >
                  {language === 'ru' ? option.labelRu : option.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}