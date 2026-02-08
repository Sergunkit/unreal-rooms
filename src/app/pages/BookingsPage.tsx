import { Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function BookingsPage() {
  const { language } = useLanguage();
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-3xl text-foreground">
            {language === 'ru' ? 'Мои бронирования' : 'My Bookings'}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl text-foreground mb-2">
            {language === 'ru' ? 'У вас нет бронирований' : 'You have no bookings'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {language === 'ru'
              ? 'Забронируйте свой первый отель и начните незабываемое путешествие'
              : 'Book your first hotel and start an unforgettable journey'}
          </p>
        </div>
      </div>
    </main>
  );
}
