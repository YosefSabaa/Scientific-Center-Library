import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import CategoryForm from '@/components/admin/CategoryForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default async function EditCategoryPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  setRequestLocale(locale);
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (!category) notFound();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/admin/categories`}>
            <ArrowIcon className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold gradient-text">
          {locale === 'ar' ? 'تعديل تصنيف' : 'Edit Category'}
        </h1>
      </div>
      <CategoryForm category={category as any} />
    </div>
  );
}