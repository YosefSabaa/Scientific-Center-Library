'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getLocalizedName } from '@/lib/utils';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

export interface Filters {
  categoryIds: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ProductFilters({
  categories,
  filters,
  onChange,
}: ProductFiltersProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (id: string) => {
    const newIds = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((x) => x !== id)
      : [...filters.categoryIds, id];
    onChange({ ...filters, categoryIds: newIds });
  };

  const clearAll = () => {
    onChange({
      categoryIds: [],
      minPrice: null,
      maxPrice: null,
      inStock: false,
    });
  };

  const activeCount =
    filters.categoryIds.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-purple" />
          <h3 className="font-bold">{t('filters')}</h3>
          {activeCount > 0 && (
            <span className="rounded-full bg-brand-purple px-2 py-0.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-red-500 hover:underline"
          >
            {t('clearFilters')}
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-bold">{t('category')}</h4>
        <div className="space-y-2">
          {categories.map((category) => {
            const checked = filters.categoryIds.includes(category.id);
            return (
              <label
                key={category.id}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all',
                  checked
                    ? 'border-brand-purple bg-brand-purple/5'
                    : 'border-transparent hover:bg-brand-purple/5'
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <span className="text-sm font-medium">
                  {getLocalizedName(category, locale)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-bold">{t('priceRange')}</h4>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : null,
              })
            }
            placeholder={locale === 'ar' ? 'من' : 'Min'}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          />
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : null,
              })
            }
            placeholder={locale === 'ar' ? 'إلى' : 'Max'}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>
      </div>

      {/* In Stock */}
      <label
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all',
          filters.inStock
            ? 'border-brand-purple bg-brand-purple/5'
            : 'border-transparent hover:bg-brand-purple/5'
        )}
      >
        <Checkbox
          checked={filters.inStock}
          onCheckedChange={(checked) =>
            onChange({ ...filters, inStock: checked === true })
          }
        />
        <span className="text-sm font-medium">
          {locale === 'ar' ? 'المتوفر فقط' : 'In stock only'}
        </span>
      </label>
    </div>
  );

  return (
    <>
      {/* Mobile Button */}
      <Button
        variant="outline"
        onClick={() => setMobileOpen(true)}
        className="w-full lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {t('filters')}
        {activeCount > 0 && (
          <span className="ms-1 rounded-full bg-brand-purple px-2 py-0.5 text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block rounded-2xl border border-border bg-white p-5 sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 inset-x-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('filters')}</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-brand-purple/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {content}
              <Button
                onClick={() => setMobileOpen(false)}
                className="mt-6 w-full"
                size="lg"
              >
                <Check className="h-5 w-5" />
                {locale === 'ar' ? 'تطبيق' : 'Apply'}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}