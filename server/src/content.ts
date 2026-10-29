import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');

/** Публичные метаданные отеля — то, что разрешено видеть фронту. */
export interface HotelPublic {
  slug: string;
  name: string;
  nameEn: string;
  stars: number;
  slogan: string;
  sloganEn: string;
}

interface AnswerVariant {
  /** Нормализованные принимаемые варианты ответа (секрет — только на сервере). */
  accept: string[];
}

interface Step {
  id: string;
  /** Загадка: текст и картинка (путь из public/ фронта). */
  prompt: string;
  promptEn?: string;
  image?: string;
  /** Подсказки: выдаются по одной, по запросу. */
  hints?: string[];
  answers: AnswerVariant[];
  successMessage: string;
  artefact?: string;
}

/** Что уходит фронту — без ответов и подсказок, которые ещё не открыты. */
export interface StepPublic {
  stepId: string;
  prompt: string;
  promptEn?: string;
  image?: string;
  hintsTotal: number;
  hintsUsed: number;
  solved: boolean;
}

interface HotelContent {
  slug: string;
  name: string;
  nameEn: string;
  stars: number;
  slogan: string;
  sloganEn: string;
  entryStep: string;
  steps: Record<string, Step>;
}

const hotels = new Map<string, HotelContent>();

for (const file of readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'))) {
  const hotel: HotelContent = JSON.parse(readFileSync(join(CONTENT_DIR, file), 'utf8'));
  if (!hotel.steps[hotel.entryStep]) {
    throw new Error(`${file}: entryStep "${hotel.entryStep}" not found in steps`);
  }
  for (const [id, step] of Object.entries(hotel.steps)) {
    if (step.id !== id) throw new Error(`${file}: step key "${id}" != step.id "${step.id}"`);
  }
  hotels.set(hotel.slug, hotel);
}

export function listHotels(): HotelPublic[] {
  return [...hotels.values()].map(({ slug, name, nameEn, stars, slogan, sloganEn }) => ({
    slug,
    name,
    nameEn,
    stars,
    slogan,
    sloganEn,
  }));
}

export function getHotel(slug: string): HotelContent | undefined {
  return hotels.get(slug);
}

export function getStep(hotel: HotelContent, stepId: string): Step {
  const step = hotel.steps[stepId];
  if (!step) throw new Error(`hotel "${hotel.slug}": unknown step "${stepId}"`);
  return step;
}

/** Все шаги отеля, начиная с entry — для проверки конца цепочки. */
export function nextStepId(hotel: HotelContent, current: string): string | null {
  const ids = Object.keys(hotel.steps);
  const idx = ids.indexOf(current);
  return idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null;
}

export function isLastStep(hotel: HotelContent, stepId: string): boolean {
  return nextStepId(hotel, stepId) === null;
}

/** Ответ от игрока → нормализованная строка для сравнения. */
export function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"'`]/g, '')
    .replace(/\s+/g, ' ');
}

export function checkAnswer(step: Step, raw: string): boolean {
  const given = normalizeAnswer(raw);
  return step.answers.some((a) => a.accept.some((v) => normalizeAnswer(v) === given));
}
