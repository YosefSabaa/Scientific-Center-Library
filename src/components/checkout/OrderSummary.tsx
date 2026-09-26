'use client';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { SHIPPING_COST } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export default function OrderSummary() {
  const t = useTranslations('checkout');
  const tc = useTranslations('cart');
  const locale = useLocale();
  const { items, total } = useCart();

  const shipping = total > 500 ? 0 : SHIPPING_COST;
  const finalTotal = total + shipping;

  return (
    <div className="sticky top-24 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-md">
      <h3 className="text-lg font-bold">{t('orderSummary')}</h3>
      <Separator />

      <ul className="max-h-80 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-purple/5">
              {item.image && (
                <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
              )}
              <span className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-sm font-semibold">
                {locale === 'ar' ? item.nameAr : item.nameEn}
              </p>
              <p className="text-xs font-bold text-brand-purple">
                {formatPrice(item.price * item.quantity, locale)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tc('subtotal')}</span>
          <span className="font-semibold">{formatPrice(total, locale)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tc('shipping')}</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">{tc('freeShipping')}</span>
            ) : (
              formatPrice(shipping, locale)
            )}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-bold">{tc('total')}</span>
        <span className="text-xl font-bold gradient-text">
          {formatPrice(finalTotal, locale)}
        </span>
      </div>
    </div>
  );
}