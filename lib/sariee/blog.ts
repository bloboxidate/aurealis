import 'server-only';

import { sarieeFetch } from './client';
import { extractArray, asRecord } from './json-helpers';

function tryParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return null; }
}

export type SarieeBlogPost = {
  id: string | number;
  slug: string;
  title: string;
  title_ar: string;
  excerpt: string;
  excerpt_ar: string;
  body: string;
  body_ar: string;
  image: string;
  published_at: string;
  author: string;
};

function mapPost(raw: unknown): SarieeBlogPost | null {
  const r = asRecord(raw);
  if (!r) return null;
  const id = r.id ?? r.post_id ?? r.blog_id;
  if (id === undefined || id === null) return null;
  const slug = String(r.slug ?? r.seo_link ?? r.handle ?? id).toLowerCase().replace(/\s+/g, '-');
  return {
    id: typeof id === 'number' ? id : String(id),
    slug,
    title: String(r.title ?? r.title_en ?? r.name ?? ''),
    title_ar: String(r.title_ar ?? r.title_arabic ?? r.title ?? ''),
    excerpt: String(r.excerpt ?? r.short_description ?? r.summary ?? ''),
    excerpt_ar: String(r.excerpt_ar ?? r.excerpt_arabic ?? r.excerpt ?? ''),
    body: String(r.body ?? r.content ?? r.description ?? ''),
    body_ar: String(r.body_ar ?? r.content_ar ?? r.body ?? ''),
    image: String(r.image ?? r.cover ?? r.thumbnail ?? ''),
    published_at: String(r.published_at ?? r.created_at ?? ''),
    author: String(r.author ?? r.author_name ?? ''),
  };
}

async function fetchJson(path: string): Promise<unknown> {
  const res = await sarieeFetch(path, { method: 'GET' });
  if (!res.ok) return null;
  return tryParse(await res.text());
}

export async function fetchAllBlogPosts(): Promise<SarieeBlogPost[]> {
  const attempts = [
    '/api/frontend/blog/all-blogs',
    '/api/frontend/blogs',
    '/api/frontend/blog',
  ];
  for (const path of attempts) {
    const json = await fetchJson(path);
    if (!json) continue;
    const posts = extractArray(json).map(mapPost).filter(Boolean) as SarieeBlogPost[];
    if (posts.length > 0) return posts;
  }
  return [];
}

export async function fetchSingleBlogPost(slug: string): Promise<SarieeBlogPost | null> {
  const attempts = [
    `/api/frontend/blog/single-blog?slug=${encodeURIComponent(slug)}`,
    `/api/frontend/blog/single-blog?id=${encodeURIComponent(slug)}`,
    `/api/frontend/blogs/${encodeURIComponent(slug)}`,
  ];
  for (const path of attempts) {
    const json = await fetchJson(path);
    if (!json) continue;
    const r = asRecord(json);
    const raw = asRecord(r?.data) ?? asRecord(r?.post) ?? asRecord(r?.blog) ?? r;
    const p = mapPost(raw);
    if (p) return p;
  }
  return null;
}
