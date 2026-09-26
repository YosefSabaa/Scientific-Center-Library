'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import * as Icons from 'lucide-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import type { Category } from '@/types';
import { getLocalizedName, getLocalizedDescription } from '@/lib/utils';

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t('categories') }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-3 text-4xl font-bold gradient-text md:text-5xl">
          {t('categories')}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ar'
            ? 'تصفح جميع تصنيفات منتجاتنا'
            : 'Browse all our product categories'}
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, idx) => {
          const IconComponent = category.icon
            ? (Icons as any)[category.icon] || Icons.BookOpen
            : Icons.BookOpen;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/${locale}/categories/${category.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-white transition-all hover:shadow-2xl hover:shadow-brand-purple/20"
              >
                {/* Image / Icon area */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-dark via-brand-purple to-brand-light">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={getLocalizedName(category, locale)}
                      fill
                      className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : null}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-lg shadow-2xl">
                      <IconComponent className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-brand-purple">
                    {getLocalizedName(category, locale)}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {getLocalizedDescription(category, locale) ||
                      (locale === 'ar' ? 'تصفح منتجات هذا التصنيف' : 'Browse products in this category')}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple">
                    {locale === 'ar' ? 'تصفح' : 'Browse'}
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}