import type { Context, Hono } from 'hono';
import { getAuthenticatedUser } from './auth.ts';
import { db } from './db.ts';

const MAX_MESSAGE_LENGTH = 2_000;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ConversationRow {
  messages_json: string;
  message_index: number;
}

type Language = 'ru' | 'en';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getHotelMessages(hotelId: string): Record<string, unknown> | null {
  const row = db.prepare('SELECT hotel_json FROM hotel_catalog WHERE hotel_id = ?').get(hotelId) as
    | { hotel_json: string }
    | undefined;
  if (!row) return null;
  const hotel: unknown = JSON.parse(row.hotel_json);
  return isRecord(hotel) ? hotel : null;
}

function messageList(hotel: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = hotel[key];
    if (Array.isArray(value)) {
      const messages = value.filter((message): message is string => typeof message === 'string');
      if (messages.length > 0) return messages;
    }
  }
  return [];
}

function cannedReply(
  message: string,
  language: Language,
  hotel: Record<string, unknown>,
  messageIndex: number
): { text: string; nextIndex: number } {
  const russianMessages = messageList(hotel, ['chatMassages', 'chatMessages']);
  const englishMessages = messageList(hotel, ['chatMassegesEn', 'chatMessagesEn']);
  const hotelMessages =
    language === 'ru'
      ? russianMessages.length > 0
        ? russianMessages
        : englishMessages
      : englishMessages.length > 0
        ? englishMessages
        : russianMessages;

  if (hotelMessages.length > 0) {
    const index = messageIndex % hotelMessages.length;
    return {
      text: hotelMessages[index],
      nextIndex: (index + 1) % hotelMessages.length,
    };
  }

  const lowerMessage = message.toLocaleLowerCase();
  const responses =
    language === 'ru'
      ? {
          greeting: 'Здравствуйте! Я ваш виртуальный консьерж. Чем могу помочь?',
          booking:
            'Для бронирования номера нажмите кнопку «Забронировать номер» на странице отеля. Могу ответить на вопросы о номерах и услугах.',
          amenities:
            'В нашем отеле доступны рестораны, бассейны, SPA-центр, фитнес и многое другое. О чём хотите узнать подробнее?',
          spa: 'Наш SPA-центр предлагает широкий спектр услуг: массаж, сауна, хаммам и beauty-процедуры. Работаем с 8:00 до 22:00.',
          restaurant:
            'У нас несколько ресторанов: основной ресторан с завтраками (7:00–11:00), итальянский (12:00–23:00), азиатский (18:00–23:00). Что вас интересует?',
          pool: 'В отеле 3 бассейна: крытый с подогревом, открытый на крыше с баром и детский. Открыты с 7:00 до 22:00.',
          checkin:
            'Заезд: 14:00, выезд: 12:00. Ранний заезд и поздний выезд возможны по запросу (зависит от загрузки).',
          wifi: 'Wi-Fi бесплатный во всех зонах отеля. Пароль выдается при регистрации.',
          parking: 'Бесплатная охраняемая парковка для гостей. Места есть всегда.',
          default:
            'Благодарю за вопрос! Могу помочь с информацией о номерах, услугах, ресторанах, SPA, бассейнах и других удобствах. Что вас интересует?',
        }
      : {
          greeting: 'Hello! I am your virtual concierge. How can I help you?',
          booking:
            'To book a room, click the "Book a room" button on the hotel page. I can answer questions about rooms and services.',
          amenities:
            'Our hotel offers restaurants, pools, a SPA center, fitness, and much more. What would you like to know more about?',
          spa: 'Our SPA center offers a wide range of services: massage, sauna, hammam, and beauty treatments. Open from 8:00 AM to 10:00 PM.',
          restaurant:
            'We have several restaurants: the main restaurant with breakfast (7:00–11:00), Italian (12:00–23:00), and Asian (18:00–23:00). What are you interested in?',
          pool: 'The hotel has 3 pools: a heated indoor pool, a rooftop pool with a bar, and a children’s pool. Open from 7:00 AM to 10:00 PM.',
          checkin:
            'Check-in: 2:00 PM, check-out: 12:00 PM. Early check-in and late check-out are available upon request, subject to availability.',
          wifi: 'Free Wi-Fi is available throughout the hotel. The password is provided at check-in.',
          parking: 'Free secure parking is available for guests.',
          default:
            'Thank you for your question! I can help with information about rooms, services, restaurants, SPA, pools, and other amenities. What are you interested in?',
        };

  if (['привет', 'здравств', 'hello', 'hi'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.greeting, nextIndex: messageIndex };
  }
  if (['брон', 'book'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.booking, nextIndex: messageIndex };
  }
  if (['spa', 'спа', 'массаж', 'massage'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.spa, nextIndex: messageIndex };
  }
  if (
    ['ресторан', 'restaurant', 'еда', 'food', 'завтрак', 'breakfast'].some((word) =>
      lowerMessage.includes(word)
    )
  ) {
    return { text: responses.restaurant, nextIndex: messageIndex };
  }
  if (['бассейн', 'pool'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.pool, nextIndex: messageIndex };
  }
  if (['заезд', 'выезд', 'check'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.checkin, nextIndex: messageIndex };
  }
  if (['wifi', 'вай-фай', 'интернет', 'internet'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.wifi, nextIndex: messageIndex };
  }
  if (['парков', 'parking'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.parking, nextIndex: messageIndex };
  }
  if (['удобств', 'amenities', 'услуг', 'service'].some((word) => lowerMessage.includes(word))) {
    return { text: responses.amenities, nextIndex: messageIndex };
  }

  return { text: responses.default, nextIndex: messageIndex };
}

function readConversation(userId: string, hotelId: string): ConversationRow | undefined {
  return db
    .prepare(
      'SELECT messages_json, message_index FROM concierge_conversations WHERE user_id = ? AND hotel_id = ?'
    )
    .get(userId, hotelId) as ConversationRow | undefined;
}

export function registerConciergeRoutes(app: Hono): void {
  app.get('/api/concierge/:hotelId/history', (c) => {
    const user = getAuthenticatedUser(c);
    if (!user) return c.json({ error: 'authentication_required' }, 401);

    const hotelId = c.req.param('hotelId');
    if (!getHotelMessages(hotelId)) return c.json({ error: 'unknown_hotel' }, 404);

    const conversation = readConversation(user.id, hotelId);
    return c.json({
      messages: conversation ? (JSON.parse(conversation.messages_json) as ChatMessage[]) : [],
    });
  });

  app.post('/api/concierge/:hotelId/messages', async (c) => {
    const user = getAuthenticatedUser(c);
    if (!user) return c.json({ error: 'authentication_required' }, 401);

    const hotelId = c.req.param('hotelId');
    const hotel = getHotelMessages(hotelId);
    if (!hotel) return c.json({ error: 'unknown_hotel' }, 404);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'invalid_json' }, 400);
    }
    if (!isRecord(body) || typeof body.message !== 'string') {
      return c.json({ error: 'message_required' }, 400);
    }

    const text = body.message.trim();
    if (!text) return c.json({ error: 'message_required' }, 400);
    if ([...text].length > MAX_MESSAGE_LENGTH) {
      return c.json({ error: 'message_too_long' }, 413);
    }
    const language: Language = body.language === 'en' ? 'en' : 'ru';

    const conversation = readConversation(user.id, hotelId);
    const messages = conversation ? (JSON.parse(conversation.messages_json) as ChatMessage[]) : [];
    const messageIndex = conversation?.message_index ?? 0;
    const reply = cannedReply(text, language, hotel, messageIndex);
    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      isUser: true,
      timestamp: now,
    };
    const conciergeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: reply.text,
      isUser: false,
      timestamp: now,
    };
    const updatedMessages = [...messages, userMessage, conciergeMessage];

    db.prepare(
      `INSERT INTO concierge_conversations (user_id, hotel_id, messages_json, message_index, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, hotel_id) DO UPDATE SET
         messages_json = excluded.messages_json,
         message_index = excluded.message_index,
         updated_at = datetime('now')`
    ).run(user.id, hotelId, JSON.stringify(updatedMessages), reply.nextIndex);

    return c.json({ userMessage, conciergeMessage });
  });
}
