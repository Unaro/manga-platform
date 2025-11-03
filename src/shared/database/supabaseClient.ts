import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './generated.types';

const mask = (v?: string | null) => {
  try { return v ? `${new URL(v).origin}/...` : 'MISSING'; } catch { return 'INVALID_URL'; }
};
const has = (v?: string | null) => (!!v ? 'OK' : 'MISSING');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('[SupabaseClient:init]', {
    url: mask(url),
    serviceRoleKey: has(serviceKey),
  });
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  url as string,
  serviceKey as string,
  { auth: { persistSession: false } }
);
