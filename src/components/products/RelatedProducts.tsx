'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import SectionTitle from '@/components/shared/SectionTitle';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations('products');

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20">
      <SectionTitle title={t('relatedProducts')} align="start" />

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
    </section>
  );
}