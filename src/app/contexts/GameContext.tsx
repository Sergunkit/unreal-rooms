import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import type { ModalConfig, TempBookingFormData } from '../data/hotels-data/hotelTypes';

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
  triggeredActions: Record<string, true | undefined>;
  captchaCompleted: boolean;
  floorSelected: boolean;
  completedSteps: string[];
  captchaReason?: 'alien' | 'human';
  bookingMessage?: 'human' | 'alien'; // ← Тип сообщения о бронировании
  activeModal?: ModalConfig | null;
  lostAndFoundItems: string[]; // ← Артефакты в lost & found
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
  favoriteHotelIds: string[];
  currentBooking: RoomBooking | null;
  currentHotelProgress: CurrentHotelProgress | null;
  inventory: string[];
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}

export interface PlacedLostAndFoundItem {
  artifactId: string;
  hotelId: string;
  placedAt: string;
  message?: string;
  messageEn?: string;
}

/**
 * Начальный статус игрока
 */
const initialPlayerStatus: PlayerStatus = {
  id: 'local-player',
  visitedHotels: [],
  favoriteHotelIds: [],
  currentBooking: null,
  currentHotelProgress: null,
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
  placedLostAndFoundItems: PlacedLostAndFoundItem[];
  addPlacedLostAndFoundItem: (item: PlacedLostAndFoundItem) => void;
  removePlacedLostAndFoundItem: (artifactId: string, hotelId: string) => void;
  accountSyncError: string | null;
  // Методы для работы с бронированиями
  setCurrentBooking: (booking: RoomBooking | null) => void;
  clearCurrentBooking: () => void;
  // Методы для текущего прогресса отеля
  setCurrentHotelProgress: (
    progress:
      | CurrentHotelProgress
      | null
      | ((prev: CurrentHotelProgress | null) => CurrentHotelProgress | null)
  ) => void;
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
  markActionTriggered: (actionId: string) => void;
  setCaptchaCompleted: (completed: boolean) => void;
  setFloorSelected: (selected: boolean) => void;
  setCompletedSteps: (steps: string[]) => void;
  // Методы для посещённых отелей
  addVisitedHotel: (hotel: VisitedHotel) => void;
  completeHotelVisit: (hotelId: string, hotelName?: string, hotelNameEn?: string) => void;
  addFavoriteHotel: (hotelId: string) => void;
  // Методы для инвентаря
  addToInventory: (item: string) => void;
  removeFromInventory: (item: string) => void;
  hasInInventory: (item: string) => boolean;
  // Методы для Lost & Found артефактов
  addToLostAndFound: (artefactId: string) => void;
  hasInLostAndFound: (artefactId: string) => boolean;
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
const STORAGE_KEY_LOST_AND_FOUND = 'unreal-rooms-lost-and-found';

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

function loadGuestPlayerStatus(userId: string): PlayerStatus {
  const saved = localStorage.getItem(getUserStorageKey(userId));
  if (!saved) return { ...initialPlayerStatus, id: userId };
  try {
    const status: unknown = JSON.parse(saved);
    return isPlayerStatus(status)
      ? normalizePlayerStatus(status, userId)
      : { ...initialPlayerStatus, id: userId };
  } catch {
    return { ...initialPlayerStatus, id: userId };
  }
}

function loadPlacedLostAndFoundItems(): PlacedLostAndFoundItem[] {
  const saved = localStorage.getItem(STORAGE_KEY_LOST_AND_FOUND);
  if (!saved) return [];
  try {
    const items: unknown = JSON.parse(saved);
    return Array.isArray(items) ? (items as PlacedLostAndFoundItem[]) : [];
  } catch {
    return [];
  }
}

function isPlayerStatus(value: unknown): value is PlayerStatus {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'inventory' in value &&
    Array.isArray(value.inventory) &&
    'visitedHotels' in value &&
    Array.isArray(value.visitedHotels)
  );
}

function normalizePlayerStatus(status: PlayerStatus, id = status.id): PlayerStatus {
  const favoriteHotelIds = Array.isArray(status.favoriteHotelIds) ? status.favoriteHotelIds : [];
  const completedHotelIds = new Set(
    status.visitedHotels.filter((hotel) => hotel.completed).map((hotel) => hotel.hotelId)
  );
  return {
    ...status,
    id,
    favoriteHotelIds: [...new Set(favoriteHotelIds)].filter(
      (hotelId): hotelId is string => typeof hotelId === 'string' && !completedHotelIds.has(hotelId)
    ),
  };
}

async function accountStateRequest(method: 'GET' | 'PUT', state?: unknown): Promise<unknown> {
  const response = await fetch('/api/account/state', {
    method,
    headers: method === 'PUT' ? { 'Content-Type': 'application/json' } : undefined,
    body: method === 'PUT' ? JSON.stringify(state) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Не удалось синхронизировать прогресс аккаунта (${response.status}).`);
  }
  return response.json();
}

/**
 * Провайдер контекста игры
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [userId, setUserId] = useState<string>(() => getUserId());
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(() =>
    loadGuestPlayerStatus(userId)
  );
  const [placedLostAndFoundItems, setPlacedLostAndFoundItems] = useState<PlacedLostAndFoundItem[]>(
    () => loadPlacedLostAndFoundItems()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hydratedScope, setHydratedScope] = useState<string | null>(null);
  const [accountSyncError, setAccountSyncError] = useState<string | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const currentScope =
    auth.status === 'authenticated' && auth.user
      ? `account:${auth.user.id}`
      : auth.status === 'guest'
        ? 'guest'
        : null;

  useEffect(() => {
    if (!currentScope) return;

    let active = true;
    setIsLoading(true);
    setAccountSyncError(null);
    setHydratedScope(null);

    async function hydrateState() {
      try {
        if (auth.status === 'authenticated' && auth.user) {
          const response = (await accountStateRequest('GET')) as { state: unknown };
          if (!active) return;

          if (response.state === null) {
            const guestStatus = loadGuestPlayerStatus(userId);
            const guestLostAndFound = loadPlacedLostAndFoundItems();
            const migratedStatus = normalizePlayerStatus(guestStatus, auth.user.id);
            const migratedState = {
              playerStatus: migratedStatus,
              lostAndFoundItems: guestLostAndFound,
            };
            await accountStateRequest('PUT', migratedState);
            if (!active) return;
            setPlayerStatus(migratedStatus);
            setPlacedLostAndFoundItems(guestLostAndFound);
          } else if (
            typeof response.state === 'object' &&
            response.state !== null &&
            'playerStatus' in response.state &&
            isPlayerStatus(response.state.playerStatus) &&
            'lostAndFoundItems' in response.state &&
            Array.isArray(response.state.lostAndFoundItems)
          ) {
            const accountState = response.state as {
              playerStatus: PlayerStatus;
              lostAndFoundItems: PlacedLostAndFoundItem[];
            };
            setPlayerStatus(normalizePlayerStatus(accountState.playerStatus, auth.user.id));
            setPlacedLostAndFoundItems(accountState.lostAndFoundItems);
          } else {
            throw new Error('Сохранение аккаунта имеет неверный формат.');
          }
        } else {
          setPlayerStatus(loadGuestPlayerStatus(userId));
          setPlacedLostAndFoundItems(loadPlacedLostAndFoundItems());
        }

        if (active) {
          setHydratedScope(currentScope);
          setIsLoading(false);
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : String(error);
          setAccountSyncError(message);
          setIsLoading(false);
          toast.error(message);
        }
      }
    }

    void hydrateState();
    return () => {
      active = false;
    };
  }, [auth.status, auth.user, currentScope, userId]);

  useEffect(() => {
    if (!currentScope || hydratedScope !== currentScope || isLoading) return;

    const snapshot = { playerStatus, lostAndFoundItems: placedLostAndFoundItems };
    if (currentScope === 'guest') {
      localStorage.setItem(getUserStorageKey(userId), JSON.stringify(playerStatus));
      localStorage.setItem(STORAGE_KEY_LOST_AND_FOUND, JSON.stringify(placedLostAndFoundItems));
      return;
    }

    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(async () => {
        await accountStateRequest('PUT', snapshot);
        setAccountSyncError(null);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        setAccountSyncError(message);
        toast.error(message);
      });
  }, [currentScope, hydratedScope, isLoading, playerStatus, placedLostAndFoundItems, userId]);

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
  const setCurrentHotelProgress = (
    progress:
      | CurrentHotelProgress
      | null
      | ((prev: CurrentHotelProgress | null) => CurrentHotelProgress | null)
  ) => {
    setPlayerStatus((prev) => {
      const newProgress =
        typeof progress === 'function' ? progress(prev.currentHotelProgress) : progress;
      const isSame = JSON.stringify(prev.currentHotelProgress) === JSON.stringify(newProgress);
      if (isSame) {
        return prev;
      }
      return {
        ...prev,
        currentHotelProgress: newProgress,
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
        favoriteHotelIds: hotel.completed
          ? prev.favoriteHotelIds.filter((hotelId) => hotelId !== hotel.hotelId)
          : prev.favoriteHotelIds,
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
  const completeHotelVisit = (hotelId: string, hotelName?: string, hotelNameEn?: string) => {
    setPlayerStatus((prev) => {
      const existing = prev.visitedHotels.find((hotel) => hotel.hotelId === hotelId);
      if (existing?.completed && !prev.favoriteHotelIds.includes(hotelId)) return prev;

      const completedHotel: VisitedHotel = {
        hotelId,
        hotelName: hotelName ?? existing?.hotelName ?? hotelId,
        hotelNameEn: hotelNameEn ?? existing?.hotelNameEn ?? hotelId,
        visitedAt: existing?.visitedAt ?? new Date().toISOString(),
        ...(existing?.roomId !== undefined ? { roomId: existing.roomId } : {}),
        completed: true,
      };

      return {
        ...prev,
        visitedHotels: existing
          ? prev.visitedHotels.map((hotel) => (hotel.hotelId === hotelId ? completedHotel : hotel))
          : [...prev.visitedHotels, completedHotel],
        favoriteHotelIds: prev.favoriteHotelIds.filter((favoriteId) => favoriteId !== hotelId),
        stats: existing
          ? prev.stats
          : { ...prev.stats, totalHotelsVisited: prev.stats.totalHotelsVisited + 1 },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const addFavoriteHotel = (hotelId: string) => {
    setPlayerStatus((prev) => {
      const completed = prev.visitedHotels.some(
        (hotel) => hotel.hotelId === hotelId && hotel.completed
      );
      if (completed || prev.favoriteHotelIds.includes(hotelId)) return prev;
      return {
        ...prev,
        favoriteHotelIds: [...prev.favoriteHotelIds, hotelId],
        updatedAt: new Date().toISOString(),
      };
    });
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
        stats: {
          ...prev.stats,
          artefactsCollected: prev.stats.artefactsCollected + 1,
        },
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

  const addPlacedLostAndFoundItem = (item: PlacedLostAndFoundItem) => {
    setPlacedLostAndFoundItems((items) => {
      const exists = items.some(
        (existing) => existing.artifactId === item.artifactId && existing.hotelId === item.hotelId
      );
      return exists ? items : [...items, item];
    });
  };

  const removePlacedLostAndFoundItem = (artifactId: string, hotelId: string) => {
    setPlacedLostAndFoundItems((items) =>
      items.filter((item) => !(item.artifactId === artifactId && item.hotelId === hotelId))
    );
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
    setPlacedLostAndFoundItems([]);
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
  const setGalleryState = (
    imageIndexOrFn: number | ((prev: Record<number, boolean>) => Record<number, boolean>),
    toggled?: boolean
  ) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;

      if (typeof imageIndexOrFn === 'function') {
        // Функциональное обновление
        const newGalleryStates = imageIndexOrFn(prev.currentHotelProgress.galleryStates || {});
        return {
          ...prev,
          currentHotelProgress: {
            ...prev.currentHotelProgress,
            galleryStates: newGalleryStates,
          },
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Прямое обновление
        const imageIndex = imageIndexOrFn;
        return {
          ...prev,
          currentHotelProgress: {
            ...prev.currentHotelProgress,
            galleryStates: {
              ...prev.currentHotelProgress.galleryStates,
              [imageIndex]: toggled ?? false,
            },
          },
          updatedAt: new Date().toISOString(),
        };
      }
    });
  };

  /**
   * Отметить действие как выполненное (для отслеживания пасхалок и ограничения повторений)
   */
  const markActionTriggered = (actionId: string) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          triggeredActions: {
            ...prev.currentHotelProgress.triggeredActions,
            [actionId]: true,
          },
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

  /**
   * Добавить артефакт в Lost & Found текущего отеля
   */
  const addToLostAndFound = (artefactId: string) => {
    setPlayerStatus((prev) => {
      if (!prev.currentHotelProgress) return prev;
      const items = prev.currentHotelProgress.lostAndFoundItems || [];
      if (items.includes(artefactId)) return prev;

      return {
        ...prev,
        currentHotelProgress: {
          ...prev.currentHotelProgress,
          lostAndFoundItems: [...items, artefactId],
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  /**
   * Проверить наличие артефакта в Lost & Found текущего отеля
   */
  const hasInLostAndFound = (artefactId: string) => {
    return (playerStatus.currentHotelProgress?.lostAndFoundItems || []).includes(artefactId);
  };

  return (
    <GameContext.Provider
      value={{
        playerStatus,
        isLoading,
        placedLostAndFoundItems,
        addPlacedLostAndFoundItem,
        removePlacedLostAndFoundItem,
        accountSyncError,
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
        markActionTriggered,
        setCaptchaCompleted,
        setFloorSelected,
        setCompletedSteps,
        addVisitedHotel,
        completeHotelVisit,
        addFavoriteHotel,
        addToInventory,
        removeFromInventory,
        hasInInventory,
        addToLostAndFound,
        hasInLostAndFound,
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
