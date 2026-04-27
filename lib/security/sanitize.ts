import 'server-only';

export function sanitizePlainText(s: string, maxLen: number): string {
  const t = s.replace(/\0/g, '').replace(/[<>]/g, '').trim();
  return t.length > maxLen ? t.slice(0, maxLen) : t;
}
