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
  /**
   * Use intrinsic width/height instead of `fill` (better on iOS Safari inside headers with
   * backdrop-blur / transforms). Parent should constrain width; image scales with max-h.
   */
  layoutIntrinsic?: boolean;
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
  layoutIntrinsic = false,
}: Props) {
  const ar = width / height;
  const defaultSizes = `(max-width: 768px) 92vw, ${Math.min(width, 640)}px`;
  const blendClass = blend === 'multiply' ? '[mix-blend-mode:multiply]' : 'mix-blend-normal';
  const imgClass = ['object-contain [background:transparent]', blendClass, className ?? ''].join(' ').trim();

  const baseBox = contained
    ? layoutIntrinsic
      ? 'relative flex h-full w-full min-h-[2rem] min-w-0 items-center justify-center [line-height:0] bg-transparent'
      : 'relative block h-full w-full min-h-[2rem] min-w-[4rem] [line-height:0] bg-transparent'
    : 'relative inline-block [line-height:0] bg-transparent';

  if (layoutIntrinsic) {
    return (
      <div
        className={[baseBox, boxClassName ?? ''].join(' ').replace(/\s+/g, ' ').trim()}
        style={contained ? undefined : { aspectRatio: `${ar}` }}
      >
        <Image
          src={src}
          alt="Auréalis"
          width={width}
          height={height}
          className={['h-auto max-h-full w-auto max-w-full', imgClass].join(' ').trim()}
          sizes={sizesProp ?? defaultSizes}
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
        />
      </div>
    );
  }

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
        className={imgClass}
        sizes={sizesProp ?? defaultSizes}
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
      />
    </div>
  );
}
