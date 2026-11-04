import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
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
import { HotelDetailPage } from './pages/HotelDetailPage';
import { ArtifactModal } from './components/artifacts/ArtifactModal';
import { CatalogProvider, useCatalog } from './contexts/CatalogContext';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const { addToInventory, getCurrentHotelId } = useGame();
  const [suitcaseGlow, setSuitcaseGlow] = useState(false);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [foundArtifactId, setFoundArtifactId] = useState<string | null>(null);

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
      addToInventory(foundArtifactId);
      window.dispatchEvent(new Event('artefactCollected'));
    }
    setShowArtifactModal(false);
  };

  const currentHotelId = getCurrentHotelId();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage language={'ru'} />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
      </Routes>
      <DisclaimerTooltip />
      <FloatingWidget isGlowing={suitcaseGlow} onArtefactClick={handleArtefactClick} />
      <Toaster position="bottom-right" />
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
    <CatalogProvider>
      <AppShell />
    </CatalogProvider>
  );
}

function AppShell() {
  const catalog = useCatalog();

  if (catalog.status === 'loading') {
    return <main className="container mx-auto px-4 py-8">Загрузка каталога отелей…</main>;
  }

  if (catalog.status === 'error') {
    return (
      <main className="container mx-auto px-4 py-8" role="alert">
        <p>Не удалось загрузить каталог отелей: {catalog.error.message}</p>
        <button className="mt-4 underline" onClick={catalog.reload}>
          Повторить
        </button>
      </main>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <GameProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="pt-6">
                  <AppContent />
                </main>
              </div>
            </Router>
          </GameProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
