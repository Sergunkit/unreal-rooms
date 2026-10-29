import { User } from 'lucide-react';

interface ProfilePageProps {
  language: 'ru' | 'en';
}

export function ProfilePage({ language }: ProfilePageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <User className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl text-foreground mb-2">
          {language === 'ru' ? 'Профиль' : 'Profile'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ru'
            ? 'Авторизация временно недоступна'
            : 'Sign in is temporarily unavailable'}
        </p>
      </div>
    </main>
  );
}
