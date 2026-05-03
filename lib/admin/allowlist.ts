/**
 * Optional VPN-style gate: set ADMIN_ALLOWED_IPS to a comma list of CIDR/IPs (simple suffix match: exact IP or prefix).
 * Example: 203.0.113.0,198.51.100.4
 */
export function isIpAllowed(
  firstForwardedIp: string,
  list: string | undefined
): boolean {
  if (!list || list.trim() === '') return true;
  const allow = list.split(',').map((s) => s.trim()).filter(Boolean);
  const client = firstForwardedIp || '';
  for (const a of allow) {
    if (a === client) return true;
    if (client.startsWith(a)) return true;
  }
  return false;
}
