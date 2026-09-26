'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Rating from '@/components/shared/Rating';
import QuantityInput from '@/components/shared/QuantityInput';
import type { Product, ProductVariant } from '@/types';
import { formatPrice, getDiscountPercentage } from '@/lib/format';
import { getLocalizedName, getLocalizedDescription, cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

interface ProductInfoProps {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductInfo({ product, variants }: ProductInfoProps) {
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const name = getLocalizedName(product, locale);
  const description = getLocalizedDescription(product, locale);
  const inStock = product.stock > 0;
  const discount = product.compare_price
    ? getDiscountPercentage(product.price, product.compare_price)
    : 0;

  const finalPrice = product.price + (selectedVariant?.price_diff || 0);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      nameAr: product.name_ar,
      nameEn: product.name_en,
      price: finalPrice,
      quantity,
      image: selectedVariant?.image_url || product.images?.[0] || '',
      stock: selectedVariant?.stock ?? product.stock,
      variantInfo: selectedVariant ? (locale === 'ar' ? selectedVariant.name_ar : selectedVariant.name_en) : undefined,
    });
    toast.success(t('addedToCart'));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(locale === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
    }
  };

  // Group variants by type
  const variantsByType = variants.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  return (
    <div className="space-y-6">
      {/* Category + badges */}
      <div className="flex flex-wrap items-center gap-2">
        {product.category && (
          <Badge variant="secondary">{getLocalizedName(product.category, locale)}</Badge>
        )}
        {product.is_featured && (
          <Badge variant="default">{locale === 'ar' ? 'منتج مميز' : 'Featured'}</Badge>
        )}
        {!inStock && (
          <Badge variant="danger">{t('outOfStock')}</Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold leading-tight md:text-4xl">{name}</h1>

      {/* Rating */}
      {product.rating > 0 && (
        <div className="flex items-center gap-3">
          <Rating value={product.rating} size="md" />
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)} ({product.reviews_count} {t('reviews')})
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-end gap-3 border-y border-border py-5">
        <span className="text-4xl font-bold gradient-text">
          {formatPrice(finalPrice, locale)}
        </span>
        {product.compare_price && product.compare_price > product.price && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(product.compare_price, locale)}
            </span>
            <Badge variant="danger" className="mb-1">
              {locale === 'ar' ? `وفّر ${discount}%` : `Save ${discount}%`}
            </Badge>
          </>
        )}
      </div>

      {/* Short Description */}
      {description && (
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      )}

      {/* SKU + Stock */}
      <div className="flex flex-wrap gap-4 text-sm">
        {product.sku && (
          <div>
            <span className="text-muted-foreground">{t('sku')}: </span>
            <span className="font-semibold">{product.sku}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {inStock ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">{t('inStock')}</span>
            </>
          ) : (
            <span className="font-semibold text-red-600">{t('outOfStock')}</span>
          )}
        </div>
      </div>

      {/* Variants */}
      {Object.entries(variantsByType).map(([type, items]) => (
        <div key={type}>
          <h4 className="mb-3 text-sm font-bold">
            {locale === 'ar' ? type : type}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(isSelected ? null : variant)}
                  className={cn(
                    'rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all',
                    isSelected
                      ? 'border-brand-purple bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                      : 'border-border hover:border-brand-purple hover:text-brand-purple'
                  )}
                >
                  {getLocalizedName(variant, locale)}
                  {variant.price_diff > 0 && (
                    <span className="ms-1 text-xs opacity-80">
                      (+{variant.price_diff})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quantity + Add to cart */}
      <div className="flex flex-wrap items-center gap-4">
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          max={selectedVariant?.stock ?? product.stock}
        />
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1 min-w-[200px]"
        >
          <ShoppingCart className="h-5 w-5" />
          {t('addToCart')}
        </Button>
        <button
          onClick={handleShare}
          className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border transition-all hover:border-brand-purple hover:text-brand-purple"
          aria-label={t('share')}
        >
          <Share2 className="h-5 w-5" />
        </button>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border transition-all hover:border-red-500 hover:text-red-500"
          aria-label={t('wishlist')}
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-brand-purple/5 p-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <Truck className="h-6 w-6 text-brand-purple" />
          <span className="text-xs font-semibold">
            {locale === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center border-x border-border">
          <ShieldCheck className="h-6 w-6 text-brand-purple" />
          <span className="text-xs font-semibold">
            {locale === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <RotateCcw className="h-6 w-6 text-brand-purple" />
          <span className="text-xs font-semibold">
            {locale === 'ar' ? 'استبدال مجاني' : 'Free Returns'}
          </span>
        </div>
      </div>
    </div>
  );
}