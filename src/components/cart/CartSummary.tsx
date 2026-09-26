'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { SHIPPING_COST } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export default function CartSummary() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const { total, count } = useCart();

  const shipping = total > 500 ? 0 : total > 0 ? SHIPPING_COST : 0;
  const finalTotal = total + shipping;
  const remaining = 500 - total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-24 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-md"
    >
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-brand-purple" />
        <h3 className="text-lg font-bold">{t('title')}</h3>
      </div>

      {/* Free shipping progress */}
      {total > 0 && total < 500 && (
        <div className="rounded-xl bg-brand-purple/5 p-3">
          <p className="mb-2 text-xs font-semibold">
            {locale === 'ar'
              ? `أضف ${formatPrice(remaining, locale)} للحصول على شحن مجاني!`
              : `Add ${formatPrice(remaining, locale)} more for free shipping!`}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(total / 500) * 100}%` }}
              className="h-full bg-gradient-to-r from-brand-purple to-brand-light"
            />
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('subtotal')} ({count})
          </span>
          <span className="font-semibold">{formatPrice(total, locale)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('shipping')}</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">{t('freeShipping')}</span>
            ) : (
              formatPrice(shipping, locale)
            )}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{t('total')}</span>
        <span className="text-2xl font-bold gradient-text">
          {formatPrice(finalTotal, locale)}
        </span>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href={`/${locale}/checkout`}>
          {t('checkout')}
          <ArrowIcon className="h-5 w-5" />
        </Link>
      </Button>

      <Link
        href={`/${locale}/products`}
        className="block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-brand-purple"
      >
        {t('continueShopping')}
      </Link>
    </motion.div>
  );
}