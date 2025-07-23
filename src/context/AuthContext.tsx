import React, { createContext, useContext, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  supabaseLogin: (email: string, password: string) => Promise<boolean>;
  supabaseRegister: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  supabaseLogout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = React.useState<SupabaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: parseInt(session.user.id.slice(-8), 16),
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || ''
          });
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: parseInt(session.user.id.slice(-8), 16),
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || ''
          });
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const mockUser: User = {
        id: 1,
        name: email.split('@')[0],
        email: email
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const supabaseLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await AuthService.signIn(email, password);
      return true;
    } catch (error) {
      console.error('Supabase login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = (name: string, email: string, password: string) => {
    // Mock registration - in real app, this would call an API
    if (name && email && password) {
      const mockUser: User = {
        id: Date.now(),
        name: name,
        email: email
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const supabaseRegister = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setLoading(true);
      await AuthService.signUp(email, password, name, phone);
      return true;
    } catch (error) {
      console.error('Supabase register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const supabaseLogout = async (): Promise<void> => {
    try {
      setLoading(true);
      await AuthService.signOut();
    } catch (error) {
      console.error('Supabase logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      login,
      register,
      supabaseLogin,
      supabaseRegister,
      logout,
      supabaseLogout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}