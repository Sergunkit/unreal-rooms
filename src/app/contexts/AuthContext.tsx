import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  nickname: string;
}

type AuthStatus = 'loading' | 'guest' | 'authenticated' | 'error';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  error: Error | null;
  refresh: () => Promise<void>;
  signIn: (nickname: string, password: string) => Promise<void>;
  signUp: (nickname: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function getApiError(response: Response): Promise<Error> {
  const body = await response.text();
  try {
    const payload: unknown = JSON.parse(body);
    if (typeof payload === 'object' && payload !== null && 'error' in payload) {
      const error = (payload as { error?: unknown }).error;
      const message = (payload as { message?: unknown }).message;
      if (typeof message === 'string') return new Error(message);
      if (typeof error === 'string') {
        const messages: Record<string, string> = {
          invalid_credentials: 'Неверный никнейм или пароль.',
          nickname_taken: 'Этот никнейм уже занят.',
          invalid_nickname: 'Никнейм: 3–24 буквы, цифры, _ или -.',
          invalid_password: 'Пароль должен содержать от 8 до 128 символов.',
        };
        return new Error(messages[error] ?? error);
      }
    }
  } catch {
    if (body.trim()) return new Error(body.trim().slice(0, 300));
  }
  return new Error(`Ошибка авторизации (${response.status}).`);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) throw await getApiError(response);
      const payload = (await response.json()) as { user: AuthUser | null };
      setUser(payload.user);
      setStatus(payload.user ? 'authenticated' : 'guest');
    } catch (cause) {
      const requestError = cause instanceof Error ? cause : new Error(String(cause));
      setError(requestError);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const authenticate = useCallback(
    async (path: 'login' | 'register', nickname: string, password: string) => {
      setError(null);
      const response = await fetch(`/api/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
      });
      if (!response.ok) throw await getApiError(response);

      const payload = (await response.json()) as { user: AuthUser };
      setUser(payload.user);
      setStatus('authenticated');
    },
    []
  );

  const signIn = useCallback(
    (nickname: string, password: string) => authenticate('login', nickname, password),
    [authenticate]
  );

  const signUp = useCallback(
    (nickname: string, password: string) => authenticate('register', nickname, password),
    [authenticate]
  );

  const signOut = useCallback(async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (!response.ok) throw await getApiError(response);
    setUser(null);
    setStatus('guest');
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, error, refresh, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
