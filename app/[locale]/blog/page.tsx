import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchAllBlogPosts } from '@/lib/sariee/blog';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations('blog');
  const posts = await fetchAllBlogPosts();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal pt-44 sm:pt-52 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('kicker')}
            </p>
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-light italic text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {t('title')}
            </h1>
            <p className="mt-2 text-ink/60" style={{ fontFamily: 'var(--font-body)' }}>{t('subtitle')}</p>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted" style={{ fontFamily: 'var(--font-body)' }}>{t('empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const title = locale === 'ar' ? post.title_ar || post.title : post.title;
                const excerpt = locale === 'ar' ? post.excerpt_ar || post.excerpt : post.excerpt;
                return (
                  <Link
                    key={String(post.id)}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group rounded-2xl overflow-hidden border border-border/60 bg-light/30 hover:border-apricot/40 transition-colors"
                  >
                    {post.image ? (
                      <div className="aspect-[4/3] overflow-hidden bg-light">
                        <img
                          src={post.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gradient-to-br from-apricot/10 to-apricot/5 flex items-center justify-center">
                        <span className="text-4xl text-apricot/30" aria-hidden>✦</span>
                      </div>
                    )}
                    <div className="p-5">
                      {post.published_at && (
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
                          {post.published_at.slice(0, 10)}
                        </p>
                      )}
                      <h2 className="font-medium text-ink mb-1 line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>{title}</h2>
                      {excerpt && (
                        <p className="text-sm text-muted line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>{excerpt}</p>
                      )}
                      <p className="mt-3 text-[10px] tracking-[0.2em] uppercase font-bold text-apricot" style={{ fontFamily: 'var(--font-ui)' }}>
                        {t('read_more')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
