import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { TempBookingFormData } from '../data/hotels-data/hotelTypes';

/**
 * Максимальное количество слотов в чемодане
 */
export const MAX_INVENTORY_SLOTS = 9;

/**
 * Тип питания
 */
export type MealType = 'no-meal' | 'diet-menu' | 'half-board' | 'all-inclusive';

/**
 * Дополнительные услуги
 */
export type AdditionalService =
  | 'sauna'
  | 'fishing'
  | 'excursion'
  | 'breakfast-in-room'
  | 'diving'
  | 'Cater-transfer';

/**
 * Прогресс капчи отеля (последовательность выбранных элементов)
 */
export interface CaptchaProgress {
  selectedSequence: string[]; // Последовательность выбранных ID элементов капчи
  completedAt?: string; // Время завершения капчи
}

/**
 * Тип цепочки бронирования
 */
export type ChainType = 'standard' | 'custom' | 'action';

/**
 * Прогресс прохождения текущего отеля
 */
export interface CurrentHotelProgress {
  hotelId?: string;
  tempBookingForm: TempBookingFormData | null;
  floor?: number;
  roomNumber?: string;
  captchaProgress?: CaptchaProgress;
  startedAt: string;

  // Цепочка шагов и текущий шаг
  currentChain: string[];
  activeStep: string;
  bookingResult?: 'safe' | 'unsafe';
  currentChainIndex: number;
  chainType: ChainType;

  // Состояния для галереи, капчи, этажей
  galleryStates: Record<number, boolean>;
  galleryActionsTriggered: Record<number, boolean>;
  captchaCompleted: boolean;
  floorSelected: boolean;
  completedSteps: string[];
  captchaReason?: 'alien' | 'human';
  bookingMessage?: 'human' | 'alien'; // ← Тип сообщения о бронировании
}

/**
 * Статус бронирования комнаты
 */
export interface RoomBooking {
  roomId: string;
  roomName: string;
  roomNameEn: string;
  price: number;
  mealType: MealType;
  additionalServices: AdditionalService[];
  bookedAt: string;
}

/**
 * Информация об отеле
 */
export interface VisitedHotel {
  hotelId: string;
  hotelName: string;
  hotelNameEn: string;
  visitedAt: string;
  roomId?: number;
  completed: boolean;
}

/**
 * Полученный артефакт
 */
export interface CollectedArtefact {
  artefactId: string;
  name: string;
  nameEn: string;
  image: string;
  collectedAt: string;
}

/**
 * Статистика игрока
 */
export interface PlayerStats {
  totalHotelsVisited: number;
  totalRoomsBooked: number;
  totalSpent: number;
  artefactsCollected: number;
  gamesWon: number;
  gamesLost: number;
}

/**
 * Полный статус игрока
 */
export interface PlayerStatus {
  id: string;
  visitedHotels: VisitedHotel[];
  currentBooking: RoomBooking | null;
  currentHotelProgress: CurrentHotelProgress | null;
  collectedArtefacts: CollectedArtefact[];
  inventory: string[];
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}

/**
 * Начальный статус игрока
 */
const initialPlayerStatus: PlayerStatus = {
  id: 'local-player',
  visitedHotels: [],
  currentBooking: null,
  currentHotelProgress: null,
  collectedArtefacts: [],
  inventory: [],
  stats: {
    totalHotelsVisited: 0,
    totalRoomsBooked: 0,
    totalSpent: 0,
    artefactsCollected: 0,
    gamesWon: 0,
    gamesLost: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Контекст игры
 */
interface GameContextType {
  playerStatus: PlayerStatus;
  isLoading: boolean;
  // Методы для работы с бронированиями
  setCurrentBooking: (booking: RoomBooking | null) => void;
  clearCurrentBooking: () => void;
  // Методы для текущего прогресса отеля
  setCurrentHotelProgress: (progress: CurrentHotelProgress | null) => void;
  clearCurrentHotelProgress: () => void;
  getCurrentHotelProgress: () => CurrentHotelProgress | null;
  getCurrentHotelId: () => string | undefined;
  // Методы для временных данных формы бронирования
  saveTempBookingForm: (data: TempBookingFormData) => void;
  clearTempBookingForm: () => void;
  getTempBookingForm: () => TempBookingFormData | null;
  // Методы для капчи
  updateCaptchaProgress: (sequence: string[], completedAt?: string) => void;
  getCaptchaProgress: () => CaptchaProgress | undefined;
  clearCaptchaProgress: () => void;
  // Методы для управления цепочкой шагов
  setCurrentChain: (chain: string[], type: ChainType) => void;
  setActiveStep: (step: string) => void;
  nextChainStep: () => void;
  resetChainProgress: () => void;
  // Методы для состояний галереи, капчи, этажей
  setGalleryState: (imageIndex: number, toggled: boolean) => void;
  markGalleryActionTriggered: (imageIndex: number) => void;
  setCaptchaCompleted: (completed: boolean) => void;
  setFloorSelected: (selected: boolean) => void;
  setCompletedSteps: (steps: string[]) => void;
  // Методы для посещённых отелей
  addVisitedHotel: (hotel: VisitedHotel) => void;
  completeHotelVisit: (hotelId: string) => void;
  // Методы для артефактов
  addArtefact: (artefact: CollectedArtefact) => void;
  hasArtefact: (artefactId: string) => boolean;
  // Методы для инвентаря
  addToInventory: (item: string) => void;
  removeFromInventory: (item: string) => void;
  hasInInventory: (item: string) => boolean;
  // Методы для статистики
  incrementStat: (stat: keyof PlayerStats, amount?: number) => void;
  // Сброс прогресса
  resetProgress: () => void;
  // Сброс ID пользователя (для тестирования)
  resetUserId: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * Ключ для localStorage
 */
const STORAGE_KEY_USER_ID = 'unreal-rooms-user-id';
const STORAGE_KEY_PREFIX = 'unreal-rooms-player-';

/**
 * Получить или создать ID пользователя
 */
function getUserId(): string {
  if (typeof window === 'undefined') return 'local-player';

  let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY_USER_ID, userId);
  }
  return userId;
}

/**
 * Получить ключ localStorage для текущего пользователя
 */
function getUserStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Провайдер контекста игры
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>(() => getUserId());
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(() => {
    // Загрузка из localStorage для текущего пользователя
    if (typeof window !== 'undefined') {
      const storageKey = getUserStorageKey(userId);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Обновляем ID пользователя в загруженных данных
          return { ...parsed, id: userId };
        } catch {
          return { ...initialPlayerStatus, id: userId };
        }
      }
    }
    return { ...initialPlayerStatus, id: userId };
  });

  const [isLoading, setIsLoading] = useState(true);

  // Сохранение в localStorage при изменении статуса
  useEffect(() => {
    if (!isLoading) {
      const storageKey = getUserStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(playerStatus));
    }
  }, [playerStatus, isLoading, userId]);

  // Имитация загрузки (можно заменить на реальный API вызов)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Установить текущее бронирование
   */
  const setCurrentBooking = (booking: RoomBooking | null) => {
    setPlayerStatus((prev) => ({
      ...prev,
      currentBooking: booking,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Очистить текущее бронирование
   */
  const clearCurrentBooking = () => {
    setPlayerStatus((prev) => ({
      ...prev,
      currentBooking: null,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Установить прогресс текущего отеля
   */
  const setCurrentHotelProgress = (progress: CurrentHotelProgress | null) => {
    setPlayerStatus((prev) => {
      const isSame = JSON.stringify(prev.currentHotelProgress) === JSON.stringify(progress);
      if (isSame) {
        return prev;
      }
      return {
        ...prev,
        currentHotelProgress: progress,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Очистить прогресс текущего отеля
   */
  const clearCurrentHotelProgress = () => {
    setPlayerStatus((prev) => ({
      ...prev,
      currentHotelProgress: null,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Получить прогресс текущего отеля
   */
  const getCurrentHotelProgress = () => {
    return playerStatus.currentHotelProgress;
  };

  /**
   * Получить ID текущего отеля
   */
  const getCurrentHotelId = () => {
    return playerStatus.currentHotelProgress?.hotelId;
  };

  /**
   * Сохранить временные данные формы бронирования
   */
  const saveTempBookingForm = (data: TempBookingFormData) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) {
        return prev;
      }

      // Only update if data has actually changed to avoid unnecessary re-renders
      const hasChanged =
        JSON.stringify(prev.currentHotelProgress.tempBookingForm) !== JSON.stringify(data);
      if (!hasChanged) {
        return prev;
      }

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          tempBookingForm: data,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Очистить временные данные формы бронирования
   */
  const clearTempBookingForm = () => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) {
        return prev;
      }
      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          tempBookingForm: null,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Получить временные данные формы бронирования
   */
  const getTempBookingForm = () => {
    return playerStatus.currentHotelProgress?.tempBookingForm || null;
  };

  /**
   * Обновить прогресс капчи (последовательность выбранных элементов)
   */
  const updateCaptchaProgress = (sequence: string[], completedAt?: string) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) {
        return prev;
      }

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          captchaProgress: {
            selectedSequence: sequence,
            completedAt,
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Получить прогресс капчи
   */
  const getCaptchaProgress = () => {
    return playerStatus.currentHotelProgress?.captchaProgress;
  };

  /**
   * Очистить прогресс капчи
   */
  const clearCaptchaProgress = () => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) {
        return prev;
      }
      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          captchaProgress: undefined,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Добавить посещённый отель
   */
  const addVisitedHotel = (hotel: VisitedHotel) => {
    setPlayerStatus((prev) => {
      const exists = prev.visitedHotels.some((h) => h.hotelId === hotel.hotelId);
      if (exists) {
        return prev;
      }
      return {
        ...prev,
        visitedHotels: [...prev.visitedHotels, hotel],
        stats: {
          ...prev.stats,
          totalHotelsVisited: prev.stats.totalHotelsVisited + 1,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Отметить отель как пройденный
   */
  const completeHotelVisit = (hotelId: string) => {
    setPlayerStatus((prev) => ({
      ...prev,
      visitedHotels: prev.visitedHotels.map((h) =>
        h.hotelId === hotelId ? { ...h, completed: true } : h
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Добавить артефакт в коллекцию
   */
  const addArtefact = (artefact: CollectedArtefact) => {
    setPlayerStatus((prev) => {
      const exists = prev.collectedArtefacts.some((a) => a.artefactId === artefact.artefactId);
      if (exists) {
        return prev;
      }
      return {
        ...prev,
        collectedArtefacts: [...prev.collectedArtefacts, artefact],
        stats: {
          ...prev.stats,
          artefactsCollected: prev.stats.artefactsCollected + 1,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Проверить наличие артефакта
   */
  const hasArtefact = (artefactId: string) => {
    return playerStatus.collectedArtefacts.some((a) => a.artefactId === artefactId);
  };

  /**
   * Добавить предмет в инвентарь
   */
  const addToInventory = (item: string) => {
    setPlayerStatus((prev) => {
      if (prev.inventory.includes(item)) {
        return prev;
      }
      return {
        ...prev,
        inventory: [...prev.inventory, item],
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Удалить предмет из инвентаря
   */
  const removeFromInventory = (item: string) => {
    setPlayerStatus((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((i) => i !== item),
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Проверить наличие предмета в инвентаре
   */
  const hasInInventory = (item: string) => {
    return playerStatus.inventory.includes(item);
  };

  /**
   * Увеличить значение статистики
   */
  const incrementStat = (stat: keyof PlayerStats, amount = 1) => {
    setPlayerStatus((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: prev.stats[stat] + amount,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Сбросить весь прогресс
   */
  const resetProgress = () => {
    setPlayerStatus({
      ...initialPlayerStatus,
      id: playerStatus.id,
      createdAt: playerStatus.createdAt,
    });
  };

  /**
   * Сбросить ID пользователя (начать с новым пользователем)
   */
  const resetUserId = () => {
    localStorage.removeItem(STORAGE_KEY_USER_ID);
    const newId = getUserId();
    setUserId(newId);
    setPlayerStatus({ ...initialPlayerStatus, id: newId });
  };

  // ==================== Методы управления цепочкой ====================

  /**
   * Установить текущую цепочку шагов
   */
  const setCurrentChain = (chain: string[], type: ChainType) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;

      const hasChanged =
        JSON.stringify(prev.currentHotelProgress.currentChain) !== JSON.stringify(chain) ||
        prev.currentHotelProgress.chainType !== type;

      if (!hasChanged) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          currentChain: chain,
          chainType: type,
          currentChainIndex: 0,
          activeStep: chain[0] || 'hotelPage',
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Установить активный шаг
   */
  const setActiveStep = (step: string) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;
      if (prev.currentHotelProgress.activeStep === step) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          activeStep: step,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Перейти к следующему шагу цепочки
   */
  const nextChainStep = () => {
    setPlayerStatus((prev) => {
      const progress = prev.currentHotelProgress;
      if (!progress) return prev;

      const currentIndex = progress.currentChain.indexOf(progress.activeStep);
      if (currentIndex === -1 || currentIndex >= progress.currentChain.length - 1) {
        return prev;
      }

      const nextStep = progress.currentChain[currentIndex + 1];
      return {
        ...prev,
        currentHotelProgress: {
          ...progress,
          activeStep: nextStep,
          currentChainIndex: currentIndex + 1,
          completedSteps: [...progress.completedSteps, nextStep],
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Сбросить прогресс цепочки
   */
  const resetChainProgress = () => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          currentChain: [],
          activeStep: 'hotelPage',
          currentChainIndex: 0,
          chainType: 'standard',
          completedSteps: [],
          captchaCompleted: false,
          floorSelected: false,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // ==================== Методы управления состояниями ====================

  /**
   * Установить состояние галереи
   */
  const setGalleryState = (imageIndex: number, toggled: boolean) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          galleryStates: {
            ...prev.currentHotelProgress.galleryStates,
            [imageIndex]: toggled,
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Отметить действие галереи как выполненное
   */
  const markGalleryActionTriggered = (imageIndex: number) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;

      const newTriggered = { ...prev.currentHotelProgress.galleryActionsTriggered };
      delete newTriggered[imageIndex];

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          galleryActionsTriggered: newTriggered,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Установить статус завершения капчи
   */
  const setCaptchaCompleted = (completed: boolean) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;
      if (prev.currentHotelProgress.captchaCompleted === completed) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          captchaCompleted: completed,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Установить статус выбора этажа
   */
  const setFloorSelected = (selected: boolean) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;
      if (prev.currentHotelProgress.floorSelected === selected) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          floorSelected: selected,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Установить завершённые шаги
   */
  const setCompletedSteps = (steps: string[]) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;
      if (JSON.stringify(prev.currentHotelProgress.completedSteps) === JSON.stringify(steps)) {
        return prev;
      }

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          completedSteps: steps,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  return (
    <GameContext.Provider
      value={{
        playerStatus,
        isLoading,
        setCurrentBooking,
        clearCurrentBooking,
        setCurrentHotelProgress,
        clearCurrentHotelProgress,
        getCurrentHotelProgress,
        getCurrentHotelId,
        saveTempBookingForm,
        clearTempBookingForm,
        getTempBookingForm,
        updateCaptchaProgress,
        getCaptchaProgress,
        clearCaptchaProgress,
        setCurrentChain,
        setActiveStep,
        nextChainStep,
        resetChainProgress,
        setGalleryState,
        markGalleryActionTriggered,
        setCaptchaCompleted,
        setFloorSelected,
        setCompletedSteps,
        addVisitedHotel,
        completeHotelVisit,
        addArtefact,
        hasArtefact,
        addToInventory,
        removeFromInventory,
        hasInInventory,
        incrementStat,
        resetProgress,
        resetUserId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/**
 * Хук для использования контекста игры
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
