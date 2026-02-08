import { Moon, Sun, Languages, KeyRound, User, LogIn, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { AuthModal } from './AuthModal';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const menuItems = {
    ru: [
      { label: 'Консьерж', icon: '💬', path: '/chat' },
      { label: 'Любимые отели', icon: '❤️', path: '/favorites' },
      { label: 'Мои бронирования', icon: '📋', path: '/bookings' },
      { label: 'Профиль', icon: '👤', path: '/profile' },
      { label: 'Выйти', icon: '🚪', path: null },
    ],
    en: [
      { label: 'Concierge', icon: '💬', path: '/chat' },
      { label: 'Favorite Hotels', icon: '❤️', path: '/favorites' },
      { label: 'My Bookings', icon: '📋', path: '/bookings' },
      { label: 'Profile', icon: '👤', path: '/profile' },
      { label: 'Logout', icon: '🚪', path: null },
    ],
  };

  const handleMenuClick = async (path: string | null) => {
    if (path) {
      navigate(path);
    } else {
      // Handle logout
      try {
        await signOut();
        toast.success(language === 'ru' ? 'Вы вышли из системы' : 'Logged out successfully');
        navigate('/');
      } catch {
        toast.error(language === 'ru' ? 'Ошибка при выходе' : 'Error logging out');
      }
    }
  };

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <KeyRound className="w-8 h-8 text-primary rotate-45 stroke-[1.5]" />
                <div className="absolute inset-0 blur-xl bg-primary/30 -z-10" />
              </div>
              <div>
                <h1 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Unreal Rooms
                </h1>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Магия путешествий' : 'Magic of Travel'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
                aria-label="Toggle language"
              >
                <Languages className="w-5 h-5" />
                <span className="uppercase">{language}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Chat Button (only for logged in users) */}
              {user && (
                <button
                  onClick={() => navigate('/chat')}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
                  aria-label="Open chat"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              )}

              {/* Profile Menu or Login Button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all outline-none focus:ring-2 focus:ring-primary/50">
                    <User className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border w-56 mr-4" align="end">
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border" />
                    {menuItems[language].map((item, index) => (
                      <div key={item.label}>
                        {index === menuItems[language].length - 1 && (
                          <DropdownMenuSeparator className="bg-border" />
                        )}
                        <DropdownMenuItem
                          className="text-foreground focus:bg-primary/20 focus:text-primary cursor-pointer flex items-center gap-3 px-3 py-2"
                          onClick={() => handleMenuClick(item.path)}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{language === 'ru' ? 'Войти' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} language={language} />
    </>
  );
}
