import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Thin wrapper over Supabase Auth. There is deliberately no client-side
 * signup — the admin account is provisioned once from the Supabase
 * dashboard (Authentication -> Users -> Add user), so the write path to
 * the portfolio's content can't be self-served by anyone who finds the
 * hidden route.
 */

export async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) return () => {};
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => subscription.unsubscribe();
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
