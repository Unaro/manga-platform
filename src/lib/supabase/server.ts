import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/shared/database/generated.types";

/**
 * Создает server-side Supabase client с cookies для auth
 * Использует anon key вместо service role для корректной работы RLS
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Server Component - ignore
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Server Component - ignore
        }
      },
    },
  });
}

/**
 * Type helpers для users table
 */
export type DbUser = Database["public"]["Tables"]["users"]["Row"];
export type DbUserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type DbUserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type DbUserRole = Database["public"]["Enums"]["user_role"];
