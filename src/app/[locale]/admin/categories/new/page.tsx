import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import CategoryForm from '@/components/admin/CategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default async function NewCategoryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
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
          {locale === 'ar' ? 'إضافة تصنيف' : 'Add Category'}
        </h1>
      </div>
      <CategoryForm />
    </div>
  );
}