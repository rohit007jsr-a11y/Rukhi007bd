import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const DEFAULT_SUPABASE_URL = 'https://ospvqktnstfmratkcmcr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcHZxa3Ruc3RmbXJhdGtjbWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjY0MjIsImV4cCI6MjEwMDc0MjQyMn0.vz0mpDS_t65gw8zhGfeqqXfrdlwIodgM3huBm_TVfhA';

const supabaseUrl = meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = meta.env?.VITE_SUPABASE_ANON_KEY || meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

