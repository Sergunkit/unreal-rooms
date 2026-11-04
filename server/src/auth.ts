import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import type { Context, Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { db } from './db.ts';

const SESSION_COOKIE = 'unreal_rooms_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const MAX_STATE_BYTES = 1_000_000;

interface PublicUser {
  id: string;
  nickname: string;
}

interface UserRow extends PublicUser {
  nickname_key: string;
  password_hash: string;
}

function derivePasswordKey(password: string, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, { maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function normalizeNickname(nickname: string): string {
  return nickname.normalize('NFKC').trim();
}

function validNickname(nickname: string): boolean {
  const length = [...nickname].length;
  return length >= 3 && length <= 24 && /^[\p{L}\p{N}_-]+$/u.test(nickname);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derivePasswordKey(password, salt, 64);
  return `${salt.toString('base64url')}:${key.toString('base64url')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltValue, keyValue] = storedHash.split(':');
  if (!saltValue || !keyValue) return false;

  const salt = Buffer.from(saltValue, 'base64url');
  const expectedKey = Buffer.from(keyValue, 'base64url');
  const actualKey = await derivePasswordKey(password, salt, expectedKey.length);

  return timingSafeEqual(actualKey, expectedKey);
}

function setSessionCookie(c: Context, token: string): void {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

function issueSession(c: Context, userId: string): void {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
  db.prepare('INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
    hashSessionToken(token),
    userId,
    expiresAt
  );
  setSessionCookie(c, token);
}

export function getAuthenticatedUser(c: Context): PublicUser | null {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return null;

  const row = db
    .prepare(
      `SELECT users.id, users.nickname
       FROM auth_sessions
       JOIN users ON users.id = auth_sessions.user_id
       WHERE auth_sessions.token_hash = ? AND auth_sessions.expires_at > datetime('now')`
    )
    .get(hashSessionToken(token)) as PublicUser | undefined;

  return row ?? null;
}

function invalidCookie(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
}

async function readJsonBody(c: Context): Promise<unknown> {
  try {
    return await c.req.json();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function registerAuthRoutes(app: Hono): void {
  app.post('/api/auth/register', async (c) => {
    const body = await readJsonBody(c);
    if (!isRecord(body) || typeof body.nickname !== 'string' || typeof body.password !== 'string') {
      return c.json({ error: 'nickname_and_password_required' }, 400);
    }

    const nickname = normalizeNickname(body.nickname);
    const nicknameKey = nickname.toLocaleLowerCase();
    if (!validNickname(nickname)) {
      return c.json(
        { error: 'invalid_nickname', message: 'Никнейм: 3–24 буквы, цифры, _ или -.' },
        400
      );
    }
    if (body.password.length < 8 || body.password.length > 128) {
      return c.json(
        { error: 'invalid_password', message: 'Пароль должен содержать от 8 до 128 символов.' },
        400
      );
    }

    const existing = db.prepare('SELECT 1 FROM users WHERE nickname_key = ?').get(nicknameKey);
    if (existing) return c.json({ error: 'nickname_taken' }, 409);

    const user: PublicUser = { id: randomUUID(), nickname };
    const passwordHash = await hashPassword(body.password);
    try {
      db.prepare(
        'INSERT INTO users (id, nickname, nickname_key, password_hash) VALUES (?, ?, ?, ?)'
      ).run(user.id, user.nickname, nicknameKey, passwordHash);
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        return c.json({ error: 'nickname_taken' }, 409);
      }
      throw error;
    }

    issueSession(c, user.id);
    return c.json({ user }, 201);
  });

  app.post('/api/auth/login', async (c) => {
    const body = await readJsonBody(c);
    if (!isRecord(body) || typeof body.nickname !== 'string' || typeof body.password !== 'string') {
      return c.json({ error: 'nickname_and_password_required' }, 400);
    }

    const nickname = normalizeNickname(body.nickname);
    const user = db
      .prepare('SELECT id, nickname, nickname_key, password_hash FROM users WHERE nickname_key = ?')
      .get(nickname.toLocaleLowerCase()) as UserRow | undefined;

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return c.json({ error: 'invalid_credentials' }, 401);
    }

    issueSession(c, user.id);
    return c.json({ user: { id: user.id, nickname: user.nickname } });
  });

  app.get('/api/auth/me', (c) => {
    const user = getAuthenticatedUser(c);
    if (!user) {
      invalidCookie(c);
      return c.json({ user: null });
    }
    return c.json({ user });
  });

  app.post('/api/auth/logout', (c) => {
    const token = getCookie(c, SESSION_COOKIE);
    if (token) {
      db.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').run(hashSessionToken(token));
    }
    invalidCookie(c);
    return c.json({ ok: true });
  });

  app.get('/api/account/state', (c) => {
    const user = getAuthenticatedUser(c);
    if (!user) return c.json({ error: 'authentication_required' }, 401);

    const row = db
      .prepare('SELECT state_json FROM account_states WHERE user_id = ?')
      .get(user.id) as { state_json: string } | undefined;
    return c.json({ state: row ? JSON.parse(row.state_json) : null });
  });

  app.put('/api/account/state', async (c) => {
    const user = getAuthenticatedUser(c);
    if (!user) return c.json({ error: 'authentication_required' }, 401);

    const body = await c.req.text();
    if (Buffer.byteLength(body) > MAX_STATE_BYTES) {
      return c.json({ error: 'state_too_large' }, 413);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      return c.json({ error: 'invalid_json' }, 400);
    }
    if (
      !isRecord(payload) ||
      !isRecord(payload.playerStatus) ||
      !Array.isArray(payload.lostAndFoundItems)
    ) {
      return c.json({ error: 'invalid_state' }, 400);
    }

    const state = JSON.stringify(payload);
    db.prepare(
      `INSERT INTO account_states (user_id, state_json, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET
         state_json = excluded.state_json,
         updated_at = datetime('now')`
    ).run(user.id, state);

    return c.json({ ok: true });
  });
}
