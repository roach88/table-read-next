import type { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  getSession,
  onAuthStateChange,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from '../services/auth';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: any;
  signUp: typeof signUp;
  signIn: typeof signIn;
  signOut: typeof signOut;
  resetPassword: typeof resetPassword;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider wraps your app and provides authentication state/context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setLoading(true);
    getSession()
      .then(({ session, error }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setError(error);
        setLoading(false);
      });
    unsubscribe = onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

/**
 * useAuth hook provides authentication state and helpers
 * Usage: const { user, signIn, signOut, ... } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthProvider;