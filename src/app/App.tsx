import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider } from './contexts/GameContext';
import { Header } from './components/Header';
import { FloatingWidget } from './components/FloatingWidget';
import { DisclaimerTooltip } from './components/DisclaimerTooltip';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BookingsPage } from './pages/BookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { BookingFormPage } from './pages/BookingFormPage';

export default function App() {
  const [suitcaseGlow, setSuitcaseGlow] = useState(false);

  // Listen for artefact/prize collection events
  useEffect(() => {
    const handleArtefactCollected = () => {
      setSuitcaseGlow(true);
      setTimeout(() => setSuitcaseGlow(false), 2000);
    };
    
    window.addEventListener('artefactCollected', handleArtefactCollected);
    window.addEventListener('prizeCollected', handleArtefactCollected);
    
    return () => {
      window.removeEventListener('artefactCollected', handleArtefactCollected);
      window.removeEventListener('prizeCollected', handleArtefactCollected);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <GameProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="pt-6">
                  <Routes>
                    <Route path="/" element={<HomePage language={'ru'} />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/profile" element={<ProfilePage language={'ru'} />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/hotel/:id" element={<HotelDetailPage />} />
                    <Route path="/hotel/:id/book" element={<BookingFormPage />} />
                  </Routes>
                </main>
                <DisclaimerTooltip />
                <FloatingWidget isGlowing={suitcaseGlow} />
                <Toaster position="bottom-right" />
              </div>
            </Router>
          </AuthProvider>
        </GameProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
