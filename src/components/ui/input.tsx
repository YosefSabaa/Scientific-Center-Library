import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground',
          'placeholder:text-muted-foreground/60',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:border-brand-purple focus-visible:ring-2 focus-visible:ring-brand-purple/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };