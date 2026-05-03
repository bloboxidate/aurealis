-- Product catalog: public read for the storefront; admin app uses the service role key to insert/update/delete.

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  description_en text not null,
  description_ar text not null,
  price_egp integer not null check (price_egp >= 0),
  category text not null check (category in ('skincare', 'makeup', 'fragrance')),
  image text not null,
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Storefront product catalog; prices are whole EGP (same units as the Next app Product.price).';

create index if not exists products_featured_idx on public.products (featured) where featured = true;
create index if not exists products_category_idx on public.products (category);
create index if not exists products_slug_idx on public.products (slug);

alter table public.products enable row level security;

-- Public read: catalog is visible to the storefront (same data as the public site).
create policy "products_select_public" on public.products for select using (true);

-- No public inserts/updates/deletes: use the service role from the admin app.

-- Seed (matches former lib/data.ts) — idempotent
insert into public.products (id, slug, name_en, name_ar, description_en, description_ar, price_egp, category, image, in_stock, featured)
values
  (
    '1',
    'golden-hour-serum',
    'Golden Hour Serum',
    'سيروم الساعة الذهبية',
    'A luminosity-boosting serum enriched with 24K gold particles and hyaluronic acid for a radiant, dewy glow.',
    'سيروم يعزز الإشراق، مدعوم بجزيئات الذهب عيار 24 قيراط وحمض الهيالورونيك لبشرة مضيئة ومرطبة.',
    850,
    'skincare',
    '/placeholder-product.jpg',
    true,
    true
  ),
  (
    '2',
    'velvet-lip-elixir',
    'Velvet Lip Elixir',
    'إكسير الشفاه المخملي',
    'A luxurious lip treatment that combines bold pigment with deep hydration for lips that are irresistibly soft.',
    'علاج فاخر للشفاه يجمع بين الألوان الجريئة والترطيب العميق لشفاه ناعمة لا تُقاوم.',
    420,
    'makeup',
    '/placeholder-product.jpg',
    true,
    true
  ),
  (
    '3',
    'aurealis-signature-eau-de-parfum',
    'Signature Eau de Parfum',
    'عطر أوريالس المميز',
    'A captivating floral-oriental fragrance with notes of jasmine, amber, and sandalwood.',
    'عطر زهري شرقي ساحر بنفحات الياسمين والعنبر وخشب الصندل.',
    1200,
    'fragrance',
    '/placeholder-product.jpg',
    true,
    true
  ),
  (
    '4',
    'celestial-glow-highlighter',
    'Celestial Glow Highlighter',
    'هايلايتر التوهج السماوي',
    'A finely-milled powder highlighter that gives skin an ethereal, star-kissed luminosity.',
    'هايلايتر بودر ناعم يمنح البشرة لمعاناً أثيرياً كالنجوم.',
    560,
    'makeup',
    '/placeholder-product.jpg',
    true,
    true
  ),
  (
    '5',
    'radiance-face-oil',
    'Radiance Face Oil',
    'زيت الوجه المشرق',
    'A lightweight, fast-absorbing facial oil blended with rosehip, argan, and precious botanical extracts.',
    'زيت وجه خفيف سريع الامتصاص مزيج من ثمر الورد والأرجان ومستخلصات نباتية نادرة.',
    980,
    'skincare',
    '/placeholder-product.jpg',
    true,
    false
  ),
  (
    '6',
    'aurora-eye-palette',
    'Aurora Eye Palette',
    'لوحة ظلال عيون أورورا',
    'Nine celestial shades from champagne to deep plum, blendable and long-wearing.',
    'تسعة ظلال سماوية من الشامبانيا إلى البرقوق الداكن، قابلة للمزج وطويلة الثبات.',
    750,
    'makeup',
    '/placeholder-product.jpg',
    false,
    false
  )
on conflict (id) do update set
  slug = excluded.slug,
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  price_egp = excluded.price_egp,
  category = excluded.category,
  image = excluded.image,
  in_stock = excluded.in_stock,
  featured = excluded.featured,
  updated_at = now();
