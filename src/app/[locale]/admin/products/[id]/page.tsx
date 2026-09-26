import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default async function EditProductPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ]);

  if (!product) notFound();

  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/admin/products`}>
            <ArrowIcon className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold gradient-text">{t('editProduct')}</h1>
      </div>

      <ProductForm categories={categories || []} product={product as any} />
    </div>
  );
}