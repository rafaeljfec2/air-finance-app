import { Spinner } from '@/components/ui/spinner';

type ColorVariant = 'violet' | 'rose' | 'amber';

interface SectionLoaderProps {
  readonly color?: ColorVariant;
}

const colorClasses: Record<ColorVariant, string> = {
  violet: 'text-violet-500',
  rose: 'text-rose-500',
  amber: 'text-amber-500',
};

export function SectionLoader({ color = 'violet' }: SectionLoaderProps) {
  return (
    <div className="flex justify-center py-8">
      <Spinner size="lg" className={colorClasses[color]} />
    </div>
  );
}
