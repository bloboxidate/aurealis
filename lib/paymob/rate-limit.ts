type Bucket = { count: number; windowStart: number };

const store = new Map<string, Bucket>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = store.get(key);
  if (!b || now - b.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (b.count >= max) return false;
  b.count += 1;
  return true;
}
