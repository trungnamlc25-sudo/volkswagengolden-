import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const cleanSupabaseUrl = (url: string): string => {
  if (!url) return '';
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
};

// Get credentials from Vite environment variables or localStorage (allows config directly from Admin UI)
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback to local storage if user configured in Admin Settings directly
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('vw_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('vw_supabase_anon_key') || '' : '';

export const SUPABASE_URL = cleanSupabaseUrl(envUrl || storedUrl);
export const SUPABASE_ANON_KEY = (envKey || storedKey).trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://'));
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance) {
    clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return clientInstance;
};
