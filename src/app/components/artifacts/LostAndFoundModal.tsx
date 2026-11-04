import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Search } from 'lucide-react';
import { useGame, type PlacedLostAndFoundItem } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCatalog } from '../../contexts/CatalogContext';
import { ArtifactModal } from './ArtifactModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface LostAndFoundModalProps {
  /** Открыта ли модалка */
  isOpen: boolean;
  /** Закрыть модалку */
  onClose: () => void;
  /** ID отеля, в котором оставляем артефакт */
  hotelId: string;
  /** Статические предметы из конфига отеля */
  staticLostAndFound?: string[];
  /** ID артефакта для оставления */
  artifactId?: string;
  /** Вызывается после успешного оставления артефакта */
  onPlaceArtifact?: (artifactId: string) => void;
}

/**
 * Модалка "Потеряшки" (Lost & Found)
 * Показывает предметы из конфига отеля + добавленные пользователями
 */
export function LostAndFoundModal({
  isOpen,
  onClose,
  hotelId,
  staticLostAndFound = [],
  artifactId: _artifactId,
  onPlaceArtifact: _onPlaceArtifact,
}: LostAndFoundModalProps) {
  const catalog = useCatalog();
  const artefacts = catalog.status === 'loaded' ? catalog.artefacts : {};
  const { language } = useLanguage();
  const { playerStatus, addToInventory, placedLostAndFoundItems, removePlacedLostAndFoundItem } =
    useGame();
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [showInventoryAlert, setShowInventoryAlert] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    (PlacedLostAndFoundItem & { isStatic?: boolean }) | null
  >(null);

  // Объединяем статические предметы из конфига и предметы, оставленные игроками
  const allItems = (() => {
    const playerItems = placedLostAndFoundItems
      .filter((item) => item.hotelId === hotelId)
      .map((item) => ({
        ...item,
        isStatic: false,
      }));

    // Статические предметы из конфига отеля (только те, которых игроки не оставляли)
    const staticItems = staticLostAndFound
      .filter((artifactId) => !playerItems.some((item) => item.artifactId === artifactId))
      .map((artifactId) => ({
        artifactId,
        hotelId,
        placedAt: '',
        isStatic: true,
      }));

    return [...staticItems, ...playerItems];
  })();

  const translations = {
    title: language === 'ru' ? 'Потеряшки' : 'Lost & Found',
    noItems:
      language === 'ru' ? 'В этом отеле нет потерянных предметов' : 'No lost items in this hotel',
    takeButton: language === 'ru' ? 'Забрать' : 'Take',
    alreadyInSuitcase: language === 'ru' ? 'Уже в чемодане' : 'Already in suitcase',
  };

  /**
   * Открыть модалку артефакта
   */
  const handleOpenArtifactModal = (item: PlacedLostAndFoundItem & { isStatic?: boolean }) => {
    setSelectedArtifactId(item.artifactId);
    setSelectedItem(item);
    setShowArtifactModal(true);
  };

  /**
   * Закрыть модалку артефакта
   */
  const handleCloseArtifactModal = () => {
    setShowArtifactModal(false);
    setSelectedArtifactId(null);
    setSelectedItem(null);
  };

  /**
   * Забрать предмет из потеряшек (после клика на "Забрать в чемодан")
   */
  const handleCollectArtifact = () => {
    if (!selectedItem) return;

    // Проверяем, есть ли место в инвентаре
    if (playerStatus.inventory.length >= 9) {
      setShowInventoryAlert(true);
      return;
    }

    addToInventory(selectedItem.artifactId);

    // Удаляем только если это не статический предмет
    if (!selectedItem.isStatic) {
      removePlacedLostAndFoundItem(selectedItem.artifactId, selectedItem.hotelId);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Заголовок */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-foreground font-medium">{translations.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Контент */}
              <div className="overflow-y-auto flex-1 p-6">
                {allItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{translations.noItems}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {allItems.map((item, index) => {
                      const itemArtifact = artefacts[item.artifactId];
                      if (!itemArtifact) return null;

                      // Проверяем, есть ли артефакт в инвентаре или в коллекции
                      const alreadyCollected = playerStatus.inventory.includes(item.artifactId);

                      return (
                        <div
                          key={`${item.artifactId}-${index}`}
                          className={`rounded-lg p-4 transition-colors cursor-pointer ${
                            alreadyCollected
                              ? 'opacity-50 cursor-not-allowed bg-secondary/30'
                              : 'bg-secondary/50 hover:bg-secondary'
                          }`}
                          onClick={() => !alreadyCollected && handleOpenArtifactModal(item)}
                        >
                          <div className="w-full aspect-[2/3] bg-secondary rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            <img
                              src={itemArtifact.image}
                              alt={language === 'ru' ? itemArtifact.name : itemArtifact.nameEn}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <h4 className="text-sm font-medium text-foreground">
                            {language === 'ru' ? itemArtifact.name : itemArtifact.nameEn}
                          </h4>
                          {alreadyCollected && (
                            <p className="text-xs text-primary mt-1">
                              {translations.alreadyInSuitcase}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artifact Modal для предметов из потеряшек */}
      <ArtifactModal
        isOpen={showArtifactModal && selectedArtifactId !== null}
        onClose={handleCloseArtifactModal}
        artifactId={selectedArtifactId || ''}
        mode="collect"
        hotelId={hotelId}
        onAction={handleCollectArtifact}
      />

      <AlertDialog open={showInventoryAlert} onOpenChange={setShowInventoryAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ru' ? 'Чемодан полон' : 'Suitcase is full'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ru'
                ? 'В чемодане нет места! Освободите слот.'
                : 'No space in suitcase! Free up a slot.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{language === 'ru' ? 'OK' : 'OK'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
