import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSingleBlogPost } from '@/lib/sariee/blog';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('blog');

  const post = await fetchSingleBlogPost(slug);
  if (!post) notFound();

  const title = locale === 'ar' ? post.title_ar || post.title : post.title;
  const body = locale === 'ar' ? post.body_ar || post.body : post.body;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal pt-32 sm:pt-36 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm text-muted mb-6">
            <Link href={`/${locale}/blog`} className="text-apricot hover:underline">
              {t('back')}
            </Link>
          </p>

          {post.image && (
            <div className="aspect-[16/7] overflow-hidden rounded-2xl mb-8 bg-light">
              <img
                src={post.image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-8 border-b border-border/60 pb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('kicker')}{post.published_at ? ` · ${post.published_at.slice(0, 10)}` : ''}
            </p>
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light italic text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h1>
            {post.author && (
              <p className="mt-2 text-sm text-muted" style={{ fontFamily: 'var(--font-body)' }}>{post.author}</p>
            )}
          </div>

          <div
            className="prose prose-sm sm:prose max-w-none text-ink/80 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
