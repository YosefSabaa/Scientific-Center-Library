import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { getCategories, getProducts } from '@/lib/supabase/queries';
import ProductsClient from './products-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title') };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; featured?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  setRequestLocale(locale);

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: sp.search,
      featured: sp.featured === 'true',
      sort: (sp.sort as any) || 'newest',
    }),
  ]);

  return (
    <Suspense fallback={null}>
      <ProductsClient
        initialProducts={products}
        categories={categories}
        initialSearch={sp.search || ''}
      />
    </Suspense>
  );
}