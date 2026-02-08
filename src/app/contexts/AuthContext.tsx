import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase, serverUrl } from '../utils/supabase';
import { publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const refreshTimerRef = useRef<number | null>(null);

  const handleTokenExpiration = async () => {
    console.log('🔐 Session expired, logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    setAccessToken(null);
    setRefreshToken(null);
    setTokenExpiresAt(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const currentRefreshToken = localStorage.getItem('refresh_token');
    
    if (!currentRefreshToken) {
      console.error('No refresh token available');
      await handleTokenExpiration();
      return;
    }

    try {
      console.log('Refreshing access token...');
      
      const response = await fetch(`${serverUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to refresh token:', data.error);
        await handleTokenExpiration();
        return;
      }

      if (!data.accessToken) {
        console.error('No access token in refresh response');
        await handleTokenExpiration();
        return;
      }

      // Update access token and expiration
      const newExpiresAt = Date.now() + (data.expiresIn * 1000);
      
      setAccessToken(data.accessToken);
      setTokenExpiresAt(newExpiresAt);
      
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('token_expires_at', newExpiresAt.toString());

      console.log('✅ Access token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing access token:', error);
      await handleTokenExpiration();
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      console.log('=== FETCHING PROFILE ===');
      console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
      console.log('Token length:', token.length);
      console.log('Server URL:', serverUrl);
      
      // Pass token as query parameter to avoid Supabase JWT validation
      // But still need Authorization header for Supabase Edge Functions middleware
      const response = await fetch(`${serverUrl}/profile?token=${encodeURIComponent(token)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('Profile response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('Profile fetch successful:', userData);
        setUser(userData);
      } else {
        const errorText = await response.text();
        console.error('Profile fetch failed - Status:', response.status);
        console.error('Profile fetch failed - Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        
        console.error('Failed to fetch user profile:', errorData);
        
        // If token expired, try to refresh
        if (response.status === 401) {
          console.log('Token expired, attempting refresh...');
          await refreshAccessToken();
        } else {
          await handleTokenExpiration();
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      await handleTokenExpiration();
    }
  };

  const checkServerVersion = async () => {
    try {
      const response = await fetch(`${serverUrl}/health`);
      const data = await response.json();
      console.log('✅ Server version:', data.version || 'unknown');
    } catch (error) {
      console.error('Failed to check server version:', error);
    }
  };

  const checkSession = async () => {
    try {
      // Check for tokens in localStorage
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedExpiresAt = localStorage.getItem('token_expires_at');
      
      if (storedAccessToken && storedRefreshToken && storedExpiresAt) {
        const expiresAt = parseInt(storedExpiresAt);
        const now = Date.now();

        // If access token expired, try to refresh it
        if (expiresAt < now) {
          console.log('Access token expired, attempting refresh...');
          setRefreshToken(storedRefreshToken);
          await refreshAccessToken();
        } else {
          // Access token still valid
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setTokenExpiresAt(expiresAt);
          await fetchUserProfile(storedAccessToken);
        }
      }
    } catch (error) {
      console.error('Error in checkSession:', error);
      await handleTokenExpiration();
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkServerVersion();
    checkSession();
  }, []);

  // Setup auto-refresh when access token is set
  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!accessToken || !tokenExpiresAt || !refreshToken) {
      return;
    }

    // Calculate when to refresh (1 minute before expiration)
    const now = Date.now();
    const expiresIn = tokenExpiresAt - now;
    const refreshIn = Math.max(expiresIn - 60 * 1000, 0); // Refresh 1 min before expiry

    console.log(`⏰ Access token expires in ${Math.floor(expiresIn / 1000)}s, will refresh in ${Math.floor(refreshIn / 1000)}s`);

    refreshTimerRef.current = window.setTimeout(() => {
      console.log('🔄 Auto-refreshing access token...');
      refreshAccessToken();
    }, refreshIn);
    
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [accessToken, tokenExpiresAt, refreshToken]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${serverUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // After signup, sign in the user
      await signIn(email, password);
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      console.log('Server URL:', serverUrl);
      
      // Use server-side sign in
      const response = await fetch(`${serverUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Sign in response status:', response.status);

      let data;
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      console.log('Sign in raw response:', responseText);
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }
      } else {
        console.error('Non-JSON response:', responseText);
        throw new Error(`Server error: ${responseText.substring(0, 100)}`);
      }
      
      console.log('Sign in response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to sign in');
      }

      if (!data.accessToken || !data.refreshToken || !data.user) {
        throw new Error('Invalid response from server: missing tokens or user data');
      }

      // Calculate expiration time
      const expiresAt = Date.now() + (data.expiresIn * 1000);

      // Store tokens in localStorage
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('token_expires_at', expiresAt.toString());
      
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setTokenExpiresAt(expiresAt);
      setUser(data.user);
      
      console.log('✅ Sign in successful, tokens stored');
      console.log(`Access token expires in ${data.expiresIn}s`);
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      await handleTokenExpiration();
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  };

  const updateProfile = async (name: string) => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      // Pass token as query parameter
      // But still need Authorization header for Supabase Edge Functions middleware
      const response = await fetch(`${serverUrl}/profile?token=${encodeURIComponent(accessToken)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh and retry
        if (response.status === 401) {
          console.log('Token expired during profile update, refreshing...');
          await refreshAccessToken();
          throw new Error('Token expired, please try again');
        }
        throw new Error(data.error || 'Failed to update profile');
      }

      if (user) {
        setUser({ ...user, name });
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
