import 'server-only';

/**
 * Strips common XSS vectors for plain-text fields. React escapes on output, but
 * this keeps untrusted data clean before it reaches DB / external APIs (Paymob, etc.).
 */
export function sanitizePlainText(s: string, maxLen: number): string {
  const t = s.replace(/\0/g, '').replace(/[<>]/g, '').trim();
  return t.length > maxLen ? t.slice(0, maxLen) : t;
}
