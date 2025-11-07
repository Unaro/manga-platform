import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/generated.types";

/**
 * Создает server-side Supabase client с типизацией
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Type helper для users table
 */
export type DbUser = Database["public"]["Tables"]["users"]["Row"];
export type DbUserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type DbUserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type DbUserRole = Database["public"]["Enums"]["user_role"];
