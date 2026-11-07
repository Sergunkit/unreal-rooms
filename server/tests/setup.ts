import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Должно выполниться ДО импорта db.ts (он читает GAME_DB на верхнем уровне):
// каждый тестовый файл получает свою временную SQLite-базу.
process.env.NODE_ENV = 'test';
process.env.GAME_DB = join(mkdtempSync(join(tmpdir(), 'unreal-rooms-test-')), 'game.db');
