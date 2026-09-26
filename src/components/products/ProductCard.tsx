'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { getLocalizedName, cn } from '@/lib/utils';
import { formatPrice, getDiscountPercentage } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import Rating from '@/components/shared/Rating';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { addItem } = useCart();

  const name = getLocalizedName(product, locale);
  const image = product.images?.[0] || '/placeholder.png';
  const discount = product.compare_price
    ? getDiscountPercentage(product.price, product.compare_price)
    : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      productId: product.id,
      variantId: null,
      nameAr: product.name_ar,
      nameEn: product.name_en,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '',
      stock: product.stock,
    });
    toast.success(t('addedToCart'));
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/20"
    >
      <Link href={`/${locale}/products/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-purple/5 to-brand-light/5">
          {product.images?.[0] ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-purple/30">
              <ShoppingCart className="h-16 w-16" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge variant="danger" className="shadow-lg">
                -{discount}%
              </Badge>
            )}
            {product.is_featured && (
              <Badge variant="default" className="shadow-lg">
                {locale === 'ar' ? 'مميز' : 'Featured'}
              </Badge>
            )}
            {!inStock && (
              <Badge variant="secondary" className="shadow-lg">
                {t('outOfStock')}
              </Badge>
            )}
          </div>

          {/* Quick View - hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-brand-ink/0 opacity-0 transition-all duration-300 group-hover:bg-brand-ink/30 group-hover:opacity-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-purple shadow-lg">
              <Eye className="h-5 w-5" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {product.category && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brand-purple">
              {getLocalizedName(product.category, locale)}
            </p>
          )}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight transition-colors group-hover:text-brand-purple md:text-base">
            {name}
          </h3>

          {product.rating > 0 && (
            <div className="mt-1.5">
              <Rating value={product.rating} count={product.reviews_count} />
            </div>
          )}

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-base font-bold text-brand-purple md:text-lg">
                {formatPrice(product.price, locale)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compare_price, locale)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all md:h-10 md:w-10',
                inStock
                  ? 'bg-gradient-to-br from-brand-purple to-brand-light text-white shadow-lg shadow-brand-purple/30 hover:scale-110 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
              aria-label={t('addToCart')}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}