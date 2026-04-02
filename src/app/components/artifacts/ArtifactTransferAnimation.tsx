import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface ArtifactTransferAnimationProps {
  /** Начальная позиция анимации */
  from: Position;
  /** Конечная позиция анимации */
  to: Position;
  /** URL изображения артефакта */
  artifactImage: string;
  /** Название артефакта (для alt) */
  artifactName: string;
  /** Вызывается после завершения анимации */
  onComplete?: () => void;
  /** Длительность анимации в мс */
  duration?: number;
}

/**
 * Компонент анимации перемещения артефакта
 * Используется для визуализации добавления/удаления/использования артефактов
 */
export function ArtifactTransferAnimation({
  from,
  to,
  artifactImage,
  artifactName,
  onComplete,
  duration = 1200,
}: ArtifactTransferAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isAnimating) return null;

  return (
    <motion.div
      initial={{
        x: from.x,
        y: from.y,
        scale: 0.6,
        opacity: 1,
        rotate: 0,
      }}
      animate={{
        x: to.x,
        y: to.y,
        scale: 1,
        opacity: 0.8,
        rotate: 180,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: duration / 1000,
        ease: 'easeInOut',
      }}
      className="fixed z-[1000] w-20 h-20 pointer-events-none"
      style={{
        left: 0,
        top: 0,
      }}
    >
      <div className="relative w-full h-full">
        {/* Свечение */}
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />

        {/* Изображение артефакта */}
        <img
          src={artifactImage}
          alt={artifactName}
          className="relative w-full h-full object-contain drop-shadow-2xl"
        />

        {/* Частицы (опционально) */}
        <motion.div
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: duration / 2000, repeat: 2 }}
          className="absolute inset-0 rounded-full border-2 border-primary/50"
        />
      </div>
    </motion.div>
  );
}

/**
 * Хук для запуска анимации перемещения артефакта
 * @returns Функция для запуска анимации
 */
export function useArtifactAnimation() {
  const [animation, setAnimation] = useState<ArtifactTransferAnimationProps | null>(null);

  const triggerAnimation = (props: Omit<ArtifactTransferAnimationProps, 'onComplete'>) => {
    return new Promise<void>((resolve) => {
      setAnimation({
        ...props,
        onComplete: () => {
          setAnimation(null);
          resolve();
        },
      });
    });
  };

  const clearAnimation = () => {
    setAnimation(null);
  };

  return {
    animation,
    triggerAnimation,
    clearAnimation,
  };
}
