import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Auth and data features will not work until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured."
  );
}

// createClient() throws on an empty URL, which would crash the Next.js
// build (including static/ISR pages that query Supabase, like /about and
// /blog) whenever these env vars aren't set yet. Fall back to a
// syntactically valid placeholder so the client constructs fine and
// queries simply fail at request time instead of taking down the build.
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-anon-key");
