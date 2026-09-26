import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCategories, getProducts } from '@/lib/supabase/queries';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import StatsSection from '@/components/home/StatsSection';
import WhyUs from '@/components/home/WhyUs';
import Banner from '@/components/home/Banner';
import Newsletter from '@/components/home/Newsletter';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: t('storeName'),
    description: t('tagline'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, featuredProducts, newProducts] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ sort: 'newest', limit: 8 }),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <StatsSection />
      <NewArrivals products={newProducts} />
      <Banner />
      <WhyUs />
      <Newsletter />
    </>
  );
}