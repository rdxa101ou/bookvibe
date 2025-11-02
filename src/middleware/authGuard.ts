import { supabase } from '@/lib/supabaseClient';
import { NextRouter } from 'next/router';

export async function authGuard(router: NextRouter) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    router.push('/login');
  }
}
