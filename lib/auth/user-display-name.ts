import type { User } from '@supabase/supabase-js';

export function getUserDisplayName(user: User): string {
  const fromMeta = user.user_metadata?.full_name;
  if (typeof fromMeta === 'string' && fromMeta.trim()) {
    return fromMeta.trim();
  }
  if (user.email) {
    const local = user.email.split('@')[0];
    return local || user.email;
  }
  return '—';
}
