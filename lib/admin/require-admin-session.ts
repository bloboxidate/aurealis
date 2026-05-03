import 'server-only';
import { headers } from 'next/headers';
import { readSessionValue } from '@/lib/admin/session';

export async function assertAdminSession(): Promise<void> {
  const h = await headers();
  if (!readSessionValue(h.get('cookie')).ok) {
    throw new Error('Unauthorized');
  }
}
