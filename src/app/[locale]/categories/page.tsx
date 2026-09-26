import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCategories } from '@/lib/supabase/queries';
import CategoriesClient from './categories-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return { title: t('categories') };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = await getCategories();
  return <CategoriesClient categories={categories} />;
}