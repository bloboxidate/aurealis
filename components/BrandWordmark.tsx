import Image from 'next/image';

type Props = {
  width: number;
  height: number;
  src?: string;
  blend?: 'multiply' | 'none';
  className?: string;
  boxClassName?: string;
  priority?: boolean;
  sizes?: string;
  /**
   * Fills a parent with explicit `width`/`height` (e.g. navbar). Skips `aspect-ratio` on the box
   * so `next/image` `fill` always gets a non-zero box on iOS and flex contexts.
   */
  contained?: boolean;
};

export default function BrandWordmark({
  width,
  height,
  src = '/logo-black.png',
  blend = 'none',
  className,
  boxClassName,
  priority,
  sizes: sizesProp,
  contained = false,
}: Props) {
  const ar = width / height;
  const defaultSizes = `(max-width: 768px) 92vw, ${Math.min(width, 640)}px`;
  const blendClass = blend === 'multiply' ? '[mix-blend-mode:multiply]' : 'mix-blend-normal';

  const baseBox = contained
    ? 'relative block h-full w-full min-h-[2rem] min-w-[4rem] [line-height:0] bg-transparent'
    : 'relative inline-block [line-height:0] bg-transparent';

  return (
    <div
      className={[baseBox, boxClassName ?? '']
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()}
      style={contained ? undefined : { aspectRatio: `${ar}` }}
    >
      <Image
        src={src}
        alt="Auréalis"
        fill
        className={['object-contain [background:transparent]', blendClass, className ?? ''].join(' ').trim()}
        sizes={sizesProp ?? defaultSizes}
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
      />
    </div>
  );
}
