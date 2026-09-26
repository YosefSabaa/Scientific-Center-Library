import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Grid3X3 } from 'lucide-react';
import { getLocalizedName } from '@/lib/utils';

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{t('categories')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories?.length || 0} {locale === 'ar' ? 'تصنيف' : 'categories'}
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/categories/new`}>
            <Plus className="h-4 w-4" />
            {t('addCategory')}
          </Link>
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c: any) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4"
            >
              <div className="min-w-0">
                <p className="font-bold">{getLocalizedName(c, locale)}</p>
                <p className="text-xs text-muted-foreground">{c.slug}</p>
                <Badge variant={c.is_active ? 'success' : 'danger'} className="mt-2">
                  {c.is_active ? 'مفعّل' : 'معطّل'}
                </Badge>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/${locale}/admin/categories/${c.id}`}>
                  <Edit className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Grid3X3 className="mx-auto mb-3 h-12 w-12 text-brand-purple/30" />
          <p className="text-muted-foreground">{t('noData')}</p>
        </div>
      )}
    </div>
  );
}