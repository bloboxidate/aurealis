import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Props = {
  children: React.ReactNode;
  title: string;
  kicker?: string;
};

export function ContentPageLayout({ children, title, kicker }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-petal">
        <header className="border-b border-border/50 bg-light/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 pt-44 sm:pt-52">
            {kicker && (
              <p
                className="text-[10px] tracking-[0.45em] uppercase font-bold text-apricot mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {kicker}
              </p>
            )}
            <h1
              className="text-[clamp(2rem,4.5vw,3.25rem)] font-light italic text-ink leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h1>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">{children}</div>
      </main>
      <Footer />
    </>
  );
}
