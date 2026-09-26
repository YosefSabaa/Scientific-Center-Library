import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  className,
  fullScreen,
}: LoadingSpinnerProps) {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-4 border-brand-purple/20 border-t-brand-purple',
        sizes[size],
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
        {spinner}
      </div>
    );
  }

  return spinner;
}