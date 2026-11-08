import { serve } from '@hono/node-server';
import { app } from './app.ts';

const PORT = Number(process.env.PORT ?? 8011);

// Слушаем только localhost: наружу API торчать не должно (доступ — через nginx).
serve({ fetch: app.fetch, port: PORT, hostname: '127.0.0.1' }, (info) => {
  console.log(`unreal-rooms api listening on http://127.0.0.1:${info.port}`);
});
