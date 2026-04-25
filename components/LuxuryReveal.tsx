'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type LuxuryRevealProps = {
  children: ReactNode;
  className?: string;
  /** Vertical offset in px (initial). */
  y?: number;
  /** How long the entrance takes (ms). */
  durationMs?: number;
  /** Staggered delay after reveal triggers (e.g. index * 80). */
  staggerMs?: number;
};

const easeLux = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Scroll-triggered opacity + soft lift. Luxury-appropriate: slow, single easing, runs once.
 */
export default function LuxuryReveal({
  children,
  className = '',
  y = 28,
  durationMs = 1000,
  staggerMs = 0,
}: LuxuryRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setOn(true);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
        transition: `opacity ${durationMs}ms ${easeLux} ${on ? staggerMs : 0}ms, transform ${durationMs}ms ${easeLux} ${
          on ? staggerMs : 0
        }ms`,
        willChange: on ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
