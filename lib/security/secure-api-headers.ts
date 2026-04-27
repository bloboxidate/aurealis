import 'server-only';

export const NO_STORE_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  Pragma: 'no-cache',
} as const;

export function withNoStore(h: Record<string, string> = {}): Record<string, string> {
  return { ...h, ...NO_STORE_CACHE };
}
