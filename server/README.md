# unreal-rooms API server

Тонкий игровой сервер: держит загадки/ответы вне фронтового бандла, хранит
прогресс игроков и каталог приложения в SQLite.

## Запуск (dev)

```bash
npm --prefix server install
npm run dev:server # http://localhost:8011
```

Для совместного запуска фронтенда и API из корня проекта используйте `npm run dev`.
Он дождётся готовности API, затем запустит Vite; остановка через Ctrl+C завершит оба процесса.

Прод: systemd-юнит из `deploy/` (порт 8011, только 127.0.0.1), наружу —
nginx `location /api/game/`.

## Контент

`content/<slug>.json` — один отель. Поля `answers.*.accept`, `hints`,
`successMessage` **никогда** не отдаются фронту наружу: API возвращает только
текущий шаг (`prompt`, `image`), открытые подсказки и вердикт ответа.

Схема шага: шаги идут в порядке объявления в `steps`, `entryStep` — первый,
последний решённый шаг = отель пройден.

`catalog/catalog.json` содержит публичные данные гостиниц, цепочек и артефактов.
При старте сервера они проверяются и загружаются в таблицы SQLite; приложение
получает их через `/api/game/catalog`. Изображения каталога публикуются фронтендом
из `public/images/`.

## Эндпоинты

| Метод   | Путь                               | Что делает                                        |
| ------- | ---------------------------------- | ------------------------------------------------- |
| GET     | `/api/game/catalog`                | каталог гостиниц, цепочек и артефактов из SQLite  |
| GET     | `/api/game/hotels`                 | список отелей (публичные метаданные)              |
| POST    | `/api/auth/register`               | регистрация по никнейму и паролю                  |
| POST    | `/api/auth/login`                  | вход и установка HttpOnly cookie                  |
| GET     | `/api/auth/me`                     | текущий аккаунт                                   |
| POST    | `/api/auth/logout`                 | завершение сессии                                 |
| GET/PUT | `/api/account/state`               | загрузка и сохранение игрового состояния аккаунта |
| GET     | `/api/concierge/:hotelId/history`  | история чата консьержа для отеля                  |
| POST    | `/api/concierge/:hotelId/messages` | отправка сообщения консьержу                      |
| POST    | `/api/game/session`                | новая анонимная сессия → `{token}`                |
| GET     | `/api/game/state/:slug`            | текущий шаг игрока                                |
| POST    | `/api/game/answer/:slug`           | `{answer}` → `{correct, message?, next?}`         |
| POST    | `/api/game/hint/:slug`             | открыть следующую подсказку                       |

Маршруты `/api/auth/*`, `/api/account/*` и `/api/concierge/*` используют
HttpOnly cookie авторизованного аккаунта. Игровые маршруты, кроме каталога,
списка отелей и создания сессии, требуют `Authorization: Bearer <token>`.

## Переменные окружения

- `PORT` (default 8011)
- `GAME_DB` (default `server/data/game.db`, gitignored)
