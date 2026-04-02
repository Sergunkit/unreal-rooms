import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Info } from 'lucide-react';
import { useGame, MAX_INVENTORY_SLOTS } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getArtefactById } from '../../data/artefacts';
import { LostAndFoundModal } from '../artifacts/LostAndFoundModal';
import type { Position } from '../artifacts/ArtifactTransferAnimation';

interface SuitcaseModalProps {
  /** Открыта ли модалка */
  isOpen: boolean;
  /** Закрыть модалку */
  onClose: () => void;
  /** Позиция чемодана для анимации */
  suitcasePosition?: Position;
  /** Вызывается при клике на артефакт */
  onArtifactClick?: (artifactId: string) => void;
  /** Вызывается при желании оставить артефакт в потеряшках */
  onPlaceInLostAndFound?: (artifactId: string) => void;
}

/**
 * Модалка чемодана с сеткой 3x3 (9 слотов)
 */
export function SuitcaseModal({
  isOpen,
  onClose,
  suitcasePosition,
  onArtifactClick,
  onPlaceInLostAndFound,
}: SuitcaseModalProps) {
  const { language } = useLanguage();
  const { playerStatus, removeFromInventory } = useGame();
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | undefined>();
  const [showLostAndFound, setShowLostAndFound] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const inventory = playerStatus.inventory;

  // Создаем массив из 9 слотов
  const slots = useMemo(() => {
    return Array.from({ length: MAX_INVENTORY_SLOTS }, (_, index) => {
      const artifactId = inventory[index];
      const artifact = artifactId ? getArtefactById(artifactId) : null;
      return { index, artifactId, artifact };
    });
  }, [inventory]);

  const translations = {
    title: language === 'ru' ? 'Ваш чемодан' : 'Your Suitcase',
    empty: language === 'ru' ? 'Ваш чемодан пока пуст' : 'Your suitcase is still empty',
    emptyHint:
      language === 'ru'
        ? 'Находите артефакты в отелях!'
        : 'Find artefacts in hotels!',
    slot: language === 'ru' ? 'Слот' : 'Slot',
    leaveInLostAndFound:
      language === 'ru' ? 'Оставить в потеряшках' : 'Leave in Lost & Found',
    useArtifact: language === 'ru' ? 'Использовать' : 'Use Artifact',
    slotsCount: language === 'ru' ? 'слотов' : 'slots',
  };

  /**
   * Обработать клик на артефакте
   */
  const handleArtifactClick = (artifactId: string) => {
    if (onArtifactClick) {
      onArtifactClick(artifactId);
    }
  };

  /**
   * Обработать клик правой кнопкой (контекстное меню)
   */
  const handleArtifactContextMenu = (e: React.MouseEvent, artifactId: string) => {
    e.preventDefault();
    setSelectedArtifactId(artifactId);
  };

  /**
   * Открыть модалку потеряшек
   */
  const handleOpenLostAndFound = () => {
    setShowLostAndFound(true);
  };

  /**
   * Закрыть модалку потеряшек
   */
  const handleCloseLostAndFound = () => {
    setShowLostAndFound(false);
    setSelectedArtifactId(undefined);
  };

  /**
   * Оставить артефакт в потеряшках
   */
  const handlePlaceInLostAndFound = (artifactId: string) => {
    removeFromInventory(artifactId);
    onPlaceInLostAndFound?.(artifactId);
    handleCloseLostAndFound();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card border border-border rounded-lg max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Заголовок */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-8 h-8"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="leatherGradientModal" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
                          <stop offset="50%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#6B3410', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <rect
                        x="20"
                        y="30"
                        width="60"
                        height="50"
                        rx="4"
                        fill="url(#leatherGradientModal)"
                        stroke="#654321"
                        strokeWidth="2"
                      />
                      <rect
                        x="47"
                        y="48"
                        width="6"
                        height="8"
                        rx="1"
                        fill="#C9A961"
                        stroke="#8B7355"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{translations.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {inventory.length} / {MAX_INVENTORY_SLOTS} {translations.slotsCount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Контент */}
              <div className="p-6 overflow-y-auto flex-1">
                {inventory.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-2">{translations.empty}</p>
                    <p className="text-sm text-muted-foreground">{translations.emptyHint}</p>
                  </div>
                ) : (
                  <>
                    {/* Сетка 3x3 */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {slots.map((slot, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: slot.artifact ? 1 : 0.3,
                            scale: 1,
                          }}
                          transition={{ delay: index * 0.05 }}
                          className={`relative aspect-square rounded-lg border-2 transition-all cursor-pointer ${
                            slot.artifact
                              ? 'border-primary/30 bg-secondary/50 hover:border-primary hover:bg-secondary'
                              : 'border-border bg-secondary/20 border-dashed'
                          }`}
                          onMouseEnter={() => setHoveredSlot(index)}
                          onMouseLeave={() => setHoveredSlot(null)}
                          onClick={() => slot.artifactId && handleArtifactClick(slot.artifactId)}
                          onContextMenu={(e) =>
                            slot.artifactId && handleArtifactContextMenu(e, slot.artifactId)
                          }
                        >
                          {slot.artifact ? (
                            <div className="absolute inset-0 p-2 flex items-center justify-center">
                              <img
                                src={slot.artifact.image}
                                alt={language === 'ru' ? slot.artifact.name : slot.artifact.nameEn}
                                className="w-full h-full object-contain drop-shadow-md"
                              />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl text-muted-foreground opacity-30">
                                {index + 1}
                              </span>
                            </div>
                          )}

                          {/* Индикатор номера слота */}
                          {slot.artifact && (
                            <div className="absolute top-1 left-1 w-5 h-5 bg-primary/80 rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                              {index + 1}
                            </div>
                          )}

                          {/* Hover эффект */}
                          {slot.artifact && hoveredSlot === index && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-primary/10 rounded-lg"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Подсказка */}
                    <div className="flex items-start gap-2 p-3 bg-info/10 border border-info/20 rounded-md">
                      <Info className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-muted-foreground">
                        <p>
                          {language === 'ru'
                            ? '• Левый клик: использовать артефакт'
                            : '• Left click: use artifact'}
                        </p>
                        <p>
                          {language === 'ru'
                            ? '• Правый клик: оставить в потеряшках'
                            : '• Right click: leave in Lost & Found'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модалка потеряшек */}
      <LostAndFoundModal
        isOpen={showLostAndFound}
        onClose={handleCloseLostAndFound}
        hotelId="current" // Будет заменено на актуальный ID отеля
        artifactId={selectedArtifactId}
        onPlaceArtifact={handlePlaceInLostAndFound}
      />
    </>
  );
}
