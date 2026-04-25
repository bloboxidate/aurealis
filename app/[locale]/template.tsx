/**
 * Subtle per-navigation fade so locale/page changes feel soft rather than abrupt.
 * Keep opacity delta small—luxury UI avoids flashy transitions.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <div className="lux-page-shell">{children}</div>;
}
