import type { User } from '@supabase/supabase-js';

/** Sariee-backed session from `/api/auth/sariee/me` (client-safe shape). */
export type StorefrontAuthUser = { email?: string | null; name?: string | null };

export function getUserDisplayName(user: User | StorefrontAuthUser): string {
  if ('user_metadata' in user) {
    const fromMeta = user.user_metadata?.full_name;
    if (typeof fromMeta === 'string' && fromMeta.trim()) {
      return fromMeta.trim();
    }
  }
  if ('name' in user && typeof user.name === 'string' && user.name.trim()) {
    return user.name.trim();
  }
  const email = 'email' in user && typeof user.email === 'string' ? user.email : null;
  if (email) {
    const local = email.split('@')[0];
    return local || email;
  }
  return '—';
}
