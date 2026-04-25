'use client';

import { useEffect, useState } from 'react';
import { SparkleLoadVisual } from '@/components/SparkleLoadVisual';

const MIN_MS = 650;
const FADE_MS = 500;

/**
 * Full-screen first paint: slow rotate + twinkle on your sparkle asset.
 * Hides on window `load` (and never blocks client navigations after that).
 */
export function InitialLoadOverlay() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

  useEffect(() => {
    const t0 = performance.now();

    const finish = () => {
      const elapsed = performance.now() - t0;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => {
        setPhase('out');
        window.setTimeout(() => setPhase('gone'), FADE_MS);
      }, wait);
    };

    if (document.readyState === 'complete') {
      finish();
      return;
    }
    window.addEventListener('load', finish, { once: true });
    return () => window.removeEventListener('load', finish);
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
