import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
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

interface ConciergeChatProps {
  hotelId: string;
}

export function ConciergeChat({ hotelId }: ConciergeChatProps) {
  const { language } = useLanguage();
  const { user, accessToken } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when chat opens
  useEffect(() => {
    if (chatOpen && user && accessToken) {
      loadChatHistory();
    }
  }, [chatOpen, user, accessToken]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [messages, chatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!accessToken || !user) return;

    try {
      const response = await fetch(
        `${serverUrl}/chat/history?token=${encodeURIComponent(accessToken)}&hotelId=${hotelId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
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
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            hotelId,
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
          
          // If chat is closed, increment unread counter
          if (!chatOpen) {
            setUnreadMessages((prev) => prev + 1);
          }
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

  // Don't show chat if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[500px] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-40">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-primary/10 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-foreground font-semibold">
                  {language === 'ru' ? 'Консьерж' : 'Concierge'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Онлайн' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="bg-secondary rounded-lg p-3 mb-4 max-w-[80%]">
                <p className="text-sm text-foreground">
                  {language === 'ru'
                    ? 'Здравствуйте! Чем могу помочь?'
                    : 'Hello! How can I help you?'}
                </p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'ru' ? 'Введите сообщение...' : 'Type a message...'
                }
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => {
          setChatOpen(!chatOpen);
          if (!chatOpen) {
            setUnreadMessages(0);
          }
        }}
        className="fixed bottom-8 right-28 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-50 relative"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadMessages}
          </span>
        )}
      </button>
    </>
  );
}
