import Link from 'next/link';
import { CreateForm } from '../CreateForm';

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-3xl text-slate-200">
      <p className="text-sm text-slate-500 mb-4">
        <Link href="/products" className="text-amber-200/90 hover:underline">
          ← Back to products
        </Link>
      </p>
      <h1 className="text-2xl font-semibold border-b border-slate-700/80 pb-4 mb-6">New product</h1>
      <CreateForm />
    </div>
  );
}
