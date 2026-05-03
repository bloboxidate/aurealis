import * as bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'node:crypto';

/**
 * Set ADMIN_PASS_HASH in production (bcrypt). For local only: ADMIN_DEV_PASSWORD
 * and leave ADMIN_PASS_HASH unset (plain ADMIN_DEV_PASSWORD is only for non-production).
 */
export async function verifyPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASS_HASH;
  const dev = process.env.ADMIN_DEV_PASSWORD;
  if (hash && hash.length > 0) {
    return bcrypt.compare(plain, hash);
  }
  if (process.env.NODE_ENV !== 'production' && dev) {
    return timingSafeStringEqual(plain, dev);
  }
  return false;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const A = Buffer.from(a, 'utf8');
  const B = Buffer.from(b, 'utf8');
  if (A.length !== B.length) return false;
  return timingSafeEqual(A, B);
}
