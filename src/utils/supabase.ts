import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL;
const supabaseKey = meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY must be set.');
}

export const isSupabaseConfigured = true;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
