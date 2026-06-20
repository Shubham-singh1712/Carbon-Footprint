import { z } from "zod";

const supabaseConfigSchema = z.object({
  url: z.string().url(),
  anonKey: z.string().min(1),
});

export function getSupabaseBrowserConfig() {
  const result = supabaseConfigSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  return result.success ? result.data : null;
}

export function hasSupabaseConfig() {
  return getSupabaseBrowserConfig() !== null;
}
