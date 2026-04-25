import Image from 'next/image';

type Props = {
  width: number;
  height: number;
  className?: string;
  /** Outer wrapper: layout, max width, drop shadow, motion (e.g. nav height). */
  boxClassName?: string;
  priority?: boolean;
  /** Passed to `next/image` `sizes` for responsive LCP. */
  sizes?: string;
};

/**
 * Wordmark (PNG) with a uniform Petal underlay in an isolated context so
 * `mix-blend-mode: multiply` cancels the white artboard only against a flat
 * color — avoids a visible "box" on gradients or over busy backdrops, without
 * editing the source asset.
 *
 * Uses `fill` + `aspect-ratio` on the box so class-based sizing does not
 * trigger the Next.js Image "width/height modified without the other" warning.
 */
export default function BrandWordmark({
  width,
  height,
  className,
  boxClassName,
  priority,
  sizes: sizesProp,
}: Props) {
  const ar = width / height;
  const defaultSizes = `(max-width: 768px) 92vw, ${Math.min(width, 640)}px`;

  return (
    <div
      className={[
        'relative isolate inline-block [background-color:var(--color-petal)] [line-height:0]',
        boxClassName ?? '',
      ]
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()}
      style={{ aspectRatio: `${ar}` }}
    >
      <Image
        src="/logo-orange.png"
        alt="Auréalis"
        fill
        className={['object-contain', className ?? ''].join(' ').trim()}
        style={{ mixBlendMode: 'multiply' }}
        sizes={sizesProp ?? defaultSizes}
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
      />
    </div>
  );
}
