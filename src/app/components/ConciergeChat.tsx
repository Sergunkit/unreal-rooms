import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

function isMessage(value: unknown): value is Message {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'text' in value &&
    typeof value.text === 'string' &&
    'isUser' in value &&
    typeof value.isUser === 'boolean' &&
    'timestamp' in value &&
    typeof value.timestamp === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function ConciergeChat({ hotelId }: { hotelId: string }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [hotelId, user?.id]);

  useEffect(() => {
    if (!chatOpen || !user) return;

    const controller = new AbortController();
    async function loadHistory() {
      setIsLoadingHistory(true);
      setError(null);
      try {
        const response = await fetch(`/api/concierge/${encodeURIComponent(hotelId)}/history`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Не удалось загрузить переписку (${response.status}).`);
        const payload: unknown = await response.json();
        if (
          typeof payload !== 'object' ||
          payload === null ||
          !('messages' in payload) ||
          !Array.isArray(payload.messages) ||
          !payload.messages.every(isMessage)
        ) {
          throw new Error('Сервер вернул переписку в неожиданном формате.');
        }
        setMessages(payload.messages);
      } catch (loadError) {
        if (!controller.signal.aborted) setError(getErrorMessage(loadError));
      } finally {
        if (!controller.signal.aborted) setIsLoadingHistory(false);
      }
    }

    void loadHistory();
    return () => controller.abort();
  }, [chatOpen, hotelId, user]);

  useEffect(() => {
    if (chatOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen, isLoadingHistory]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = message.trim();
    if (!text || !user || isSending || isLoadingHistory) return;

    setIsSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/concierge/${encodeURIComponent(hotelId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const code =
          typeof payload === 'object' && payload !== null && 'error' in payload
            ? String(payload.error)
            : `HTTP ${response.status}`;
        throw new Error(
          code === 'authentication_required'
            ? 'Войдите в аккаунт, чтобы писать консьержу.'
            : `Не удалось отправить сообщение: ${code}.`
        );
      }

      const payload: unknown = await response.json();
      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('userMessage' in payload) ||
        !('conciergeMessage' in payload) ||
        !isMessage(payload.userMessage) ||
        !isMessage(payload.conciergeMessage)
      ) {
        throw new Error('Сервер вернул ответ в неожиданном формате.');
      }

      const userMessage = payload.userMessage;
      const conciergeMessage = payload.conciergeMessage;
      setMessages((current) => [...current, userMessage, conciergeMessage]);
      setMessage('');
    } catch (sendError) {
      setError(getErrorMessage(sendError));
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (!user) return null;

  return (
    <>
      {chatOpen && (
        <section className="fixed bottom-24 left-4 z-40 flex h-[min(500px,calc(100dvh-8rem))] w-[calc(100vw-2rem)] flex-col rounded-lg border border-border bg-card shadow-2xl sm:left-8 sm:w-96">
          <header className="flex items-center justify-between rounded-t-lg border-b border-border bg-primary/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {language === 'ru' ? 'Консьерж' : 'Concierge'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Онлайн' : 'Online'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label={language === 'ru' ? 'Закрыть чат' : 'Close chat'}
              className="rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            {!isLoadingHistory && messages.length === 0 && (
              <div className="mb-4 max-w-[80%] rounded-lg bg-secondary p-3">
                <p className="text-sm text-foreground">
                  {language === 'ru'
                    ? 'Здравствуйте! Чем могу помочь?'
                    : 'Hello! How can I help you?'}
                </p>
              </div>
            )}
            {isLoadingHistory && (
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Загружаем переписку…' : 'Loading conversation…'}
              </p>
            )}
            {messages.map((item) => (
              <div
                key={item.id}
                className={`mb-4 flex ${item.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    item.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{item.text}</p>
                  <time className="mt-1 block text-xs opacity-70">
                    {formatTime(item.timestamp)}
                  </time>
                </div>
              </div>
            ))}
            {isSending && (
              <p className="mb-4 text-sm text-muted-foreground">
                {language === 'ru' ? 'Консьерж отвечает…' : 'The concierge is typing…'}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-4">
            {error && (
              <p role="alert" className="mb-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <form onSubmit={(event) => void sendMessage(event)} className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={2000}
                placeholder={language === 'ru' ? 'Введите сообщение…' : 'Type a message…'}
                aria-label={language === 'ru' ? 'Сообщение консьержу' : 'Message the concierge'}
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSending || isLoadingHistory}
              />
              <button
                type="submit"
                aria-label={language === 'ru' ? 'Отправить сообщение' : 'Send message'}
                disabled={isSending || isLoadingHistory || !message.trim()}
                className="rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setChatOpen((open) => !open)}
        aria-label={
          chatOpen
            ? language === 'ru'
              ? 'Закрыть чат с консьержем'
              : 'Close concierge chat'
            : language === 'ru'
              ? 'Открыть чат с консьержем'
              : 'Open concierge chat'
        }
        aria-expanded={chatOpen}
        className="fixed bottom-8 left-4 z-50 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:bg-primary/90 sm:left-8"
      >
        {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
