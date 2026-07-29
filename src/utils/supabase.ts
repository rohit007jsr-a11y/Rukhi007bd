import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://ospvqktnstfmratkcmcr.supabase.co';
const supabaseKey = meta.env?.VITE_SUPABASE_ANON_KEY || meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseKey) {
  console.warn('Warning: VITE_SUPABASE_ANON_KEY environment variable is missing.');
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient = createClient(
  supabaseUrl, 
  supabaseKey || 'dummy_key_to_prevent_crash'
);

