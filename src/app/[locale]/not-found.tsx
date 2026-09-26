'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative mx-auto mb-8 w-fit">
          <h1 className="text-[120px] font-bold leading-none gradient-text md:text-[180px]">
            404
          </h1>
          <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-brand-purple to-brand-light" />
        </div>

        <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t('title')}</h2>
        <p className="mb-8 text-muted-foreground">{t('desc')}</p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={`/${locale}`}>
              <Home className="h-5 w-5" />
              {t('backHome')}
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/${locale}/products`}>
              <Search className="h-5 w-5" />
              {locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}