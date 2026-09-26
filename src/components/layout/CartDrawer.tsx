'use client';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useUIStore } from '@/stores/ui-store';
import { formatPrice } from '@/lib/format';
import EmptyState from '@/components/shared/EmptyState';
import { SHIPPING_COST } from '@/lib/constants';

export default function CartDrawer() {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, removeItem, updateQuantity, total } = useCart();

  const shipping = total > 500 ? 0 : total > 0 ? SHIPPING_COST : 0;
  const finalTotal = total + shipping;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isRTL ? 'start-0' : 'end-0'} z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl`}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-purple" />
                <h2 className="text-lg font-bold">{t('title')}</h2>
                <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-xs font-bold text-brand-purple">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-brand-purple/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="h-10 w-10" />}
                  title={t('empty')}
                  description={t('emptyDesc')}
                  action={
                    <Button
                      onClick={() => setCartOpen(false)}
                      asChild
                    >
                      <Link href={`/${locale}/products`}>{t('continueShopping')}</Link>
                    </Button>
                  }
                />
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={`${item.productId}-${item.variantId}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex gap-3 rounded-2xl border border-border p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-purple/5">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={locale === 'ar' ? item.nameAr : item.nameEn}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <h3 className="truncate text-sm font-bold">
                            {locale === 'ar' ? item.nameAr : item.nameEn}
                          </h3>
                          {item.variantInfo && (
                            <p className="text-xs text-muted-foreground">
                              {item.variantInfo}
                            </p>
                          )}
                          <p className="text-sm font-bold text-brand-purple">
                            {formatPrice(item.price, locale)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex h-8 items-center rounded-lg border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.variantId, item.quantity - 1)
                              }
                              className="flex h-full w-7 items-center justify-center hover:bg-brand-purple/10"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.variantId, item.quantity + 1)
                              }
                              className="flex h-full w-7 items-center justify-center hover:bg-brand-purple/10"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border bg-brand-purple/5 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
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
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-bold">{t('total')}</span>
                  <span className="text-lg font-bold gradient-text">
                    {formatPrice(finalTotal, locale)}
                  </span>
                </div>

                <Button
                  onClick={() => setCartOpen(false)}
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link href={`/${locale}/checkout`}>{t('checkout')}</Link>
                </Button>

                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-sm font-medium text-muted-foreground hover:text-brand-purple transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}