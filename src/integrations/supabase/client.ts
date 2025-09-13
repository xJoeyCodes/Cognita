import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://faudbhjqipvrlnfklpvt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdWRiaGpxaXB2cmxuZmtscHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzA5MzcsImV4cCI6MjA3MzEwNjkzN30.oQEo8USVmtJlFBkla1kCeHoGGqFhK9rxBdbaadigpD8";


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});