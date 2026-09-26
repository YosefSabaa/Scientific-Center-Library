import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCategoryBySlug, getProducts } from '@/lib/supabase/queries';
import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { getLocalizedName, getLocalizedDescription } from '@/lib/utils';

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Not Found' };
  return { title: getLocalizedName(category, locale) };
}

export default async function CategoryPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const tc = await getTranslations({ locale, namespace: 'common' });
  const products = await getProducts({ categoryId: category.id });

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: tc('categories'), href: `/${locale}/categories` },
          { label: getLocalizedName(category, locale) },
        ]}
      />

      <header className="mb-10">
        <h1 className="mb-3 text-4xl font-bold gradient-text md:text-5xl">
          {getLocalizedName(category, locale)}
        </h1>
        {getLocalizedDescription(category, locale) && (
          <p className="max-w-2xl text-muted-foreground">
            {getLocalizedDescription(category, locale)}
          </p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          {products.length} {locale === 'ar' ? 'منتج' : 'products'}
        </p>
      </header>

      <ProductGrid products={products} columns={4} />
    </div>
  );
}