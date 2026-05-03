export type StorefrontAuthUser = { email?: string | null; name?: string | null };

export function getUserDisplayName(user: StorefrontAuthUser): string {
  if (user.name?.trim()) return user.name.trim();
  if (user.email) {
    const local = user.email.split('@')[0];
    return local || user.email;
  }
  return '—';
}
