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
// import { useLanguage } from './contexts/LanguageContext';
import { ArtifactModal } from './components/artifacts/ArtifactModal';
import { getArtefactById } from './data/artefacts';

// Внутренний компонент для обработки логики модалки артефакта
function AppContent() {
  const { addArtefact, hasArtefact, addToInventory, getCurrentHotelId } = useGame();
  const [suitcaseGlow, setSuitcaseGlow] = useState(false);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [foundArtifactId, setFoundArtifactId] = useState<string | null>(null);

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
    setFoundArtifactId(artefact.id);
    setShowArtifactModal(true);
  };

  const handleCollectArtefact = () => {
    if (foundArtifactId) {
      const artefact = getArtefactById(foundArtifactId);
      if (artefact && !hasArtefact(foundArtifactId)) {
        addArtefact({
          artefactId: foundArtifactId,
          name: artefact.name,
          nameEn: artefact.nameEn,
          image: artefact.image,
          collectedAt: new Date().toISOString(),
        });
        addToInventory(foundArtifactId);
        window.dispatchEvent(new Event('artefactCollected'));
      }
    }
    setShowArtifactModal(false);
  };

  const currentHotelId = getCurrentHotelId();

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

      {/* Artifact Modal - универсальная модалка для просмотра артефактов */}
      {showArtifactModal && foundArtifactId && (
        <ArtifactModal
          key={`app-${foundArtifactId}`}
          isOpen={showArtifactModal}
          onClose={() => setShowArtifactModal(false)}
          artifactId={foundArtifactId}
          hotelId={currentHotelId}
          mode="collect"
          onAction={handleCollectArtefact}
        />
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
