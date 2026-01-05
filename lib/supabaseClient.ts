// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Ensure these env variables are at project root and prefixed with NEXT_PUBLIC_
// .env.local
// NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or ANON key is missing. Check .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
