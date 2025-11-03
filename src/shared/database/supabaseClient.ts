import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './generated.types';

/**
 * Строго типизированный Supabase клиент для доступа к БД.
 * Использует автогенерируемые типы из Supabase CLI.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false } }
);
