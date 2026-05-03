/**
 * Admin product editor row shape (was Supabase `products` row; now sourced from Sariee company API).
 */
export type AdminProductRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price_egp: number;
  category: string;
  image: string;
  in_stock: boolean;
  featured: boolean;
};
