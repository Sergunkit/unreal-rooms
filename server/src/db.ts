import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.GAME_DB ?? join(__dirname, '..', 'data', 'game.db');

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL DEFAULT (datetime('now', '+90 days'))
  );

  CREATE TABLE IF NOT EXISTS progress (
    session_id TEXT NOT NULL REFERENCES sessions(token) ON DELETE CASCADE,
    hotel      TEXT NOT NULL,
    step_id    TEXT NOT NULL,
    attempts   INTEGER NOT NULL DEFAULT 0,
    hints_used INTEGER NOT NULL DEFAULT 0,
    solved     INTEGER NOT NULL DEFAULT 0,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (session_id, hotel)
  );

  CREATE TABLE IF NOT EXISTS hotel_catalog (
    hotel_id TEXT PRIMARY KEY,
    hotel_json TEXT NOT NULL CHECK (json_valid(hotel_json)),
    chain_json TEXT NOT NULL CHECK (json_valid(chain_json))
  );

  CREATE TABLE IF NOT EXISTS artifact_catalog (
    artifact_id TEXT PRIMARY KEY,
    artifact_json TEXT NOT NULL CHECK (json_valid(artifact_json))
  );

  CREATE TABLE IF NOT EXISTS catalog_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    nickname_key TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions(user_id);

  CREATE TABLE IF NOT EXISTS account_states (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    state_json TEXT NOT NULL CHECK (json_valid(state_json)),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function createSession(): string {
  const token = crypto.randomUUID();
  db.prepare('INSERT INTO sessions (token) VALUES (?)').run(token);
  return token;
}

export function sessionExists(token: string): boolean {
  return !!db
    .prepare("SELECT 1 FROM sessions WHERE token = ? AND expires_at > datetime('now')")
    .get(token);
}
