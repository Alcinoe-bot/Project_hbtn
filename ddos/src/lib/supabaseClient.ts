import { createClient } from "@supabase/supabase-js";

const url  = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

console.log("[SUPABASE] URL:", url);
console.log("[SUPABASE] ANON present:", !!anon);

export const supabase = createClient(url, anon);
