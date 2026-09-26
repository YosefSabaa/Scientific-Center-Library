'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/shared/EmptyState';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { items } = useCart();

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: tc('cart') }]} />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-4xl font-bold gradient-text md:text-5xl"
      >
        {t('title')}
      </motion.h1>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" />}
          title={t('empty')}
          description={t('emptyDesc')}
          action={
            <Button asChild size="lg">
              <Link href={`/${locale}/products`}>{t('continueShopping')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </AnimatePresence>
          </div>

          <CartSummary />
        </div>
      )}
    </div>
  );
}