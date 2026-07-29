import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://ospvqktnstfmratkcmcr.supabase.co';
const supabaseKey = meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_McRDxHcGaMWurhQBvklv5w_UGoQi_Ce';

export const isSupabaseConfigured = Boolean(meta.env?.VITE_SUPABASE_URL && meta.env?.VITE_SUPABASE_ANON_KEY);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
