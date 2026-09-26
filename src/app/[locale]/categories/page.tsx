import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCategories } from '@/lib/supabase/queries';
import CategoriesClient from './categories-client';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'common' });
  return { title: t('categories') };
}

export default async function CategoriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const categories = await getCategories();
  return <CategoriesClient categories={categories} />;
}