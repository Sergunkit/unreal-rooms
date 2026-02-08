import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { serverUrl } from '../utils/supabase';
import { publicAnonKey } from '../utils/supabase/info';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export function ChatPage() {
  const { language } = useLanguage();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Load chat history on mount
  useEffect(
    () => {
      if (user && accessToken) {
        loadChatHistory();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, accessToken]
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!accessToken || !user) return;

    try {
      const response = await fetch(
        `${serverUrl}/chat/history?token=${encodeURIComponent(accessToken)}&hotelId=general`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to load chat history');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !accessToken || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Send message to server
      const response = await fetch(
        `${serverUrl}/chat/send?token=${encodeURIComponent(accessToken)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            hotelId: 'general',
            message: userMessage.text,
            language,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Add concierge response
        if (data.reply) {
          const conciergeMessage: Message = {
            id: data.messageId || (Date.now() + 1).toString(),
            text: data.reply,
            isUser: false,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, conciergeMessage]);
        }
      } else {
        console.error('Failed to send message');
        // Remove user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Redirect if not logged in
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl text-foreground font-semibold">
                  {language === 'ru' ? 'Консьерж' : 'Concierge'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Онлайн' : 'Online'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 container mx-auto max-w-2xl">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-secondary rounded-lg p-6 max-w-md text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">
                {language === 'ru' ? 'Добро пожаловать!' : 'Welcome!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'ru'
                  ? 'Здравствуйте! Я ваш виртуальный консьерж. Чем я могу помочь?'
                  : "Hello! I'm your virtual concierge. How can I help?"}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`rounded-lg p-4 max-w-md ${
                msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className="text-xs opacity-70 mt-2 block">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="bg-secondary rounded-lg p-4 max-w-md">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="container mx-auto max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'ru' ? 'Введите сообщение...' : 'Type a message...'}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
