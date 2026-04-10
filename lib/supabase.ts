import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Klien Supabase untuk app (anon key + URL dari .env).
 * Pastikan .env berisi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY.
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
