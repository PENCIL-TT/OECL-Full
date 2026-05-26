import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lbimikyjhyewlssnaegl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaW1pa3lqaHlld2xzc25hZWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTA3NTYsImV4cCI6MjA2NzcyNjc1Nn0.CFRWvEcR9P5YNqHwI1wJ7qsCTuGTO_MwRAq5nhRr3xo"; // your anon key

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
