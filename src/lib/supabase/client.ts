import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/shared/database/types";

/**
 * Создает browser-side Supabase client
 * Cookies управляются автоматически через Supabase
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
