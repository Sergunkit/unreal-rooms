import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getArtefactById } from '../../data/artefacts';
import type { Artefact } from '../../data/artefacts';

/**
 * Предмет в потеряшках
 */
export interface LostAndFoundItem {
  artifactId: string;
  hotelId: string;
  placedAt: string;
  message?: string;
  messageEn?: string;
}

interface LostAndFoundModalProps {
  /** Открыта ли модалка */
  isOpen: boolean;
  /** Закрыть модалку */
  onClose: () => void;
  /** ID отеля, в котором оставляем артефакт */
  hotelId: string;
  /** ID артефакта для оставления */
  artifactId?: string;
  /** Вызывается после успешного оставления артефакта */
  onPlaceArtifact?: (artifactId: string) => void;
}

/**
 * Ключ для хранения потеряшек в localStorage
 */
const LOST_AND_FOUND_STORAGE_KEY = 'unreal-rooms-lost-and-found';

/**
 * Получить все предметы из потеряшек
 */
function getLostAndFoundItems(): LostAndFoundItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(LOST_AND_FOUND_STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

/**
 * Сохранить предметы в потеряшки
 */
function saveLostAndFoundItem(item: LostAndFoundItem) {
  const items = getLostAndFoundItems();
  items.push(item);
  localStorage.setItem(LOST_AND_FOUND_STORAGE_KEY, JSON.stringify(items));
}

/**
 * Удалить предмет из потеряшек
 */
function removeLostAndFoundItem(artifactId: string, hotelId: string) {
  const items = getLostAndFoundItems();
  const filtered = items.filter(
    (item) => !(item.artifactId === artifactId && item.hotelId === hotelId)
  );
  localStorage.setItem(LOST_AND_FOUND_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Получить предметы из потеряшек для конкретного отеля
 */
export function getLostAndFoundByHotel(hotelId: string): LostAndFoundItem[] {
  return getLostAndFoundItems().filter((item) => item.hotelId === hotelId);
}

/**
 * Модалка "Потеряшки" (Lost & Found)
 * Позволяет оставить артефакт в отеле или найти оставленные ранее
 */
export function LostAndFoundModal({
  isOpen,
  onClose,
  hotelId,
  artifactId,
  onPlaceArtifact,
}: LostAndFoundModalProps) {
  const { language } = useLanguage();
  const { playerStatus, removeFromInventory, addToInventory } = useGame();
  const [message, setMessage] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [showFoundItems, setShowFoundItems] = useState(false);

  // Получаем артефакт для отображения
  const artifact = artifactId ? getArtefactById(artifactId) : null;

  // Получаем предметы в потеряшках этого отеля
  const foundItems = getLostAndFoundByHotel(hotelId);

  /**
   * Оставить артефакт в потеряшках
   */
  const handlePlaceArtifact = () => {
    if (!artifactId) return;

    const newItem: LostAndFoundItem = {
      artifactId,
      hotelId,
      placedAt: new Date().toISOString(),
      message: message || undefined,
      messageEn: message || undefined,
    };

    saveLostAndFoundItem(newItem);
    removeFromInventory(artifactId);
    onPlaceArtifact?.(artifactId);
    setIsPlacing(false);
    setMessage('');
    onClose();
  };

  /**
   * Забрать предмет из потеряшек
   */
  const handleTakeArtifact = (item: LostAndFoundItem) => {
    // Проверяем, есть ли место в инвентаре
    if (playerStatus.inventory.length >= 9) {
      alert(
        language === 'ru'
          ? 'В чемодане нет места! Освободите слот.'
          : 'No space in suitcase! Free up a slot.'
      );
      return;
    }

    addToInventory(item.artifactId);
    removeLostAndFoundItem(item.artifactId, item.hotelId);
    setShowFoundItems(false);
  };

  const translations = {
    title: language === 'ru' ? 'Потеряшки' : 'Lost & Found',
    placeTitle: language === 'ru' ? 'Оставить артефакт' : 'Leave Artifact',
    findTitle: language === 'ru' ? 'Найденные предметы' : 'Found Items',
    placeDescription:
      language === 'ru'
        ? 'Вы можете оставить этот артефакт в отеле. Другие игроки смогут его найти.'
        : 'You can leave this artifact at the hotel. Other players will be able to find it.',
    messageLabel:
      language === 'ru' ? 'Сообщение для нашедшего (необязательно)' : 'Message for finder (optional)',
    messagePlaceholder:
      language === 'ru'
        ? 'Например: "Оставил здесь, может пригодиться"'
        : 'e.g., "Left here, might be useful"',
    placeButton: language === 'ru' ? 'Оставить в отеле' : 'Leave at Hotel',
    cancelButton: language === 'ru' ? 'Отмена' : 'Cancel',
    takeButton: language === 'ru' ? 'Забрать' : 'Take',
    noItems:
      language === 'ru'
        ? 'В этом отеле нет потерянных предметов'
        : 'No lost items in this hotel',
    viewFound: language === 'ru' ? 'Посмотреть потеряшки' : 'View Lost & Found',
    backToPlacing: language === 'ru' ? 'Вернуться' : 'Back',
    yourArtifact: language === 'ru' ? 'Ваш артефакт' : 'Your Artifact',
  };

  return (
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
            className="bg-card border border-border rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">{translations.title}</h2>
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
              {!showFoundItems && artifact && (
                <>
                  {/* Отображение артефакта */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {translations.yourArtifact}
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                      <img
                        src={artifact.image}
                        alt={language === 'ru' ? artifact.name : artifact.nameEn}
                        className="w-16 h-16 object-contain rounded-md bg-background"
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {language === 'ru' ? artifact.name : artifact.nameEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Описание */}
                  <p className="text-sm text-muted-foreground mb-4">{translations.placeDescription}</p>

                  {/* Поле сообщения */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {translations.messageLabel}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={translations.messagePlaceholder}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Кнопки */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handlePlaceArtifact}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                      {translations.placeButton}
                    </button>
                    <button
                      onClick={() => setShowFoundItems(true)}
                      className="w-full px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
                    >
                      {translations.viewFound}
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-md hover:bg-secondary transition-colors font-medium"
                    >
                      {translations.cancelButton}
                    </button>
                  </div>
                </>
              )}

              {/* Список найденных предметов */}
              {showFoundItems && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    {translations.findTitle}
                  </h3>

                  {foundItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{translations.noItems}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {foundItems.map((item, index) => {
                        const itemArtifact = getArtefactById(item.artifactId);
                        if (!itemArtifact) return null;

                        return (
                          <div
                            key={`${item.artifactId}-${index}`}
                            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                          >
                            <img
                              src={itemArtifact.image}
                              alt={language === 'ru' ? itemArtifact.name : itemArtifact.nameEn}
                              className="w-12 h-12 object-contain rounded-md bg-background"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">
                                {language === 'ru' ? itemArtifact.name : itemArtifact.nameEn}
                              </p>
                              {item.message && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  "{item.message}"
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleTakeArtifact(item)}
                              className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors font-medium"
                            >
                              {translations.takeButton}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setShowFoundItems(false)}
                    className="w-full mt-4 px-4 py-2 bg-background border border-border text-foreground rounded-md hover:bg-secondary transition-colors font-medium"
                  >
                    {translations.backToPlacing}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
