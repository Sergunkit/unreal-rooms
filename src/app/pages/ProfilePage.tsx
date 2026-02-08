import { useState } from 'react';
import { User, Mail, Edit2, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface ProfilePageProps {
  language: 'ru' | 'en';
}

export function ProfilePage({ language }: ProfilePageProps) {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const t = {
    title: language === 'ru' ? 'Профиль' : 'Profile',
    name: language === 'ru' ? 'Имя' : 'Name',
    email: language === 'ru' ? 'Email' : 'Email',
    edit: language === 'ru' ? 'Редактировать' : 'Edit',
    save: language === 'ru' ? 'Сохранить' : 'Save',
    cancel: language === 'ru' ? 'Отмена' : 'Cancel',
    stats: language === 'ru' ? 'Статистика' : 'Statistics',
    bookings: language === 'ru' ? 'Бронирований' : 'Bookings',
    favorites: language === 'ru' ? 'Избранных' : 'Favorites',
    reviews: language === 'ru' ? 'Отзывов' : 'Reviews',
    updated: language === 'ru' ? 'Профиль обновлен' : 'Profile updated',
    error: language === 'ru' ? 'Ошибка при обновлении' : 'Error updating profile',
    loading: language === 'ru' ? 'Загрузка...' : 'Loading...',
  };

  const handleSave = async () => {
    try {
      await updateProfile(name);
      toast.success(t.updated);
      setIsEditing(false);
    } catch (error) {
      toast.error(t.error);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            {language === 'ru' ? 'Пожалуйста, войдите в систему' : 'Please sign in'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            <h1 className="text-3xl text-foreground">{t.title}</h1>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {t.edit}
            </Button>
          )}
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.name}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-primary to-purple-600 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {t.save}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl text-foreground mb-1">{user.name}</h2>
                  <p className="text-muted-foreground">
                    {language === 'ru' ? 'Исследователь мистических мест' : 'Explorer of mystical places'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Mail className="w-5 h-5 text-primary" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl text-foreground mb-4">{t.stats}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl text-primary mb-1">0</div>
              <p className="text-sm text-muted-foreground">{t.bookings}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl text-primary mb-1">0</div>
              <p className="text-sm text-muted-foreground">{t.favorites}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl text-primary mb-1">0</div>
              <p className="text-sm text-muted-foreground">{t.reviews}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}