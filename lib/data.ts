export type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  category: 'skincare' | 'makeup' | 'fragrance';
  image: string;
  in_stock: boolean;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    slug: 'golden-hour-serum',
    name_en: 'Golden Hour Serum',
    name_ar: 'سيروم الساعة الذهبية',
    description_en: 'A luminosity-boosting serum enriched with 24K gold particles and hyaluronic acid for a radiant, dewy glow.',
    description_ar: 'سيروم يعزز الإشراق، مدعوم بجزيئات الذهب عيار 24 قيراط وحمض الهيالورونيك لبشرة مضيئة ومرطبة.',
    price: 850,
    category: 'skincare',
    image: '/placeholder-product.jpg',
    in_stock: true,
    featured: true,
  },
  {
    id: '2',
    slug: 'velvet-lip-elixir',
    name_en: 'Velvet Lip Elixir',
    name_ar: 'إكسير الشفاه المخملي',
    description_en: 'A luxurious lip treatment that combines bold pigment with deep hydration for lips that are irresistibly soft.',
    description_ar: 'علاج فاخر للشفاه يجمع بين الألوان الجريئة والترطيب العميق لشفاه ناعمة لا تُقاوم.',
    price: 420,
    category: 'makeup',
    image: '/placeholder-product.jpg',
    in_stock: true,
    featured: true,
  },
  {
    id: '3',
    slug: 'aurealis-signature-eau-de-parfum',
    name_en: 'Signature Eau de Parfum',
    name_ar: 'عطر أوريالس المميز',
    description_en: 'A captivating floral-oriental fragrance with notes of jasmine, amber, and sandalwood.',
    description_ar: 'عطر زهري شرقي ساحر بنفحات الياسمين والعنبر وخشب الصندل.',
    price: 1200,
    category: 'fragrance',
    image: '/placeholder-product.jpg',
    in_stock: true,
    featured: true,
  },
  {
    id: '4',
    slug: 'celestial-glow-highlighter',
    name_en: 'Celestial Glow Highlighter',
    name_ar: 'هايلايتر التوهج السماوي',
    description_en: 'A finely-milled powder highlighter that gives skin an ethereal, star-kissed luminosity.',
    description_ar: 'هايلايتر بودر ناعم يمنح البشرة لمعاناً أثيرياً كالنجوم.',
    price: 560,
    category: 'makeup',
    image: '/placeholder-product.jpg',
    in_stock: true,
    featured: true,
  },
  {
    id: '5',
    slug: 'radiance-face-oil',
    name_en: 'Radiance Face Oil',
    name_ar: 'زيت الوجه المشرق',
    description_en: 'A lightweight, fast-absorbing facial oil blended with rosehip, argan, and precious botanical extracts.',
    description_ar: 'زيت وجه خفيف سريع الامتصاص مزيج من ثمر الورد والأرجان ومستخلصات نباتية نادرة.',
    price: 980,
    category: 'skincare',
    image: '/placeholder-product.jpg',
    in_stock: true,
    featured: false,
  },
  {
    id: '6',
    slug: 'aurora-eye-palette',
    name_en: 'Aurora Eye Palette',
    name_ar: 'لوحة ظلال عيون أورورا',
    description_en: 'Nine celestial shades from champagne to deep plum, blendable and long-wearing.',
    description_ar: 'تسعة ظلال سماوية من الشامبانيا إلى البرقوق الداكن، قابلة للمزج وطويلة الثبات.',
    price: 750,
    category: 'makeup',
    image: '/placeholder-product.jpg',
    in_stock: false,
    featured: false,
  },
];

export const categories = ['skincare', 'makeup', 'fragrance'] as const;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
