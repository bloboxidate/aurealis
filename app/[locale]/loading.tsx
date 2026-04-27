import { SparkleLoadVisual } from '@/components/SparkleLoadVisual';

export default function LocaleLoading() {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-petal px-6 py-24"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <SparkleLoadVisual size={100} />
    </div>
  );
}
