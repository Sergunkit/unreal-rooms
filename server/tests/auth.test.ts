import { describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';

/** Регистрирует пользователя и возвращает значение cookie сессии. */
async function register(nickname: string, password = 'correct horse battery'): Promise<Response> {
  return app.request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password }),
  });
}

function sessionCookie(res: Response): string {
  const setCookie = res.headers.get('set-cookie');
  expect(setCookie).toBeTruthy();
  return setCookie!.split(';')[0];
}

describe('POST /api/auth/register', () => {
  it('creates a user and issues a session cookie', async () => {
    const res = await register('Пионер-Электрон');
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.user.nickname).toBe('Пионер-Электрон');
    expect(sessionCookie(res)).toMatch(/^unreal_rooms_session=/);
  });

  it('rejects duplicate nicknames case-insensitively', async () => {
    await register('DupCheck');
    const res = await register('dupcheck');
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('nickname_taken');
  });

  it('rejects a too-short nickname', async () => {
    const res = await register('ab');
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_nickname');
  });

  it('rejects a nickname with disallowed characters', async () => {
    const res = await register('bad nickname!');
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_nickname');
  });

  it('rejects a short password', async () => {
    const res = await register('ShortPassUser', 'short');
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_password');
  });

  it('requires nickname and password fields', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: 'NoPasswordUser' }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('nickname_and_password_required');
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials (case-insensitive nickname)', async () => {
    await register('LoginUser');
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: 'loginuser', password: 'correct horse battery' }),
    });
    expect(res.status).toBe(200);
    expect((await res.json()).user.nickname).toBe('LoginUser');
  });

  it('rejects a wrong password', async () => {
    await register('WrongPassUser');
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: 'WrongPassUser', password: 'definitely-not-it' }),
    });
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('invalid_credentials');
  });
});

describe('GET /api/auth/me + logout', () => {
  it('returns null user without a cookie', async () => {
    const res = await app.request('/api/auth/me');
    expect(res.status).toBe(200);
    expect((await res.json()).user).toBeNull();
  });

  it('returns the user for a valid session and null after logout', async () => {
    const regRes = await register('MeLogoutUser');
    const cookie = sessionCookie(regRes);

    const meRes = await app.request('/api/auth/me', { headers: { Cookie: cookie } });
    expect((await meRes.json()).user.nickname).toBe('MeLogoutUser');

    const logoutRes = await app.request('/api/auth/logout', {
      method: 'POST',
      headers: { Cookie: cookie },
    });
    expect(logoutRes.status).toBe(200);

    const afterRes = await app.request('/api/auth/me', { headers: { Cookie: cookie } });
    expect((await afterRes.json()).user).toBeNull();
  });
});

describe('GET/PUT /api/account/state', () => {
  it('requires authentication', async () => {
    const res = await app.request('/api/account/state');
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('authentication_required');
  });

  it('round-trips the player state', async () => {
    const cookie = sessionCookie(await register('StateUser'));

    const emptyRes = await app.request('/api/account/state', { headers: { Cookie: cookie } });
    expect((await emptyRes.json()).state).toBeNull();

    const state = { playerStatus: { money: 450, artefacts: ['gold-coin'] }, lostAndFoundItems: [] };
    const putRes = await app.request('/api/account/state', {
      method: 'PUT',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
    expect(putRes.status).toBe(200);
    expect((await putRes.json()).ok).toBe(true);

    const getRes = await app.request('/api/account/state', { headers: { Cookie: cookie } });
    expect((await getRes.json()).state).toEqual(state);
  });

  it('rejects a state without playerStatus/lostAndFoundItems', async () => {
    const cookie = sessionCookie(await register('StateInvalidUser'));
    const res = await app.request('/api/account/state', {
      method: 'PUT',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ something: 'else' }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_state');
  });

  it('rejects cross-site state writes', async () => {
    const cookie = sessionCookie(await register('StateCrossSiteUser'));
    const res = await app.request('/api/account/state', {
      method: 'PUT',
      headers: {
        Cookie: cookie,
        'Content-Type': 'application/json',
        'sec-fetch-site': 'cross-site',
      },
      body: JSON.stringify({ playerStatus: {}, lostAndFoundItems: [] }),
    });
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('cross_site_request_rejected');
  });
});
