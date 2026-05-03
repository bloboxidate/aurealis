import Link from 'next/link';
import { DeleteProductButton } from './DeleteProductButton';
import { ADMIN_BASE } from '@/lib/admin/const';
import { listCompanyProducts } from '@/lib/sariee/company-products';

export const dynamic = 'force-dynamic';

export default async function ProductsListPage() {
  let rows: { id: string; slug: string; name_en: string; price_egp: number; in_stock: boolean; featured: boolean }[] = [];
  let err: string | null = null;
  try {
    const list = await listCompanyProducts();
    rows = list.map((r) => ({
      id: r.id,
      slug: r.slug,
      name_en: r.name_en,
      price_egp: r.price_egp,
      in_stock: r.in_stock,
      featured: r.featured,
    }));
  } catch (e) {
    err = e instanceof Error ? e.message : 'Failed to load products';
  }

  if (err) {
    return (
      <div className="p-8 max-w-3xl text-slate-200">
        <h1 className="text-2xl font-semibold text-amber-200 mb-2">Products</h1>
        <p className="text-rose-400 text-sm">
          {err} — check <code className="text-amber-100">SARIEE_API_BEARER_TOKEN</code> and Sariee company access in
          this app&apos;s environment (e.g. Vercel).
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl text-slate-200">
      <div className="flex items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href={`${ADMIN_BASE}/products/new`}
          className="rounded border border-amber-200/30 bg-amber-200/10 px-4 py-2 text-sm text-amber-100 hover:bg-amber-200/20"
        >
          New product
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-slate-500 text-sm">No products from Sariee yet, or the list response shape does not match.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-700/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Name</th>
                <th className="p-3">EGP</th>
                <th className="p-3">Flags</th>
                <th className="p-3 w-40" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-800">
                  <td className="p-3 font-mono text-slate-500">{r.id.length > 12 ? `${r.id.slice(0, 8)}…` : r.id}</td>
                  <td className="p-3 text-amber-100/90">{r.slug}</td>
                  <td className="p-3">{r.name_en}</td>
                  <td className="p-3">{r.price_egp.toLocaleString()}</td>
                  <td className="p-3 text-slate-500">
                    {r.in_stock ? 'in stock' : 'oos'} · {r.featured ? 'featured' : '—'}
                  </td>
                  <td className="p-3 space-x-3">
                    <Link href={`${ADMIN_BASE}/products/${r.id}/edit`} className="text-amber-200 hover:underline">
                      Edit
                    </Link>
                    <DeleteProductButton id={r.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
