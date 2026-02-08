import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  language: 'ru' | 'en';
}

export function AuthModal({ open, onClose, language }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Test server health
  const testServerHealth = async () => {
    try {
      const serverUrl = `https://${(window as any).__SUPABASE_PROJECT_ID__}.supabase.co/functions/v1/make-server-4cfee19e`;
      console.log('Testing server at:', serverUrl);
      
      const response = await fetch(`${serverUrl}/health`);
      const data = await response.json();
      console.log('Server health:', data);
      toast.success('Server is online!');
    } catch (error) {
      console.error('Server health check failed:', error);
      toast.error('Server is offline or unreachable');
    }
  };

  const t = {
    signIn: language === 'ru' ? 'Вход' : 'Sign In',
    signUp: language === 'ru' ? 'Регистрация' : 'Sign Up',
    email: language === 'ru' ? 'Email' : 'Email',
    password: language === 'ru' ? 'Пароль' : 'Password',
    confirmPassword: language === 'ru' ? 'Подтвердите пароль' : 'Confirm Password',
    name: language === 'ru' ? 'Имя' : 'Name',
    signInButton: language === 'ru' ? 'Войти' : 'Sign In',
    signUpButton: language === 'ru' ? 'Зарегистрироваться' : 'Sign Up',
    welcomeBack: language === 'ru' ? 'Добро пожаловать!' : 'Welcome Back!',
    joinUs: language === 'ru' ? 'Присоединяйтесь к нам' : 'Join Us',
    description: language === 'ru' ? 'Войдите или зарегистрируйтесь для бронирования отелей' : 'Sign in or sign up to book hotels',
    signInSuccess: language === 'ru' ? 'Вы успешно вошли!' : 'Successfully signed in!',
    signUpSuccess: language === 'ru' ? 'Регистрация успешна!' : 'Successfully signed up!',
    passwordMismatch: language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match',
    fillAllFields: language === 'ru' ? 'Заполните все поля' : 'Please fill all fields',
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInEmail || !signInPassword) {
      toast.error(t.fillAllFields);
      return;
    }

    setIsLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      toast.success(t.signInSuccess);
      onClose();
      resetForms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      toast.error(t.fillAllFields);
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(signUpEmail, signUpPassword, signUpName);
      toast.success(t.signUpSuccess);
      onClose();
      resetForms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setSignInEmail('');
    setSignInPassword('');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              unreal rooms
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
            <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">{t.welcomeBack}</h3>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.email}
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.password}
                </Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                disabled={isLoading}
              >
                {isLoading ? '...' : t.signInButton}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">{t.joinUs}</h3>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t.name}
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder={language === 'ru' ? 'Ваше имя' : 'Your name'}
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.email}
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.password}
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.confirmPassword}
                </Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                disabled={isLoading}
              >
                {isLoading ? '...' : t.signUpButton}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}