export const categories = ['skincare', 'makeup', 'fragrance'] as const;

export type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  /** Whole EGP (same as legacy lib/data, Paymob line cents = price * 100) */
  price: number;
  category: (typeof categories)[number];
  image: string;
  in_stock: boolean;
  featured: boolean;
  ingredients: string;
  ingredients_ar: string;
  how_to_use: string;
  how_to_use_ar: string;
};
