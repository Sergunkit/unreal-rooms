import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Version identifier for debugging
const SERVER_VERSION = 'v4.0.0-refresh-token';

console.log(`🚀 Server starting - Version: ${SERVER_VERSION}`);

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Custom-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to generate a simple token
function generateToken(): string {
  return crypto.randomUUID();
}

// Health check endpoint
app.get("/make-server-4cfee19e/health", (c) => {
  return c.json({ status: "ok", version: SERVER_VERSION });
});

// Sign up endpoint
app.post("/make-server-4cfee19e/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Authorization error while creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user info in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name: name || '',
      createdAt: new Date().toISOString()
    });

    // Store email to userId mapping
    await kv.set(`email:${email.toLowerCase()}`, data.user.id);

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || ''
      }
    });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Sign in endpoint - returns access and refresh tokens
app.post("/make-server-4cfee19e/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    console.log(`Sign in attempt for email: ${email}`);

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Authenticate with Supabase on server side
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    console.log(`Attempting Supabase auth for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Supabase sign in error: ${error.message}`);
      return c.json({ error: error.message || "Invalid email or password" }, 401);
    }

    if (!data.user) {
      console.log(`No user returned from Supabase`);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    console.log(`Successfully authenticated user: ${data.user.id}`);

    // Generate access and refresh tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();

    const now = Date.now();
    const accessExpiresAt = new Date(now + ACCESS_TOKEN_EXPIRES_IN);
    const refreshExpiresAt = new Date(now + REFRESH_TOKEN_EXPIRES_IN);

    // Store access token session in KV
    await kv.set(`session:${accessToken}`, {
      userId: data.user.id,
      email: data.user.email,
      type: 'access',
      createdAt: new Date().toISOString(),
      expiresAt: accessExpiresAt.toISOString()
    });

    // Store refresh token session in KV
    await kv.set(`session:${refreshToken}`, {
      userId: data.user.id,
      email: data.user.email,
      type: 'refresh',
      createdAt: new Date().toISOString(),
      expiresAt: refreshExpiresAt.toISOString()
    });

    // Get user data
    const userData = await kv.get(`user:${data.user.id}`);

    console.log(`Sign in successful, returning tokens`);

    return c.json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN / 1000, // in seconds
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userData?.name || data.user.user_metadata?.name || ''
      }
    });
  } catch (error) {
    console.log(`Server error during signin: ${error.message || error}`);
    return c.json({ error: "Internal server error during signin" }, 500);
  }
});

// Refresh token endpoint - exchanges refresh token for new access token
app.post("/make-server-4cfee19e/refresh", async (c) => {
  try {
    const { refreshToken } = await c.req.json();

    console.log(`Token refresh attempt`);

    if (!refreshToken) {
      return c.json({ error: "Refresh token is required" }, 400);
    }

    // Get refresh token session from KV store
    const session = await kv.get(`session:${refreshToken}`);

    if (!session || session.type !== 'refresh') {
      console.log(`Invalid refresh token`);
      return c.json({ error: "Invalid refresh token" }, 401);
    }

    // Check if refresh token expired
    if (new Date(session.expiresAt) < new Date()) {
      console.log(`Refresh token expired at: ${session.expiresAt}`);
      await kv.del(`session:${refreshToken}`);
      return c.json({ error: "Refresh token expired" }, 401);
    }

    // Generate new access token
    const newAccessToken = generateToken();
    const accessExpiresAt = new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN);

    // Store new access token session in KV
    await kv.set(`session:${newAccessToken}`, {
      userId: session.userId,
      email: session.email,
      type: 'access',
      createdAt: new Date().toISOString(),
      expiresAt: accessExpiresAt.toISOString()
    });

    console.log(`Token refresh successful for user: ${session.userId}`);

    return c.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN / 1000 // in seconds
    });
  } catch (error) {
    console.log(`Server error during token refresh: ${error}`);
    return c.json({ error: "Internal server error during token refresh" }, 500);
  }
});

// Get current user profile - using query parameter for token
app.get("/make-server-4cfee19e/profile", async (c) => {
  console.log('=== PROFILE ENDPOINT CALLED (v4.0) ===');
  console.log('Request URL:', c.req.url);
  console.log('Query params:', c.req.query());
  
  try {
    // Get token from query parameter instead of header
    const token = c.req.query('token');
    
    console.log(`Profile request - Token present: ${!!token}`);
    
    if (!token) {
      console.log(`Profile request - Missing token in query`);
      return c.json({ code: 401, message: "Missing authentication token" }, 401);
    }

    console.log(`Profile request - Token (first 20 chars): ${token.substring(0, 20)}...`);
    console.log(`Profile request - Token length: ${token.length}`);

    // Get session from KV store
    console.log(`Profile request - Looking up session: session:${token}`);
    const session = await kv.get(`session:${token}`);
    
    console.log(`Profile request - Session found: ${!!session}`);
    if (session) {
      console.log(`Profile request - Session type: ${session.type}`);
      console.log(`Profile request - Session userId: ${session.userId}`);
    }

    if (!session || !session.userId) {
      console.log(`Profile request - Invalid token or no session found`);
      return c.json({ code: 401, message: "Invalid token" }, 401);
    }

    // Only access tokens can be used for API requests
    if (session.type !== 'access') {
      console.log(`Profile request - Wrong token type: ${session.type}`);
      return c.json({ code: 401, message: "Invalid token type" }, 401);
    }

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      console.log(`Profile request - Session expired at: ${session.expiresAt}`);
      await kv.del(`session:${token}`);
      return c.json({ code: 401, message: "Session expired" }, 401);
    }

    // Get user data from KV store
    console.log(`Profile request - Looking up user: user:${session.userId}`);
    const userData = await kv.get(`user:${session.userId}`);
    
    console.log(`Profile request - User data found: ${!!userData}`);

    if (!userData) {
      console.log(`Profile request - User not found for id: ${session.userId}`);
      return c.json({ error: "User not found" }, 404);
    }

    console.log(`Profile request - Success, returning user data`);

    return c.json({
      id: userData.id,
      email: userData.email,
      name: userData.name || '',
      createdAt: userData.createdAt
    });
  } catch (error) {
    console.log(`Server error while fetching profile: ${error}`);
    return c.json({ error: "Internal server error while fetching profile" }, 500);
  }
});

// Update user profile - using query parameter for token
app.put("/make-server-4cfee19e/profile", async (c) => {
  try {
    // Get token from query parameter
    const token = c.req.query('token');
    
    if (!token) {
      return c.json({ error: "Unauthorized - no token provided" }, 401);
    }

    // Get session from KV store
    const session = await kv.get(`session:${token}`);

    if (!session || !session.userId) {
      return c.json({ error: "Unauthorized - invalid or expired token" }, 401);
    }

    // Only access tokens can be used for API requests
    if (session.type !== 'access') {
      return c.json({ error: "Unauthorized - invalid token type" }, 401);
    }

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      await kv.del(`session:${token}`);
      return c.json({ error: "Unauthorized - session expired" }, 401);
    }

    const { name } = await c.req.json();

    // Update user data in KV store
    const existingData = await kv.get(`user:${session.userId}`) || {};
    await kv.set(`user:${session.userId}`, {
      ...existingData,
      id: session.userId,
      email: session.email,
      name: name || '',
      updatedAt: new Date().toISOString()
    });

    return c.json({ 
      success: true,
      user: {
        id: session.userId,
        email: session.email,
        name: name || ''
      }
    });
  } catch (error) {
    console.log(`Server error while updating profile: ${error}`);
    return c.json({ error: "Internal server error while updating profile" }, 500);
  }
});

// Chat endpoints

// Get chat history for a specific hotel
app.get("/make-server-4cfee19e/chat/history", async (c) => {
  try {
    const token = c.req.query('token');
    const hotelId = c.req.query('hotelId');
    
    if (!token) {
      return c.json({ error: "Unauthorized - no token provided" }, 401);
    }

    if (!hotelId) {
      return c.json({ error: "Hotel ID is required" }, 400);
    }

    // Verify token
    const session = await kv.get(`session:${token}`);
    if (!session || session.type !== 'access' || new Date(session.expiresAt) < new Date()) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get chat history from KV store
    const chatKey = `chat:${session.userId}:${hotelId}`;
    const chatData = await kv.get(chatKey);

    return c.json({
      messages: chatData?.messages || []
    });
  } catch (error) {
    console.log(`Server error while fetching chat history: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Send a chat message
app.post("/make-server-4cfee19e/chat/send", async (c) => {
  try {
    const token = c.req.query('token');
    
    if (!token) {
      return c.json({ error: "Unauthorized - no token provided" }, 401);
    }

    // Verify token
    const session = await kv.get(`session:${token}`);
    if (!session || session.type !== 'access' || new Date(session.expiresAt) < new Date()) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { hotelId, message, language } = await c.req.json();

    if (!hotelId || !message) {
      return c.json({ error: "Hotel ID and message are required" }, 400);
    }

    // Store user message
    const chatKey = `chat:${session.userId}:${hotelId}`;
    const chatData = await kv.get(chatKey) || { messages: [] };

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    chatData.messages.push(userMessage);

    // Generate AI response (simple rule-based for now)
    const aiResponse = generateConciergeResponse(message, language || 'ru');
    
    const conciergeMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date().toISOString()
    };

    chatData.messages.push(conciergeMessage);

    // Save to KV store
    await kv.set(chatKey, chatData);

    return c.json({
      success: true,
      reply: aiResponse,
      messageId: conciergeMessage.id
    });
  } catch (error) {
    console.log(`Server error while sending chat message: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Simple AI response generator (can be replaced with OpenAI API later)
function generateConciergeResponse(message: string, language: string): string {
  const lowerMessage = message.toLowerCase();

  const responses = {
    ru: {
      greeting: 'Здравствуйте! Я ваш виртуальный консьерж. Чем могу помочь?',
      booking: 'Для бронирования номера нажмите кнопку "Забронировать номер" на странице отеля. Могу ответить на вопросы о номерах и услугах.',
      amenities: 'В нашем отеле доступны: рестораны, бассейны, SPA-центр, фитнес, и многое другое. О чем хотите узнать подробнее?',
      spa: 'Наш SPA-центр предлагает широкий спектр услуг: массаж, сауна, хаммам, beauty-процедуры. Работаем с 8:00 до 22:00.',
      restaurant: 'У нас несколько ресторанов: основной ресторан с завтраками (7:00-11:00), итальянский (12:00-23:00), азиатский (18:00-23:00). Что вас интересует?',
      pool: 'В отеле 3 бассейна: крытый с подогревом, открытый на крыше с баром, и детский бассейн. Открыты с 7:00 до 22:00.',
      checkin: 'Заезд: 14:00, выезд: 12:00. Ранний заезд и поздний выезд возможны по запросу (зависит от загрузки).',
      wifi: 'Wi-Fi бесплатный во всех зонах отеля. Пароль выдается при регистрации.',
      parking: 'Бесплатная охраняемая парковка для гостей. Места есть всегда.',
      default: 'Благодарю за вопрос! Могу помочь с информацией о номерах, услугах, ресторанах, SPA, бассейнах и других удобствах. Что вас интересует?'
    },
    en: {
      greeting: 'Hello! I am your virtual concierge. How can I help you?',
      booking: 'To book a room, click the "Book a room" button on the hotel page. I can answer questions about rooms and services.',
      amenities: 'Our hotel offers: restaurants, pools, SPA center, fitness, and much more. What would you like to know more about?',
      spa: 'Our SPA center offers a wide range of services: massage, sauna, hammam, beauty treatments. Open from 8:00 AM to 10:00 PM.',
      restaurant: 'We have several restaurants: main restaurant with breakfast (7:00-11:00), Italian (12:00-23:00), Asian (18:00-23:00). What are you interested in?',
      pool: 'The hotel has 3 pools: heated indoor, rooftop with bar, and children\'s pool. Open from 7:00 AM to 10:00 PM.',
      checkin: 'Check-in: 2:00 PM, Check-out: 12:00 PM. Early check-in and late check-out available upon request (subject to availability).',
      wifi: 'Free Wi-Fi in all hotel areas. Password provided at check-in.',
      parking: 'Free secure parking for guests. Always available.',
      default: 'Thank you for your question! I can help with information about rooms, services, restaurants, SPA, pools, and other amenities. What are you interested in?'
    }
  };

  const lang = language === 'ru' ? 'ru' : 'en';
  const msgs = responses[lang];

  // Check for keywords
  if (lowerMessage.includes('привет') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return msgs.greeting;
  } else if (lowerMessage.includes('брон') || lowerMessage.includes('book')) {
    return msgs.booking;
  } else if (lowerMessage.includes('spa') || lowerMessage.includes('спа') || lowerMessage.includes('массаж') || lowerMessage.includes('massage')) {
    return msgs.spa;
  } else if (lowerMessage.includes('ресторан') || lowerMessage.includes('restaurant') || lowerMessage.includes('еда') || lowerMessage.includes('food') || lowerMessage.includes('завтрак') || lowerMessage.includes('breakfast')) {
    return msgs.restaurant;
  } else if (lowerMessage.includes('бассейн') || lowerMessage.includes('pool')) {
    return msgs.pool;
  } else if (lowerMessage.includes('заезд') || lowerMessage.includes('выезд') || lowerMessage.includes('check')) {
    return msgs.checkin;
  } else if (lowerMessage.includes('wifi') || lowerMessage.includes('вай-фай') || lowerMessage.includes('интернет') || lowerMessage.includes('internet')) {
    return msgs.wifi;
  } else if (lowerMessage.includes('парков') || lowerMessage.includes('parking')) {
    return msgs.parking;
  } else if (lowerMessage.includes('удобств') || lowerMessage.includes('amenities') || lowerMessage.includes('услуг') || lowerMessage.includes('service')) {
    return msgs.amenities;
  }

  return msgs.default;
}

Deno.serve(app.fetch);