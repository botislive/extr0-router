import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are present or fallback to safe defaults for local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qoqxwtvraacuesiwysiz.supabase.co"; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key";

if (supabaseAnonKey === "dummy_key") {
  console.warn("⚠️ Supabase Anon Key missing. Realtime features will fail.");
}

// Global supabase client instance for the Next.js app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
