import { Heart } from 'lucide-react';

interface FavoritesPageProps {
  language: 'ru' | 'en';
}

export function FavoritesPage({ language }: FavoritesPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl text-foreground">
            {language === 'ru' ? 'Любимые отели' : 'Favorite Hotels'}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl text-foreground mb-2">
            {language === 'ru' ? 'Здесь пока пусто' : 'Nothing here yet'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {language === 'ru'
              ? 'Начните добавлять отели в избранное, чтобы быстро находить их в будущем'
              : 'Start adding hotels to favorites to quickly find them in the future'}
          </p>
        </div>
      </div>
    </main>
  );
}
