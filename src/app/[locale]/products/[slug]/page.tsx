import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  getProductBySlug,
  getProductVariants,
  getRelatedProducts,
} from '@/lib/supabase/queries';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import RelatedProducts from '@/components/products/RelatedProducts';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { getLocalizedName } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };
  return {
    title: getLocalizedName(product, locale),
    description: product.description_ar || product.description_en,
  };
}

export default async function ProductDetailsPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: 'products' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const [variants, related] = await Promise.all([
    getProductVariants(product.id),
    product.category_id
      ? getRelatedProducts(product.category_id, product.id, 4)
      : Promise.resolve([]),
  ]);

  const name = getLocalizedName(product, locale);

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: tc('products'), href: `/${locale}/products` },
          ...(product.category
            ? [
                {
                  label: getLocalizedName(product.category, locale),
                  href: `/${locale}/categories/${product.category.slug}`,
                },
              ]
            : []),
          { label: name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images || []} name={name} />
        <ProductInfo product={product} variants={variants} />
      </div>

      {/* Tabs: Description / Specs / Reviews */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="description">{t('description')}</TabsTrigger>
            <TabsTrigger value="specs">{t('specifications')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="prose prose-lg max-w-none rounded-2xl border border-border bg-white p-6">
            <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
              {(locale === 'ar' ? product.description_ar : product.description_en) ||
                (locale === 'ar' ? 'لا يوجد وصف' : 'No description')}
            </p>
          </TabsContent>

          <TabsContent value="specs" className="rounded-2xl border border-border bg-white p-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="font-semibold">{tc('storeName')}</dt>
                <dd className="text-muted-foreground">{name}</dd>
              </div>
              {product.sku && (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="font-semibold">{t('sku')}</dt>
                  <dd className="text-muted-foreground">{product.sku}</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="font-semibold">{t('inStock')}</dt>
                <dd className="text-muted-foreground">{product.stock}</dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="rounded-2xl border border-border bg-white p-6">
            <p className="text-center text-muted-foreground">
              {locale === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}