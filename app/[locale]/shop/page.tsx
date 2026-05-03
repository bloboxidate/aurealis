import { getAllProducts } from '@/lib/data';
import ShopView from './ShopView';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getAllProducts();
  return <ShopView products={products} />;
}
