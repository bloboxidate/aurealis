import { getAllProducts } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SearchView } from './SearchView';

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const products = await getAllProducts();
  return (
    <>
      <Navbar />
      <SearchView products={products} />
      <Footer />
    </>
  );
}
