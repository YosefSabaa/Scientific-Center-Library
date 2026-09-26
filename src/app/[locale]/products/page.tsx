import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { getCategories, getProducts } from '@/lib/supabase/queries';
import ProductsClient from './products-client';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title') };
}

export default async function ProductsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { search?: string; featured?: string; sort?: string };
}) {
  setRequestLocale(locale);

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: searchParams.search,
      featured: searchParams.featured === 'true',
      sort: (searchParams.sort as any) || 'newest',
    }),
  ]);

  return (
    <Suspense fallback={null}>
      <ProductsClient
        initialProducts={products}
        categories={categories}
        initialSearch={searchParams.search || ''}
      />
    </Suspense>
  );
}