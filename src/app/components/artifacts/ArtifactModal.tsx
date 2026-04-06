import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInventory } from '../../hooks/useInventory';
import { getArtefactById } from '../../data/artefacts';

type ArtifactModalMode = 'collect' | 'place';

interface ArtifactModalProps {
  /** Открыта ли модалка */
  isOpen: boolean;
  /** Закрыть модалку */
  onClose: () => void;
  /** ID артефакта для отображения */
  artifactId: string;
  /** Режим модалки: 'collect' - кнопка "Забрать в чемодан", 'place' - кнопка "Оставить в отеле" */
  mode: ArtifactModalMode;
  /** ID отеля (для режима 'place') */
  hotelId?: string;
  /** Колбэк после нажатия кнопки действия */
  onAction: () => void;
}

/**
 * Модалка просмотра артефакта
 * mode='collect': показывает кнопку "Забрать в чемодан"
 * mode='place': показывает кнопку "Оставить в отеле"
 */
export function ArtifactModal({
  isOpen,
  onClose,
  artifactId,
  mode,
  hotelId,
  onAction,
}: ArtifactModalProps) {
  const { language } = useLanguage();
  const { hasArtefact } = useGame();

  const artifact = getArtefactById(artifactId);

  if (!artifact) return null;

  const isAlreadyCollected = hasArtefact(artifactId);

  /**
   * Обработать действие (в зависимости от режима)
   */
  const handleAction = () => {
    if (mode === 'collect' && isAlreadyCollected) {
      onClose();
      return;
    }

    onAction();
    onClose();
  };

  const translations = {
    collectTitle: language === 'ru' ? 'Артефакт найден!' : 'Artifact Found!',
    placeTitle: language === 'ru' ? 'Ваш артефакт' : 'Your Artifact',
    alreadyCollectedTitle:
      language === 'ru' ? 'Артефакт уже получен' : 'Artifact Already Collected',
    collectDesc:
      language === 'ru'
        ? 'Вы нашли артефакт! Нажмите кнопку ниже, чтобы добавить его в чемодан.'
        : 'You found an artifact! Click the button below to add it to your suitcase.',
    placeDesc:
      language === 'ru'
        ? 'Артефакт в вашем чемодане. Вы можете оставить его в отеле.'
        : 'Artifact is in your suitcase. You can leave it at the hotel.',
    alreadyCollectedDesc:
      language === 'ru'
        ? 'Этот артефакт уже есть в вашем чемодане.'
        : 'This artifact is already in your suitcase.',
    collectButton: language === 'ru' ? 'Забрать в чемодан' : 'Add to Suitcase',
    placeButton: language === 'ru' ? 'Оставить в отеле' : 'Leave at Hotel',
  };

  // Определяем заголовок и описание в зависимости от режима
  const getTitle = () => {
    if (isAlreadyCollected && mode === 'collect') {
      return translations.alreadyCollectedTitle;
    }
    return mode === 'collect' ? translations.collectTitle : translations.placeTitle;
  };

  const getDescription = () => {
    if (isAlreadyCollected && mode === 'collect') {
      return translations.alreadyCollectedDesc;
    }
    return mode === 'collect' ? translations.collectDesc : translations.placeDesc;
  };

  // Кнопка скрывается только если артефакт уже собран и мы в режиме collect
  const shouldShowButton = !(isAlreadyCollected && mode === 'collect');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/30 backdrop-blur-xs z-[300] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-card border border-border rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl text-foreground font-medium">{getTitle()}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Контент */}
            <div className="overflow-y-auto flex-1 p-6 flex flex-col items-center">
              <div className="w-full max-w-xs aspect-[2/3] bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={artifact.image}
                  alt={language === 'ru' ? artifact.name : artifact.nameEn}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'ru' ? artifact.name : artifact.nameEn}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {getDescription()}
              </p>

              {/* Кнопка */}
              {shouldShowButton && (
                <div className="w-full">
                  <button
                    onClick={handleAction}
                    className={`w-full px-6 py-3 rounded-lg transition-all font-medium ${
                      mode === 'collect'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25'
                        : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    {mode === 'collect'
                      ? translations.collectButton
                      : translations.placeButton}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
