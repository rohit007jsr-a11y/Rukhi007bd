import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || '';
const supabaseKey =
  meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  meta.env?.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://ospvqktnstfmratkcmcr.supabase.co',
  supabaseKey || 'sb_publishable_McRDxHcGaMWurhQBvklv5w_UGoQi_Ce'
);
