import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function SparkleLoadVisual({ size = 120, className = '', priority = false }: Props) {
  return (
    <div
      className={`flex items-center justify-center sparkle-loader-rotate ${className}`.trim()}
      style={{ width: size * 1.4, height: size * 1.4 }}
      aria-hidden
    >
      <div className="relative flex w-[85%] max-w-[200px] items-center justify-center sparkle-loader-breathe">
        <Image
          src="/sparkle-loader.png"
          alt=""
          width={size}
          height={size}
          className="sparkle-loader-img h-auto w-full object-contain"
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>
    </div>
  );
}
