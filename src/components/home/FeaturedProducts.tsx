'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-brand-purple/5">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div className="flex-1">
            <SectionTitle title={t('featuredProducts')} subtitle={t('featuredSubtitle')} align="start" />
          </div>
          <Link
            href={`/${locale}/products?featured=true`}
            className="hidden shrink-0 items-center gap-2 rounded-xl border-2 border-brand-purple/20 px-4 py-2 text-sm font-semibold text-brand-purple transition-all hover:border-brand-purple hover:bg-brand-purple/5 md:inline-flex"
          >
            {locale === 'ar' ? 'عرض الكل' : 'View All'}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href={`/${locale}/products?featured=true`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-sm font-semibold text-white"
          >
            {locale === 'ar' ? 'عرض الكل' : 'View All'}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}