// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_ prefixed env vars so they are available in client-side code
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Instead of throwing at build time, fall back gracefully
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing.");
}

// Export a client only if both vars exist
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : undefined;

