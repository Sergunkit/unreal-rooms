import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import {
  checkAnswer,
  getHotel,
  getStep,
  isLastStep,
  listHotels,
  nextStepId,
  type StepPublic,
} from './content.ts';
import { createSession, db, sessionExists } from './db.ts';
import { getCatalog } from './catalog.ts';
import { registerAuthRoutes } from './auth.ts';

const PORT = Number(process.env.PORT ?? 8011);

const app = new Hono();

app.onError((error, c) => {
  console.error(`[${c.req.method} ${c.req.path}]`, error);
  return c.json({ error: 'internal_server_error' }, 500);
});

// Дев: фронт на http://localhost:5173 (мак) и прод-домен зовут API напрямую.
app.use('*', cors());
app.use('/api/account/*', async (c, next) => {
  const method = c.req.method;
  const requestSite = c.req.header('sec-fetch-site');
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && requestSite === 'cross-site') {
    return c.json({ error: 'cross_site_request_rejected' }, 403);
  }
  await next();
});
registerAuthRoutes(app);

/** Достаёт и проверяет сессию из Authorization: Bearer <token>. */
function requireSession(token: string | undefined): string | null {
  if (!token || !sessionExists(token)) return null;
  return token;
}

function publicStep(
  hotelSlug: string,
  stepId: string,
  hintsUsed: number,
  solved: boolean
): StepPublic {
  const hotel = getHotel(hotelSlug)!;
  const step = getStep(hotel, stepId);
  return {
    stepId: step.id,
    prompt: step.prompt,
    promptEn: step.promptEn,
    image: step.image,
    hintsTotal: step.hints?.length ?? 0,
    hintsUsed,
    solved,
  };
}

function loadProgress(token: string, slug: string) {
  return db
    .prepare('SELECT * FROM progress WHERE session_id = ? AND hotel = ?')
    .get(token, slug) as
    | {
        session_id: string;
        hotel: string;
        step_id: string;
        attempts: number;
        hints_used: number;
        solved: number;
      }
    | undefined;
}

function saveProgress(
  token: string,
  slug: string,
  stepId: string,
  patch: { attempts?: number; hintsUsed?: number; solved?: boolean } = {}
) {
  const current = loadProgress(token, slug);
  db.prepare(
    `INSERT INTO progress (session_id, hotel, step_id, attempts, hints_used, solved, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(session_id, hotel) DO UPDATE SET
       step_id = excluded.step_id,
       attempts = excluded.attempts,
       hints_used = excluded.hints_used,
       solved = excluded.solved,
       updated_at = datetime('now')`
  ).run(
    token,
    slug,
    stepId,
    patch.attempts ?? current?.attempts ?? 0,
    patch.hintsUsed ?? current?.hints_used ?? 0,
    (patch.solved ?? !!current?.solved) ? 1 : 0
  );
}

// ---------- Эндпоинты ----------

app.get('/api/game/health', (c) => c.json({ ok: true }));

/** Полный каталог отелей, цепочек и артефактов из SQLite. */
app.get('/api/game/catalog', (c) => c.json(getCatalog()));

/** Список отелей — только публичные метаданные. */
app.get('/api/game/hotels', (c) => c.json(listHotels()));

/** Новая анонимная сессия. */
app.post('/api/game/session', (c) => c.json({ token: createSession() }));

/** Текущее состояние игрока в отеле. */
app.get('/api/game/state/:slug', (c) => {
  const token = requireSession(c.req.header('Authorization')?.replace(/^Bearer\s+/i, ''));
  if (!token) return c.json({ error: 'invalid_session' }, 401);

  const hotel = getHotel(c.req.param('slug'));
  if (!hotel) return c.json({ error: 'unknown_hotel' }, 404);

  const progress = loadProgress(token, hotel.slug);
  if (!progress) {
    saveProgress(token, hotel.slug, hotel.entryStep);
    return c.json(publicStep(hotel.slug, hotel.entryStep, 0, false));
  }
  return c.json(publicStep(hotel.slug, progress.step_id, progress.hints_used, !!progress.solved));
});

/** Ответ на загадку текущего шага. */
app.post('/api/game/answer/:slug', async (c) => {
  const token = requireSession(c.req.header('Authorization')?.replace(/^Bearer\s+/i, ''));
  if (!token) return c.json({ error: 'invalid_session' }, 401);

  const hotel = getHotel(c.req.param('slug'));
  if (!hotel) return c.json({ error: 'unknown_hotel' }, 404);

  const body = (await c.req.json().catch(() => null)) as { answer?: string } | null;
  if (!body?.answer) return c.json({ error: 'answer_required' }, 400);

  const progress =
    loadProgress(token, hotel.slug) ??
    (saveProgress(token, hotel.slug, hotel.entryStep), loadProgress(token, hotel.slug))!;
  if (progress.solved) return c.json({ error: 'already_solved' }, 409);

  const step = getStep(hotel, progress.step_id);

  if (!checkAnswer(step, body.answer)) {
    saveProgress(token, hotel.slug, step.id, { attempts: progress.attempts + 1 });
    return c.json({ correct: false, attempts: progress.attempts + 1 });
  }

  const last = isLastStep(hotel, step.id);
  const nextId = nextStepId(hotel, step.id);
  saveProgress(token, hotel.slug, last ? step.id : nextId!, { solved: last });

  return c.json({
    correct: true,
    message: step.successMessage,
    artefact: step.artefact ?? null,
    ...(last
      ? { solved: true }
      : { solved: false, next: publicStep(hotel.slug, nextId!, 0, false) }),
  });
});

/** Открыть следующую подсказку (по одной). */
app.post('/api/game/hint/:slug', (c) => {
  const token = requireSession(c.req.header('Authorization')?.replace(/^Bearer\s+/i, ''));
  if (!token) return c.json({ error: 'invalid_session' }, 401);

  const hotel = getHotel(c.req.param('slug'));
  if (!hotel) return c.json({ error: 'unknown_hotel' }, 404);

  const progress = loadProgress(token, hotel.slug);
  if (!progress) return c.json({ error: 'not_started' }, 409);

  const step = getStep(hotel, progress.step_id);
  const hints = step.hints ?? [];
  if (progress.hints_used >= hints.length) return c.json({ hint: null });

  const hint = hints[progress.hints_used];
  const used = progress.hints_used + 1;
  saveProgress(token, hotel.slug, step.id, { hintsUsed: used });
  return c.json({ hint, hintsUsed: used, hintsTotal: hints.length });
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`unreal-rooms api listening on http://127.0.0.1:${info.port}`);
});
