import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';

interface FloatingWidgetProps {
  isGlowing?: boolean;
}

export function FloatingWidget({ isGlowing = false }: FloatingWidgetProps) {
  const { language } = useLanguage();
  const { playerStatus } = useGame();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const collectedArtefacts = playerStatus.collectedArtefacts;

  return (
    <>
      <div
        className="fixed bottom-8 right-8 z-[100] cursor-pointer"
        onClick={() => setShowModal(true)}
      >
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-lg">
              <p className="text-xs text-foreground font-medium">Начните путешествие</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl text-foreground font-medium">
                  {language === 'ru' ? 'Ваш чемодан' : 'Your Suitcase'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                {collectedArtefacts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {language === 'ru' ? 'Ваш чемодан пока пуст' : 'Your suitcase is still empty'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {language === 'ru'
                        ? 'Находите артефакты в отелях!'
                        : 'Find artefacts in hotels!'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {collectedArtefacts.map((artefact) => (
                      <div
                        key={artefact.artefactId}
                        className="bg-secondary/50 rounded-lg p-3 text-center"
                      >
                        {artefact.image && (
                          <img
                            src={artefact.image}
                            alt={language === 'ru' ? artefact.name : artefact.nameEn}
                            className="w-full h-16 object-cover rounded-md mb-2"
                          />
                        )}
                        <p className="text-sm font-medium text-foreground">
                          {language === 'ru' ? artefact.name : artefact.nameEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
