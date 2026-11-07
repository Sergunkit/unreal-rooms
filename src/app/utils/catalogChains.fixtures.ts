import { readFileSync } from 'node:fs';
import type { Chain } from '../data/hotels-data/hotelTypes';

// jsdom в vitest подменяет import.meta.url на http-URL, а vitest всегда
// запускается из корня репо — относительный путь читается от cwd.
const catalogPath = 'server/catalog/catalog.json';

/**
 * Загружает РЕАЛЬНУЮ цепочку отеля из серверного каталога.
 * Тесты идут по тем же данным, что и прод-фронт, — без ручных фикстур.
 */
export function loadCatalogChain(hotelId: string): Chain {
  const catalog: unknown = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const chains = (catalog as { chains: Record<string, unknown> }).chains;
  const chain = chains[hotelId];
  if (!chain) throw new Error(`catalog: chain for hotel ${hotelId} not found`);
  return chain as Chain;
}

/** Шаг цепочки по id (с проверкой, что он существует). */
export function chainStep(chain: Chain, stepId: string) {
  const step = chain.steps[stepId];
  if (!step) throw new Error(`chain ${chain.hotelId}: step "${stepId}" not found`);
  return step;
}

/** Действие шага по id (с проверкой). */
export function chainAction(chain: Chain, stepId: string, actionId: string) {
  const actions = chainStep(chain, stepId).actions ?? [];
  const action = actions.find((a) => a.id === actionId);
  if (!action) throw new Error(`chain ${chain.hotelId}: action "${actionId}" not found`);
  return action;
}
