import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditForm } from '../../EditForm';
import { ADMIN_BASE } from '@/lib/admin/const';
import { getCompanyProductById } from '@/lib/sariee/company-products';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCompanyProductById(id);
  if (!data) {
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
