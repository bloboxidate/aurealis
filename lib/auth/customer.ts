import 'server-only';

import { cookies } from 'next/headers';
import {
  AUREALIS_CUSTOMER_EMAIL_COOKIE,
  AUREALIS_CUSTOMER_NAME_COOKIE,
  AUREALIS_SF_BEARER_COOKIE,
  SARIEE_SESSION_COOKIE,
} from '@/lib/sariee/auth-cookies';

export type CustomerPrincipal = {
  email: string | null;
  name: string | null;
};

/**
 * Storefront customer from Sariee session / profile cookies (set by `/api/auth/sariee/*`).
 */
export async function getCustomer(): Promise<{ user: CustomerPrincipal | null }> {
  const c = await cookies();
  const session = c.get(SARIEE_SESSION_COOKIE)?.value;
  const bearer = c.get(AUREALIS_SF_BEARER_COOKIE)?.value;
  const email = c.get(AUREALIS_CUSTOMER_EMAIL_COOKIE)?.value ?? null;
  const name = c.get(AUREALIS_CUSTOMER_NAME_COOKIE)?.value ?? null;
  if (!session && !bearer && !email) return { user: null };
  return { user: { email, name } };
}
