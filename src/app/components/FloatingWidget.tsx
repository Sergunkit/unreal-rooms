import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SuitcaseModal } from './inventory/SuitcaseModal';
import {
  ArtifactTransferAnimation,
  useArtifactAnimation,
  type Position,
} from './artifacts/ArtifactTransferAnimation';
import { getArtefactById } from '../data/artefacts';

interface FloatingWidgetProps {
  isGlowing?: boolean;
  onArtefactClick?: (artefact: { id: string; name: string; nameEn: string; image: string }) => void;
}

export function FloatingWidget({ isGlowing = false, onArtefactClick }: FloatingWidgetProps) {
  const { language } = useLanguage();
  const { playerStatus } = useGame();
  const [isHovered, setIsHovered] = useState(false);
  const [showSuitcaseModal, setShowSuitcaseModal] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { animation, triggerAnimation } = useArtifactAnimation();

  const collectedArtefacts = playerStatus.collectedArtefacts;

  /**
   * Обработать клик по чемодану
   */
  const handleSuitcaseClick = () => {
    setShowSuitcaseModal(true);
  };

  /**
   * Обработать клик по артефакту из модалки
   */
  const handleArtifactClick = useCallback(
    async (artifactId: string) => {
      const artifact = getArtefactById(artifactId);
      if (!artifact) return;

      // Закрыть модалку чемодана
      setShowSuitcaseModal(false);

      // Получить позицию чемодана для анимации
      const suitcaseRect = widgetRef.current?.getBoundingClientRect();
      if (!suitcaseRect) return;

      const fromPosition: Position = {
        x: suitcaseRect.left + suitcaseRect.width / 2 - 40,
        y: suitcaseRect.top + suitcaseRect.height / 2 - 40,
      };

      // Для примера - просто показываем артефакт
      // В реальности здесь будет логика использования артефакта
      if (onArtefactClick) {
        onArtefactClick({
          id: artifact.id,
          name: artifact.name,
          nameEn: artifact.nameEn,
          image: artifact.image,
        });
      }

      // Анимация возврата артефакта в чемодан (опционально)
      // await triggerAnimation({
      //   from: fromPosition,
      //   to: { x: fromPosition.x, y: fromPosition.y },
      //   artifactImage: artifact.image,
      //   artifactName: language === 'ru' ? artifact.name : artifact.nameEn,
      // });
    },
    [onArtefactClick, language]
  );

  /**
   * Обработать оставление артефакта в потеряшках
   */
  const handlePlaceInLostAndFound = useCallback((artifactId: string) => {
    console.log('Artifact placed in Lost & Found:', artifactId);
    // Здесь можно добавить дополнительную логику
  }, []);

  return (
    <>
      {/* Анимация перемещения артефакта */}
      {animation && <ArtifactTransferAnimation {...animation} />}

      {/* Виджет чемодана */}
      <div ref={widgetRef} className="fixed bottom-8 right-8 z-[100] cursor-pointer" onClick={handleSuitcaseClick}>
        <motion.div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`absolute inset-0 blur-2xl -z-10 transition-all duration-500 ${
              isGlowing ? 'bg-primary/60 scale-110' : 'bg-primary/20'
            }`}
          />

          <motion.div
            className="relative w-24 h-24"
            animate={isGlowing ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isGlowing ? 2 : 0 }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="leatherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#6B3410', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              </defs>
              <path
                d="M 35 25 Q 35 18 40 18 L 60 18 Q 65 18 65 25"
                fill="none"
                stroke="#654321"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect
                x="20"
                y="30"
                width="60"
                height="50"
                rx="4"
                fill="url(#leatherGradient)"
                filter="url(#shadow)"
                stroke="#654321"
                strokeWidth="2"
              />
              <line
                x1="25"
                y1="35"
                x2="75"
                y2="35"
                stroke="#6B3410"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line
                x1="25"
                y1="75"
                x2="75"
                y2="75"
                stroke="#6B3410"
                strokeWidth="0.5"
                opacity="0.5"
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
              <circle cx="50" cy="52" r="1.5" fill="#654321" />
              <circle cx="25" cy="35" r="2" fill="#8B7355" />
              <circle cx="75" cy="35" r="2" fill="#8B7355" />
              <circle cx="25" cy="75" r="2" fill="#8B7355" />
              <circle cx="75" cy="75" r="2" fill="#8B7355" />
              <rect x="30" y="50" width="40" height="3" rx="1.5" fill="#654321" opacity="0.7" />
              <rect x="30" y="60" width="40" height="3" rx="1.5" fill="#654321" opacity="0.7" />
            </svg>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute top-2 left-2"
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/30 to-transparent rounded-b-lg"
              initial={{ height: 0 }}
              animate={{ height: isHovered ? '80%' : 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
            />
          </motion.div>

          {/* Тултип */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-lg">
              <p className="text-xs text-foreground font-medium">
                {language === 'ru' ? 'Ваш чемодан' : 'Your Suitcase'}
              </p>
              {playerStatus.inventory.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {playerStatus.inventory.length} / 9
                </p>
              )}
            </div>
          </motion.div>

          {/* Индикатор заполненности */}
          {playerStatus.inventory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background"
            >
              {playerStatus.inventory.length}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Модалка чемодана */}
      <SuitcaseModal
        isOpen={showSuitcaseModal}
        onClose={() => setShowSuitcaseModal(false)}
        suitcasePosition={
          widgetRef.current?.getBoundingClientRect()
            ? {
                x: widgetRef.current.getBoundingClientRect().left,
                y: widgetRef.current.getBoundingClientRect().top,
              }
            : undefined
        }
        onArtifactClick={handleArtifactClick}
        onPlaceInLostAndFound={handlePlaceInLostAndFound}
      />
    </>
  );
}
