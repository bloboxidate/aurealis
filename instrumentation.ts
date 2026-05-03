export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;
  const { assertProductionConfiguration } = await import('@/lib/env/assert-production');
  assertProductionConfiguration();
}
