# Unreal Rooms — Documentation

## Project Overview
Interactive hotel booking game with a dark, atmospheric theme. Players navigate through various hotels, solve puzzles, and make bookings.

## Stack
- **Frontend**: React 18, React Router 7
- **Build**: Vite 6
- **Styling**: TailwindCSS 4, Radix UI, MUI (Material UI)
- **Language**: TypeScript 5
- **Backend**: Supabase
- **Testing**: Vitest
- **Package Manager**: pnpm

## Core Architecture Principle

**Вся логика в данных — никакого хардкода.**

Весь игровой процесс, условия переходов, состояния форм, варианты ответов — всё описано в data-файлах. Компоненты только читают данные и рендерят UI. Это позволяет:
- Легко добавлять новые отели без написания кода
- Изменять логику через данные, а не через код
- Держать логику отдельно от представления

## Key Files

| File | Purpose |
|------|---------|
| `src/app/data/hotels-data/*-data.ts` | Данные каждого отеля: цепочки шагов, условия,状态的 |
| `src/app/data/hotels-data/hotelTypes.ts` | Типы для chain, steps, transitions, conditions |
| `src/app/hooks/useHotelFlow.ts` | Основной хук управления потоком бронирования |
| `src/app/utils/evaluateConditions.ts` | evaluateConditions — утилита для проверки условий |
| `src/app/utils/getChainForHotel.ts` | Получение chain для конкретного отеля |
| `src/app/contexts/GameContext.tsx` | Глобальное состояние игры (инвентарь, прогресс) |

## Chain System

Каждый отель имеет `Chain` — объект с шагами (`steps`). Каждый шаг содержит:
- `actions` — действия (клики по галерее, кнопки, формы)
- `transitions` — переходы к следующим шагам (с условиями или без)
- `conditions` — условия для отображения или перехода
- `fallback` — резервный переход

### Condition Format
```typescript
{ field: string, operator: 'eq' | 'ne' | 'in', value: any }
```

## Development Rules

### Перед реализацией функционала
1. **Изучить существующий код** — внимательно прочитать файлы в `src/app/data/hotels-data/` и `src/app/hooks/`
2. **Проверить возможность переиспользования** — убедиться что существующие утилиты (`evaluateConditions`, `getChainForHotel`, хуки) покрывают новую задачу
3. **Добавлять логику в данные** — если логика новая для всех отелей, добавить её в `hotelTypes.ts` как новый тип transition/condition

### Рефакторинг
- Не добавлять хардкод в компоненты — вместо этого расширять data-слои
- Legacy-логика (например `hotel.galleryActions`) может оставаться для обратной совместимости
- Удаляй дублирующий и неиспользуемый код

## Language
- UI диалоги: русский (`ru-RU`)
- Типы и код: английский
- Файлы данных: дублирование на русском и английском (`name`, `nameEn`)
