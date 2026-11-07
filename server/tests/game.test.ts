import { describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { getHotel, getStep } from '../src/content.ts';

/** Регистрирует пользователя и возвращает ответ (201 с cookie). */
async function register(nickname: string, password = 'correct horse battery'): Promise<Response> {
  return app.request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password }),
  });
}

/** Достаёт значение cookie сессии из ответа регистрации. */
function sessionCookie(res: Response): string {
  const setCookie = res.headers.get('set-cookie');
  expect(setCookie).toBeTruthy();
  return setCookie!.split(';')[0];
}

const hotel = getHotel('dolphin')!;
const entryStep = getStep(hotel, hotel.entryStep);
const correctAnswer = entryStep.answers[0].accept[0];

async function createSession(): Promise<string> {
  const res = await app.request('/api/game/session', { method: 'POST' });
  expect(res.status).toBe(200);
  const { token } = await res.json();
  expect(typeof token).toBe('string');
  return token;
}

function bearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

describe('health / catalog', () => {
  it('answers health check', async () => {
    const res = await app.request('/api/game/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('lists hotels with public metadata', async () => {
    const res = await app.request('/api/game/hotels');
    expect(res.status).toBe(200);
    const hotels = await res.json();
    expect(hotels.length).toBeGreaterThan(0);
    for (const h of hotels) {
      expect(h).toHaveProperty('slug');
      expect(h).toHaveProperty('name');
    }
  });

  it('serves a catalog with hotels, chains and artefacts', async () => {
    const res = await app.request('/api/game/catalog');
    expect(res.status).toBe(200);
    const catalog = await res.json();
    expect(Object.keys(catalog.hotels).length).toBeGreaterThan(0);
    expect(Object.keys(catalog.chains).length).toBeGreaterThan(0);
    expect(Object.keys(catalog.artefacts).length).toBeGreaterThan(0);
  });
});

describe('GET /api/game/state/:slug', () => {
  it('rejects requests without a valid token', async () => {
    const res = await app.request('/api/game/state/dolphin');
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('invalid_session');
  });

  it('returns 404 for an unknown hotel', async () => {
    const token = await createSession();
    const res = await app.request('/api/game/state/no-such-hotel', {
      headers: bearer(token),
    });
    expect(res.status).toBe(404);
  });

  it('starts a new session at the entry step without leaking answers', async () => {
    const token = await createSession();
    const res = await app.request('/api/game/state/dolphin', { headers: bearer(token) });
    expect(res.status).toBe(200);
    const step = await res.json();
    expect(step.stepId).toBe(hotel.entryStep);
    expect(step.solved).toBe(false);
    expect(step.hintsUsed).toBe(0);
    expect(step.hintsTotal).toBe(entryStep.hints?.length ?? 0);
    expect(JSON.stringify(step)).not.toContain(JSON.stringify(entryStep.answers[0].accept[0]));
  });

  it('persists progress between state calls', async () => {
    const token = await createSession();
    await app.request('/api/game/answer/dolphin', {
      method: 'POST',
      headers: bearer(token),
      body: JSON.stringify({ answer: 'intentionally-wrong' }),
    });
    const res = await app.request('/api/game/state/dolphin', { headers: bearer(token) });
    const step = await res.json();
    expect(step.stepId).toBe(hotel.entryStep);
  });
});

describe('POST /api/game/answer/:slug', () => {
  it('requires an answer in the body', async () => {
    const token = await createSession();
    const res = await app.request('/api/game/answer/dolphin', {
      method: 'POST',
      headers: bearer(token),
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('answer_required');
  });

  it('counts a wrong answer as an attempt', async () => {
    const token = await createSession();
    const res = await app.request('/api/game/answer/dolphin', {
      method: 'POST',
      headers: bearer(token),
      body: JSON.stringify({ answer: 'intentionally-wrong' }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ correct: false, attempts: 1 });
  });

  it('accepts the correct answer and advances to the next step', async () => {
    const token = await createSession();
    const res = await app.request('/api/game/answer/dolphin', {
      method: 'POST',
      headers: bearer(token),
      body: JSON.stringify({ answer: correctAnswer }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.correct).toBe(true);
    expect(body.next).toBeTruthy();
    expect(body.next.stepId).not.toBe(hotel.entryStep);
    // Не решён последний шаг — solved не выставляется
    expect(body.solved).toBe(false);
  });
});

describe('POST /api/game/hint/:slug', () => {
  it('returns hints one by one, then stops', async () => {
    const token = await createSession();
    // Начать отель, чтобы появился прогресс
    await app.request('/api/game/state/dolphin', { headers: bearer(token) });

    const first = await app.request('/api/game/hint/dolphin', {
      method: 'POST',
      headers: bearer(token),
    });
    const firstBody = await first.json();
    expect(firstBody.hint).toBeTruthy();
    expect(firstBody.hintsUsed).toBe(1);

    // Выбираем все оставшиеся подсказки
    for (let i = 1; i < firstBody.hintsTotal; i++) {
      await app.request('/api/game/hint/dolphin', { method: 'POST', headers: bearer(token) });
    }
    const exhausted = await app.request('/api/game/hint/dolphin', {
      method: 'POST',
      headers: bearer(token),
    });
    expect((await exhausted.json()).hint).toBeNull();
  });

  it('reports not_started for a hotel the session never touched', async () => {
    const token = await createSession();
    const res = await app.request('/api/game/hint/dolphin', {
      method: 'POST',
      headers: bearer(token),
    });
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('not_started');
  });
});

describe('concierge chat', () => {
  it('requires authentication', async () => {
    const res = await app.request('/api/concierge/no-such-hotel/history');
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('authentication_required');
  });

  it('rejects an unknown hotel for an authenticated user', async () => {
    const cookie = sessionCookie(await register('ConciergeAuthUser'));
    const res = await app.request('/api/concierge/no-such-hotel/history', {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe('unknown_hotel');
  });

  it('keeps a per-user conversation history', async () => {
    const nickname = `Cg-${Math.random().toString(36).slice(2, 8)}`;
    const regRes = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, password: 'correct horse battery' }),
    });
    const cookie = sessionCookie(regRes);
    const hotelId = '1'; // NY Continental — первый отель каталога

    const historyRes = await app.request(`/api/concierge/${hotelId}/history`, {
      headers: { Cookie: cookie },
    });
    expect(await historyRes.json()).toEqual({ messages: [] });

    const msgRes = await app.request(`/api/concierge/${hotelId}/messages`, {
      method: 'POST',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'хочу забронировать номер' }),
    });
    expect(msgRes.status).toBe(200);
    const { userMessage, conciergeMessage } = await msgRes.json();
    expect(userMessage.text).toBe('хочу забронировать номер');
    expect(typeof conciergeMessage.text).toBe('string');
    expect(conciergeMessage.text.length).toBeGreaterThan(0);

    const afterRes = await app.request(`/api/concierge/${hotelId}/history`, {
      headers: { Cookie: cookie },
    });
    const { messages } = await afterRes.json();
    expect(messages).toHaveLength(2);
  });
});
