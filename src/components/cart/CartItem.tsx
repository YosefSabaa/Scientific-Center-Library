'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/hooks/useCart';

export default function CartItem({ item }: { item: CartItemType }) {
  const locale = useLocale();
  const { updateQuantity, removeItem } = useCart();
  const name = locale === 'ar' ? item.nameAr : item.nameEn;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex gap-4 rounded-2xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <Link
        href={`/${locale}/products/${item.productId}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-purple/5"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/${locale}/products/${item.productId}`}
            className="line-clamp-2 text-sm font-bold transition-colors hover:text-brand-purple md:text-base"
          >
            {name}
          </Link>
          {item.variantInfo && (
            <p className="mt-1 text-xs text-muted-foreground">{item.variantInfo}</p>
          )}
          <p className="mt-1 text-sm font-bold text-brand-purple">
            {formatPrice(item.price, locale)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex h-9 items-center rounded-lg border border-border">
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-full w-9 items-center justify-center rounded-s-lg transition-colors hover:bg-brand-purple/10 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="flex h-full w-9 items-center justify-center rounded-e-lg transition-colors hover:bg-brand-purple/10 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-bold text-brand-dark sm:block">
              {formatPrice(item.price * item.quantity, locale)}
            </span>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}