import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthManagerContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithOtp: (email: string, redirectTo?: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthManagerContext = createContext<AuthManagerContextType | undefined>(undefined);

export function AuthManagerProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const authStateChangeRef = useRef<any>(null);

  // Función para actualizar el estado de autenticación
  const updateAuthState = (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setLoading(false);
    setIsInitialized(true);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Obtener sesión inicial
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (error) {
            console.error('Error getting initial session:', error);
            updateAuthState(null);
          } else {
            updateAuthState(session);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          updateAuthState(null);
        }
      }
    };

    // Inicializar autenticación
    initializeAuth();

    // Configurar listener de cambios de autenticación (solo una vez)
    if (!authStateChangeRef.current) {
      authStateChangeRef.current = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (isMounted) {
            updateAuthState(session);
          }
        }
      );
    }

    return () => {
      isMounted = false;
      if (authStateChangeRef.current) {
        authStateChangeRef.current.data.subscription.unsubscribe();
        authStateChangeRef.current = null;
      }
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.session) {
        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          updateAuthState(data.session);
        }, 100);
      }
      
      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOtp = async (email: string, redirectTo?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        }
      });
      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        updateAuthState(data.session);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value = {
    session,
    user,
    loading,
    isInitialized,
    signInWithEmail,
    signUpWithEmail,
    signInWithOtp,
    verifyOtp,
    signOut,
    refreshSession,
  };

  return (
    <AuthManagerContext.Provider value={value}>
      {children}
    </AuthManagerContext.Provider>
  );
}

export function useAuthManager() {
  const context = useContext(AuthManagerContext);
  if (context === undefined) {
    throw new Error('useAuthManager must be used within an AuthManagerProvider');
  }
  return context;
}
