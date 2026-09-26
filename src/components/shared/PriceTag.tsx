'use client';
import { useLocale } from 'next-intl';
import { formatPrice, getDiscountPercentage } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  comparePrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceTag({
  price,
  comparePrice,
  size = 'md',
  className,
}: PriceTagProps) {
  const locale = useLocale();
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };
  const hasDiscount = comparePrice && comparePrice > price;
  const discount = hasDiscount ? getDiscountPercentage(price, comparePrice!) : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className={cn('font-bold text-brand-dark', sizes[size])}>
        {formatPrice(price, locale)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(comparePrice!, locale)}
          </span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}