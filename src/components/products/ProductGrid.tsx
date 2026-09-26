'use client';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '@/types';
import EmptyState from '@/components/shared/EmptyState';
import { PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const t = useTranslations('products');

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="h-10 w-10" />}
        title={t('noProducts')}
        description={t('noProductsDesc')}
      />
    );
  }

  const cols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${cols[columns]}`}>
      {products.map((product, idx) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(idx * 0.03, 0.5) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}