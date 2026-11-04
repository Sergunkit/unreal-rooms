import { useState, type FormEvent } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { language } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRussian = language === 'ru';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') await signIn(nickname, password);
      else await signUp(nickname, password);
      setPassword('');
      onOpenChange(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setError(null);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'login'
              ? isRussian
                ? 'Вход в аккаунт'
                : 'Sign in'
              : isRussian
                ? 'Создать аккаунт'
                : 'Create account'}
          </DialogTitle>
          <DialogDescription>
            {isRussian
              ? 'Войдите или зарегистрируйтесь по никнейму и паролю.'
              : 'Sign in or create an account with a nickname and password.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm">
            <span>{isRussian ? 'Никнейм' : 'Nickname'}</span>
            <Input
              autoComplete="username"
              autoFocus
              maxLength={24}
              minLength={3}
              onChange={(event) => setNickname(event.target.value)}
              required
              value={nickname}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>{isRussian ? 'Пароль' : 'Password'}</span>
            <Input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              maxLength={128}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button className="w-full" disabled={submitting} type="submit">
            {mode === 'login'
              ? isRussian
                ? 'Войти'
                : 'Sign in'
              : isRussian
                ? 'Зарегистрироваться'
                : 'Register'}
          </Button>
        </form>

        <Button
          className="w-full"
          onClick={() => {
            setMode((current) => (current === 'login' ? 'register' : 'login'));
            setError(null);
          }}
          type="button"
          variant="link"
        >
          {mode === 'login'
            ? isRussian
              ? 'Нет аккаунта? Зарегистрироваться'
              : 'New here? Create an account'
            : isRussian
              ? 'Уже есть аккаунт? Войти'
              : 'Already have an account? Sign in'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface AuthControlsProps {
  onOpenAuth: () => void;
}

export function AuthControls({ onOpenAuth }: AuthControlsProps) {
  const { language } = useLanguage();
  const { status, user, signOut, refresh, error: sessionError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isRussian = language === 'ru';

  if (status === 'loading') {
    return (
      <span className="text-sm text-muted-foreground">{isRussian ? 'Загрузка…' : 'Loading…'}</span>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-destructive">
          {sessionError?.message ?? 'Ошибка авторизации'}
        </span>
        <Button onClick={() => void refresh()} size="sm" variant="outline">
          {isRussian ? 'Повторить' : 'Retry'}
        </Button>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-32 truncate text-sm sm:inline">{user.nickname}</span>
        <Button
          aria-label={isRussian ? 'Выйти' : 'Sign out'}
          onClick={async () => {
            setError(null);
            try {
              await signOut();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : String(cause));
            }
          }}
          size="icon"
          title={error ?? (isRussian ? 'Выйти' : 'Sign out')}
          variant="secondary"
        >
          <LogOut />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onOpenAuth} size="sm" variant="secondary">
      <UserRound />
      <span>{isRussian ? 'Войти' : 'Sign in'}</span>
    </Button>
  );
}
