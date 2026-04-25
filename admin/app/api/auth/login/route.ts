import { NextRequest, NextResponse } from 'next/server';
import { buildSessionValue } from '@/lib/session';
import { verifyPassword } from '@/lib/auth-password';
import { checkLoginRate } from '@/lib/rate-limit';

const WINDOW_MS = 15 * 60_000;
const MAX = 8;

function getClientIp(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

const MAX_BODY = 24_576;

export async function POST(request: NextRequest) {
  if (!checkLoginRate(getClientIp(request), MAX, WINDOW_MS)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const text = await request.text();
  if (Buffer.byteLength(text, 'utf8') > MAX_BODY) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  let body: { password?: string };
  try {
    body = text ? (JSON.parse(text) as { password?: string }) : {};
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length > 4000) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { cookieHeader } = buildSessionValue();
  return NextResponse.json({ ok: true } as const, { headers: { 'Set-Cookie': cookieHeader } });
}
