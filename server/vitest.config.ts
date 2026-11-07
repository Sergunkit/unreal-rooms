import { defineConfig } from 'vitest/config';

// Запуск из корня репо: `vitest run --config server/vitest.config.ts`
export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/tests/**/*.test.ts'],
    setupFiles: ['server/tests/setup.ts'],
    // Один воркер (Vitest 4: poolOptions больше нет): на слабых VPS
    // параллельный спавн воркеров стабильно не успевает стартовать.
    maxWorkers: 1,
  },
});
