import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { Header } from './components/Header';
import { FloatingWidget } from './components/FloatingWidget';
import { DisclaimerTooltip } from './components/DisclaimerTooltip';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BookingsPage } from './pages/BookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { useLanguage } from './contexts/LanguageContext';
import { Sparkle, X } from 'lucide-react';

// Внутренний компонент для обработки логики модалки артефакта
function AppContent() {
  const { language } = useLanguage();
  const { playerStatus, addArtefact, hasArtefact, addToInventory } = useGame();
  const [suitcaseGlow, setSuitcaseGlow] = useState(false);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [foundArtifact, setFoundArtifact] = useState<{
    id: string;
    name: string;
    nameEn: string;
    image: string;
    alreadyCollected?: boolean;
  } | null>(null);

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

  const handleArtefactClick = (artefact: {
    id: string;
    name: string;
    nameEn: string;
    image: string;
  }) => {
    const alreadyHas = hasArtefact(artefact.id);
    setFoundArtifact({
      id: artefact.id,
      name: artefact.name,
      nameEn: artefact.nameEn,
      image: artefact.image,
      alreadyCollected: alreadyHas,
    });
    setShowArtifactModal(true);
  };

  const handleCollectArtefact = (item: {
    id: string;
    name: string;
    nameEn: string;
    image: string;
  }) => {
    if (!hasArtefact(item.id)) {
      addArtefact({
        artefactId: item.id,
        name: item.name,
        nameEn: item.nameEn,
        image: item.image,
        collectedAt: new Date().toISOString(),
      });
      addToInventory(item.id);
      window.dispatchEvent(new Event('artefactCollected'));
    }
    setShowArtifactModal(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage language={'ru'} />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage language={'ru'} />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        {/* <Route path="/hotel/:id/book" element={<BookingFormPage />} /> */}
      </Routes>
      <DisclaimerTooltip />
      <FloatingWidget isGlowing={suitcaseGlow} onArtefactClick={handleArtefactClick} />
      <Toaster position="bottom-right" />

      {/* Artifact Found Modal - глобальная модалка для просмотра артефактов */}
      {showArtifactModal && foundArtifact && (
        <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-[300] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl text-foreground font-medium">
                  {foundArtifact.alreadyCollected
                    ? language === 'ru'
                      ? 'Артефакт уже получен'
                      : 'Artifact Already Collected'
                    : language === 'ru'
                      ? 'Артефакт найден!'
                      : 'Artifact Found!'}
                </h2>
              </div>
              <button
                onClick={() => setShowArtifactModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 flex flex-col items-center">
              <div className="w-full max-w-xs aspect-[2/3] bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={foundArtifact.image}
                  alt={foundArtifact.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'ru' ? foundArtifact.name : foundArtifact.nameEn}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {foundArtifact.alreadyCollected
                  ? language === 'ru'
                    ? 'Этот артефакт уже есть в вашем чемодане.'
                    : 'This artifact is already in your suitcase.'
                  : language === 'ru'
                    ? 'Вы нашли артефакт! Нажмите кнопку ниже, чтобы добавить его в чемодан.'
                    : 'You found an artifact! Click the button below to add it to your suitcase.'}
              </p>
              {!foundArtifact.alreadyCollected && (
                <button
                  onClick={() => handleCollectArtefact(foundArtifact)}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                  {language === 'ru' ? 'Забрать в чемодан' : 'Add to Suitcase'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GameProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="pt-6">
                  <AppContent />
                </main>
              </div>
            </Router>
          </AuthProvider>
        </GameProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
