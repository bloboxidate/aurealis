export function getSafeNextPath(fallback: string, candidate: string | null): string {
  if (!candidate || !candidate.startsWith('/')) return fallback;
  if (candidate.startsWith('//')) return fallback;
  if (candidate.includes(':')) return fallback;
  return candidate;
}
