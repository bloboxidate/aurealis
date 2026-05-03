import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/data';
import ProductPageClient from './ProductPageClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
