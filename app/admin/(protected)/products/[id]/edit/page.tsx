import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceSupabase } from '@/lib/admin/supabase-service';
import { EditForm } from '../../EditForm';
import { ADMIN_BASE } from '@/lib/admin/const';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getServiceSupabase();
  const { data, error } = await sb.from('products').select('*').eq('id', id).maybeSingle();
  if (error || !data) {
    notFound();
  }
  return (
    <div className="p-8 max-w-3xl text-slate-200">
      <p className="text-sm text-slate-500 mb-4">
        <Link href={`${ADMIN_BASE}/products`} className="text-amber-200/90 hover:underline">
          ← Back to products
        </Link>
      </p>
      <h1 className="text-2xl font-semibold border-b border-slate-700/80 pb-4 mb-6">Edit product</h1>
      <EditForm product={data} />
    </div>
  );
}
