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
 * Статус бронирования комнаты
 */
export interface RoomBooking {
  roomId: number;
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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * Ключ для localStorage
 */
const STORAGE_KEY = 'unreal-rooms-player-status';

/**
 * Провайдер контекста игры
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(() => {
    // Загрузка из localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialPlayerStatus;
        }
      }
    }
    return initialPlayerStatus;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Сохранение в localStorage при изменении статуса
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerStatus));
    }
  }, [playerStatus, isLoading]);

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

  return (
    <GameContext.Provider
      value={{
        playerStatus,
        isLoading,
        setCurrentBooking,
        clearCurrentBooking,
        addVisitedHotel,
        completeHotelVisit,
        addArtefact,
        hasArtefact,
        addToInventory,
        removeFromInventory,
        hasInInventory,
        incrementStat,
        resetProgress,
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
