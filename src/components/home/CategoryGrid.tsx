'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import * as Icons from 'lucide-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import type { Category } from '@/types';
import { getLocalizedName } from '@/lib/utils';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container-page">
        <SectionTitle title={t('topCategories')} subtitle={t('topCategoriesSubtitle')} />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((category, idx) => {
            const IconComponent = category.icon
              ? (Icons as any)[category.icon] || Icons.BookOpen
              : Icons.BookOpen;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/${locale}/categories/${category.slug}`}
                  className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-br from-brand-purple/5 to-brand-light/5 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-brand-purple/30 hover:shadow-xl hover:shadow-brand-purple/20"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute -top-10 start-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-brand-purple/20 blur-2xl" />
                  </div>

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-light text-white shadow-lg shadow-brand-purple/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <IconComponent className="h-7 w-7" />
                  </div>

                  <h3 className="relative text-sm font-bold leading-tight">
                    {getLocalizedName(category, locale)}
                  </h3>

                  <span className="relative flex items-center gap-1 text-xs font-semibold text-brand-purple opacity-0 transition-opacity group-hover:opacity-100">
                    {locale === 'ar' ? 'تصفح' : 'Browse'}
                    <ArrowIcon className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/categories`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple hover:gap-3 transition-all"
          >
            {locale === 'ar' ? 'عرض كل التصنيفات' : 'View All Categories'}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}