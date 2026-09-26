import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-brand-dark via-brand-purple to-brand-light text-white shadow-lg shadow-brand-purple/20 hover:shadow-xl hover:shadow-brand-purple/40 hover:-translate-y-0.5',
        secondary:
          'bg-brand-ink text-white hover:bg-brand-dark shadow-md',
        outline:
          'border-2 border-brand-dark/20 bg-transparent text-brand-dark hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5',
        ghost:
          'text-brand-ink hover:bg-brand-purple/5 hover:text-brand-purple',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-md',
        link:
          'text-brand-purple underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        default: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };