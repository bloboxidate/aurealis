'use client';

import { useEffect, useState } from 'react';
import { SparkleLoadVisual } from '@/components/SparkleLoadVisual';

const MIN_MS = 650;
const FADE_MS = 500;
const ABSOLUTE_MAX_MS = 2000;

export function InitialLoadOverlay() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

  useEffect(() => {
    let cancelled = false;
    let finished = false;

    const go = () => {
      if (cancelled || finished) return;
      finished = true;
      setPhase('out');
      window.setTimeout(() => {
        if (!cancelled) setPhase('gone');
      }, FADE_MS);
    };

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      go();
      return () => {
        cancelled = true;
      };
    }

    const tNormal = window.setTimeout(go, MIN_MS);
    const tMax = window.setTimeout(go, ABSOLUTE_MAX_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(tNormal);
      window.clearTimeout(tMax);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-6 bg-petal transition-opacity ease-out pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: phase === 'out' ? 'none' : 'auto',
      }}
      role="status"
      aria-live="polite"
      aria-busy={phase === 'in'}
    >
      <span className="sr-only">Loading</span>
      <SparkleLoadVisual size={132} priority />
    </div>
  );
}
