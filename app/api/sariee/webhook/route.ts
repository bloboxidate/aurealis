import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { withNoStore } from '@/lib/security/secure-api-headers';

export const dynamic = 'force-dynamic';

/**
 * Inbound Sariee webhooks (often omitted from public Postman). Register this URL in Sariee
 * when they provide a callback field, e.g. https://YOUR_DOMAIN/api/sariee/webhook
 *
 * Set SARIEE_WEBHOOK_SECRET and send the same value in header X-Sariee-Webhook-Secret or X-Webhook-Secret.
 * Extend this route to verify signatures / dispatch work if Sariee documents a different scheme.
 */
function timingSafeStringEq(a: string, b: string): boolean {
  const A = Buffer.from(a, 'utf8');
  const B = Buffer.from(b, 'utf8');
  if (A.length !== B.length) return false;
  return timingSafeEqual(A, B);
}

export async function POST(request: Request) {
  const secret = process.env.SARIEE_WEBHOOK_SECRET;
  if (!secret || secret.length < 8) {
    return NextResponse.json(
      {
        error: 'webhook_not_configured',
        message: 'Set SARIEE_WEBHOOK_SECRET (server-only, min 8 characters) to accept callbacks.',
      },
      { status: 503, headers: withNoStore() }
    );
  }
  const got =
    request.headers.get('x-sariee-webhook-secret') ??
    request.headers.get('x-webhook-secret') ??
    '';
  if (!timingSafeStringEq(got, secret)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: withNoStore() });
  }
  await request.arrayBuffer().catch(() => null);
  return NextResponse.json({ ok: true }, { headers: withNoStore() });
}
