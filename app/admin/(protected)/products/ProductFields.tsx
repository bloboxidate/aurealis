import type { Database } from '@/types/database';

type Row = Database['public']['Tables']['products']['Row'];

const CAT = [
  { v: 'skincare', l: 'Skincare' },
  { v: 'makeup', l: 'Makeup' },
  { v: 'fragrance', l: 'Fragrance' },
] as const;

type Defaults = Pick<
  Row,
  'id' | 'slug' | 'name_en' | 'name_ar' | 'description_en' | 'description_ar' | 'price_egp' | 'category' | 'image' | 'in_stock' | 'featured'
>;

export function ProductFields({ defaults, showIdField }: { defaults?: Partial<Defaults>; showIdField?: boolean }) {
  return (
    <div className="space-y-4 max-w-2xl">
      {showIdField && defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
      <label className="block space-y-1">
        <span className="text-xs text-slate-400">Slug (URL)</span>
        <input
          name="slug"
          required
          className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
          defaultValue={defaults?.slug}
          placeholder="golden-hour-serum"
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Name (EN)</span>
          <input
            name="name_en"
            required
            className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
            defaultValue={defaults?.name_en}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Name (AR)</span>
          <input
            name="name_ar"
            required
            className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
            defaultValue={defaults?.name_ar}
          />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-slate-400">Description (EN)</span>
        <textarea
          name="description_en"
          required
          rows={4}
          className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
          defaultValue={defaults?.description_en}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs text-slate-400">Description (AR)</span>
        <textarea
          name="description_ar"
          required
          rows={4}
          className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
          defaultValue={defaults?.description_ar}
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Price (EGP, whole numbers)</span>
          <input
            name="price_egp"
            type="number"
            min={0}
            required
            className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
            defaultValue={defaults?.price_egp}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Category</span>
          <select
            name="category"
            required
            className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
            defaultValue={defaults?.category}
          >
            {CAT.map((c) => (
              <option key={c.v} value={c.v}>
                {c.l}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-slate-400">Image path or URL (e.g. /placeholder-product.jpg)</span>
        <input
          name="image"
          required
          className="w-full rounded border border-slate-600 bg-slate-900/50 px-3 py-2 text-slate-100"
          defaultValue={defaults?.image}
        />
      </label>
      <div className="flex gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" name="in_stock" defaultChecked={defaults?.in_stock !== false} />
          In stock
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" name="featured" defaultChecked={defaults?.featured === true} />
          Featured
        </label>
      </div>
    </div>
  );
}
