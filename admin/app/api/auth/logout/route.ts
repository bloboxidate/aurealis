import { NextRequest, NextResponse } from 'next/server';
import { getCookieName, readSessionValue } from '@/lib/session';

function clearCookieStr(name: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [`${name}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

export async function POST(request: NextRequest) {
  if (!readSessionValue(request.headers.get('cookie')).ok) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const primary = getCookieName();
  const headers = new Headers();
  headers.append('Set-Cookie', clearCookieStr(primary));
  if (primary !== 'aurealis_admin') {
    headers.append('Set-Cookie', clearCookieStr('aurealis_admin'));
  }
  return NextResponse.json({ ok: true }, { headers });
}
