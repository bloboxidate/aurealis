type Bucket = { count: number; start: number };

const buckets = new Map<string, Bucket>();

export function checkLoginRate(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.start > windowMs) {
    buckets.set(key, { count: 1, start: now });
    return true;
  }
  if (b.count >= max) return false;
  b.count += 1;
  return true;
}
