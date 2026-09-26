'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (!products || products.length === 0) return null;

  return (
    <section className="relative py-20 overflow-hidden bg-brand-ink">
      <div className="absolute inset-0 bg-brand-radial opacity-40" />
      <div className="absolute -top-20 -end-20 h-80 w-80 rounded-full bg-brand-purple/30 blur-3xl" />
      <div className="absolute -bottom-20 -start-20 h-80 w-80 rounded-full bg-brand-light/30 blur-3xl" />

      <div className="container-page relative">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-lg"
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white">
              {locale === 'ar' ? 'جديد في المتجر' : 'New in Store'}
            </span>
          </motion.div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t('newArrivals')}
          </h2>
          <p className="mt-3 text-white/70">{t('newArrivalsSubtitle')}</p>
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

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/products?sort=newest`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-lg transition-all hover:border-white hover:bg-white/20"
          >
            {locale === 'ar' ? 'عرض كل الجديد' : 'View All New'}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}