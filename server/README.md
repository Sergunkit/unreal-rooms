# unreal-rooms API server

Тонкий игровой сервер: держит загадки/ответы вне фронтового бандла, хранит
прогресс игроков в SQLite.

## Запуск (dev)

```bash
cd server
npm install
npm run dev        # http://localhost:8011
```

Прод: systemd-юнит из `deploy/` (порт 8011, только 127.0.0.1), наружу —
nginx `location /api/game/`.

## Контент

`content/<slug>.json` — один отель. Поля `answers.*.accept`, `hints`,
`successMessage` **никогда** не отдаются фронтом наружу: API возвращает только
текущий шаг (`prompt`, `image`), открытые подсказки и вердикт ответа.

Схема шага: шаги идут в порядке объявления в `steps`, `entryStep` — первый,
последний решённый шаг = отель пройден.

## Эндпоинты

| Метод | Путь | Что делает |
|---|---|---|
| GET | `/api/game/hotels` | список отелей (публичные метаданные) |
| POST | `/api/game/session` | новая анонимная сессия → `{token}` |
| GET | `/api/game/state/:slug` | текущий шаг игрока |
| POST | `/api/game/answer/:slug` | `{answer}` → `{correct, message?, next?}` |
| POST | `/api/game/hint/:slug` | открыть следующую подсказку |

Все, кроме `hotels` и `session`, требуют `Authorization: Bearer <token>`.

## Переменные окружения

- `PORT` (default 8011)
- `GAME_DB` (default `server/data/game.db`, gitignored)
