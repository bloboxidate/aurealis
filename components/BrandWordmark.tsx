import Image from 'next/image';

type Props = {
  width: number;
  height: number;
  className?: string;
  /** Outer wrapper: control max width, margin, etc. */
  boxClassName?: string;
  priority?: boolean;
};

/**
 * Wordmark (PNG) with a uniform Petal underlay in an isolated context so
 * `mix-blend-mode: multiply` cancels the white artboard only against a flat
 * color — avoids a visible "box" on gradients or over busy backdrops, without
 * editing the source asset.
 */
export default function BrandWordmark({ width, height, className, boxClassName, priority }: Props) {
  return (
    <div
      className={[
        'isolate inline-block leading-none [background-color:var(--color-petal)]',
        boxClassName ?? '',
      ].join(' ')}
    >
      <Image
        src="/logo-orange.png"
        alt="Auréalis"
        width={width}
        height={height}
        className={['h-auto w-full object-contain', className ?? ''].join(' ').trim()}
        style={{ mixBlendMode: 'multiply' }}
        priority={priority}
      />
    </div>
  );
}
