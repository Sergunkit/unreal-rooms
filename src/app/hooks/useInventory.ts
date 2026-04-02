import { useCallback, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { getArtefactById, type Artefact } from '../data/artefacts';

/**
 * Результат добавления артефакта в инвентарь
 */
export interface AddToInventoryResult {
  success: boolean;
  isFull?: boolean;
  alreadyExists?: boolean;
}

/**
 * Хук для управления инвентарем (чемоданом)
 * Предоставляет методы для управления артефактами с ограничением в 9 слотов
 */
export function useInventory() {
  const { playerStatus, addToInventory, removeFromInventory, hasInInventory } = useGame();

  const inventory = playerStatus.inventory;

  /**
   * Проверка, заполнен ли инвентарь
   */
  const isFull = useMemo(() => {
    return inventory.length >= 9;
  }, [inventory.length]);

  /**
   * Количество свободных слотов
   */
  const availableSlots = useMemo(() => {
    return 9 - inventory.length;
  }, [inventory.length]);

  /**
   * Добавить артефакт в инвентарь с проверкой лимита
   * @param artifactId ID артефакта
   * @returns Результат операции
   */
  const addArtifact = useCallback(
    (artifactId: string): AddToInventoryResult => {
      // Уже есть в инвентаре
      if (hasInInventory(artifactId)) {
        return { success: false, alreadyExists: true };
      }

      // Инвентарь полон
      if (isFull) {
        return { success: false, isFull: true };
      }

      // Добавляем
      addToInventory(artifactId);
      return { success: true };
    },
    [isFull, hasInInventory, addToInventory]
  );

  /**
   * Удалить артефакт из инвентаря
   * @param artifactId ID артефакта
   */
  const removeArtifact = useCallback(
    (artifactId: string) => {
      removeFromInventory(artifactId);
    },
    [removeFromInventory]
  );

  /**
   * Проверить наличие артефакта в инвентаре
   * @param artifactId ID артефакта
   */
  const hasArtifact = useCallback(
    (artifactId: string) => {
      return hasInInventory(artifactId);
    },
    [hasInInventory]
  );

  /**
   * Получить все артефакты в инвентаре
   */
  const getInventoryArtifacts = useCallback((): Artefact[] => {
    return inventory
      .map((id) => getArtefactById(id))
      .filter((artefact): artefact is Artefact => artefact !== undefined);
  }, [inventory]);

  /**
   * Получить ID всех артефактов в инвентаре
   */
  const getInventoryIds = useCallback(() => {
    return [...inventory];
  }, [inventory]);

  return {
    // Данные
    inventory,
    isFull,
    availableSlots,

    // Методы
    addArtifact,
    removeArtifact,
    hasArtifact,
    getInventoryArtifacts,
    getInventoryIds,
  };
}
