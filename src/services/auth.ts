import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<{ user: User | null; error: any }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: 'https://your-app.com/auth/callback' }
  });
  return { user: data?.user ?? null, error };
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, error };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: any }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string): Promise<{ error: any }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{ session: Session | null; error: any }> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
}

/**
 * Listen for auth state changes
 * @param callback (event, session) => void
 * @returns unsubscribe function
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => listener?.subscription.unsubscribe();
}