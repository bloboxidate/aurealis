import 'server-only';
import { Buffer } from 'node:buffer';

import { withNoStore } from '@/lib/security/secure-api-headers';

const jsonErr = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...withNoStore(),
    },
  });

export async function readJsonWithLimit(
  request: Request,
  maxBytes: number
): Promise<{ ok: true; data: unknown } | { ok: false; response: Response }> {
  const cl = request.headers.get('content-length');
  if (cl) {
    const n = Number(cl);
    if (Number.isFinite(n) && n > maxBytes) {
      return { ok: false, response: jsonErr({ error: 'payload_too_large' }, 413) };
    }
  }
  const text = await request.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) {
    return { ok: false, response: jsonErr({ error: 'payload_too_large' }, 413) };
  }
  let data: unknown;
  try {
    data = text.length ? JSON.parse(text) : null;
  } catch {
    return { ok: false, response: jsonErr({ error: 'invalid_json' }, 400) };
  }
  return { ok: true, data };
}
