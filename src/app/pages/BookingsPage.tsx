import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';

export function BookingsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

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
