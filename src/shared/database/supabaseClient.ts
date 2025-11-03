import { createClient } from '@supabase/supabase-js';

/**
 * Supabase клиент приложения.
 * NOTE: Тип DB = any используется как ВРЕМЕННЫЙ placeholder до генерации типов Supabase.
 * План замены: сгенерировать типы через CLI и заменить на строго типизированный Database интерфейс.
 */
export type DB = any; // PLACEHOLDER — см. TYPE_USAGE.md

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false } }
);
