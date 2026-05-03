import 'server-only';
import {
  createCipheriv,
  createDecipheriv,
  scryptSync,
  randomBytes,
  createHmac,
  timingSafeEqual,
} from 'node:crypto';

const PAYLOAD_DAYS = 3;
const SALT = 'aurealis-admin-sess-aes256-v1';
const KEY_LEN = 32;
const IV_LEN = 12;
const ALGO = 'aes-256-gcm';

/**
 * Browsers: `__Secure-` name requires `Secure` + HTTPS. Use plain name on http (local dev).
 */
export function getCookieName(): string {
  const useSecureName =
    process.env.NODE_ENV === 'production' &&
    (process.env.VERCEL === '1' || process.env.USE_SECURE_COOKIE === '1');
  return useSecureName ? '__Secure-aurealis_admin' : 'aurealis_admin';
}

/** Backward compat: export for logout route */
export const COOKIE = 'aurealis_admin';

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SESSION_SECRET must be set (min 32 characters) in production');
    }
    return 'dev-only-secret-CHANGE-ME-in-production-32ch!!';
  }
  return s;
}

let derivedKey: Buffer | null = null;
function getAesKey(): Buffer {
  if (!derivedKey) {
    derivedKey = scryptSync(getSecret(), SALT, KEY_LEN) as Buffer;
  }
  return derivedKey;
}

/**
 * Build encrypted, integrity-protected session (AES-256-GCM). Confidentiality + GCM auth tag.
 * v1 HMAC-SHA256 cookies are still accepted in readSessionValue until all clients rotate.
 */
export function buildSessionValue(): { token: string; cookieHeader: string } {
  const exp = Date.now() + PAYLOAD_DAYS * 24 * 60 * 60 * 1000;
  const sessionId = randomBytes(16).toString('hex');
  const payload = JSON.stringify({ v: 2, exp, sid: sessionId });
  const key = getAesKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv, { authTagLength: 16 });
  const enc = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const packed = Buffer.concat([iv, tag, enc]).toString('base64url');
  const token = `v2.${packed}`;
  const name = getCookieName();
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = PAYLOAD_DAYS * 24 * 60 * 60;
  const parts = [
    `${name}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ];
  if (isProd) {
    parts.push('Secure');
  }
  return { token, cookieHeader: parts.join('; ') };
}

function cookieNameRegex(name: string): RegExp {
  return new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]+)`);
}

export function readSessionValue(cookieHeader: string | null | undefined): { ok: true } | { ok: false } {
  if (!cookieHeader) return { ok: false };
  const name = getCookieName();
  let m = cookieHeader.match(cookieNameRegex(name));
  if (!m?.[1] && name.startsWith('__')) {
    m = cookieHeader.match(cookieNameRegex('aurealis_admin'));
  }
  if (!m?.[1]) return { ok: false };
  const token = decodeURIComponent(m[1]);
  if (!token.startsWith('v2.')) {
    return tryLegacyHmacToken(token) ? { ok: true } : { ok: false };
  }
  const packed = token.slice(3);
  let buf: Buffer;
  try {
    buf = Buffer.from(packed, 'base64url');
  } catch {
    return { ok: false };
  }
  if (buf.length < IV_LEN + 16 + 1) return { ok: false };
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + 16);
  const enc = buf.subarray(IV_LEN + 16);
  const key = getAesKey();
  try {
    const d = createDecipheriv(ALGO, key, iv, { authTagLength: 16 });
    d.setAuthTag(tag);
    const plain = Buffer.concat([d.update(enc), d.final()]).toString('utf8');
    const j = JSON.parse(plain) as { exp: number; v: number };
    if (j.v !== 2 || j.exp < Date.now()) return { ok: false };
  } catch {
    return { ok: false };
  }
  return { ok: true };
}

/** One-time read for legacy v1 HMAC session after deploy. */
function tryLegacyHmacToken(token: string): boolean {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const secret = getSecret();
  const expSig = createHmac('sha256', secret).update(payload, 'utf8').digest('base64url');
  if (expSig.length !== sig.length) return false;
  if (!timingSafeEqual(Buffer.from(expSig, 'utf8'), Buffer.from(sig, 'utf8'))) {
    return false;
  }
  try {
    const j = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp: number; v: number };
    if (j.v !== 1 || j.exp < Date.now()) return false;
  } catch {
    return false;
  }
  return true;
}
