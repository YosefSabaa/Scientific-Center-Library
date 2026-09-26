import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export default function Rating({ value, count, size = 'sm', className }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i <= Math.round(value)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          )}
        />
      ))}
      {count !== undefined && (
        <span className="ms-1 text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}