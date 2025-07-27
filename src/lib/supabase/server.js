import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function createClient() {
  const cookieStore = await cookies(); // ✅ CORRETO
  return createServerComponentClient({ cookies: () => cookieStore });
}