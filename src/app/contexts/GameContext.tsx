import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
 * Временные данные формы бронирования (сохраняются между переходами)
 */
export interface TempBookingFormData {
  guests: number;
  rooms: number;
  roomType: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  mealType: string;
  needTransfer: boolean;
  checkInTime: string;
  selectedServices: string[];
  promoCode?: string;
}

/**
 * Прогресс капчи отеля (последовательность выбранных элементов)
 */
export interface CaptchaProgress {
  selectedSequence: string[]; // Последовательность выбранных ID элементов капчи
  completedAt?: string; // Время завершения капчи
}

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
  flowState?: import('../hooks/useHotelFlow').FlowState;
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
  // Методы для временных данных формы бронирования
  saveTempBookingForm: (data: TempBookingFormData) => void;
  clearTempBookingForm: () => void;
  getTempBookingForm: () => TempBookingFormData | null;
  // Методы для капчи
  updateCaptchaProgress: (sequence: string[], completedAt?: string) => void;
  getCaptchaProgress: () => CaptchaProgress | undefined;
  clearCaptchaProgress: () => void;
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
    setPlayerStatus((prev) => ({
      ...prev,
      currentHotelProgress: progress,
      updatedAt: new Date().toISOString(),
    }));
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
   * Сохранить временные данные формы бронирования
   */
  const saveTempBookingForm = (data: TempBookingFormData) => {
    setPlayerStatus((prev) => {
      const currentProgress = prev.currentHotelProgress || {
        tempBookingForm: null,
        startedAt: new Date().toISOString(),
      };

      // Only update if data has actually changed to avoid unnecessary re-renders
      const hasChanged = JSON.stringify(currentProgress.tempBookingForm) !== JSON.stringify(data);
      if (!hasChanged) {
        return prev;
      }

      return {
        ...prev,
        currentHotelProgress: {
          ...currentProgress,
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
      const currentProgress = prev.currentHotelProgress || {
        tempBookingForm: null,
        startedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        currentHotelProgress: {
          ...currentProgress,
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
        saveTempBookingForm,
        clearTempBookingForm,
        getTempBookingForm,
        updateCaptchaProgress,
        getCaptchaProgress,
        clearCaptchaProgress,
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
