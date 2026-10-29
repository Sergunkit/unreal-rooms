import { Moon, Sun, Languages } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const menuItems = {
    ru: [
      { label: 'Любимые отели', icon: '❤️', path: '/favorites' },
      { label: 'Мои бронирования', icon: '📋', path: '/bookings' },
    ],
    en: [
      { label: 'Favorite Hotels', icon: '❤️', path: '/favorites' },
      { label: 'My Bookings', icon: '📋', path: '/bookings' },
    ],
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-8 h-8 text-primary rotate-45 stroke-[1.5]" style={{ background: 'currentColor', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
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
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
              aria-label="Toggle language"
            >
              <Languages className="w-5 h-5" />
              <span className="uppercase">{language}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all outline-none focus:ring-2 focus:ring-primary/50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border w-56 mr-4" align="end">
                {menuItems[language].map((item, index) => (
                  <div key={item.label}>
                    {index > 0 && <DropdownMenuSeparator className="bg-border" />}
                    <DropdownMenuItem
                      className="text-foreground focus:bg-primary/20 focus:text-primary cursor-pointer flex items-center gap-3 px-3 py-2"
                      onClick={() => navigate(item.path!)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
