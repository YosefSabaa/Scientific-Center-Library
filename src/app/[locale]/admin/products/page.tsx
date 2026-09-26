 
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Package } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { getLocalizedName } from '@/lib/utils';

export default async function AdminProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name_ar, name_en, slug)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{t('products')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products?.length || 0} {locale === 'ar' ? 'منتج' : 'products'}
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/products/new`}>
            <Plus className="h-4 w-4" />
            {t('addProduct')}
          </Link>
        </Button>
      </div>

      {products && products.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-purple/5">
                <tr>
                  <th className="p-4 text-start font-semibold">
                    {locale === 'ar' ? 'المنتج' : 'Product'}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {locale === 'ar' ? 'التصنيف' : 'Category'}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {locale === 'ar' ? 'السعر' : 'Price'}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {locale === 'ar' ? 'المخزون' : 'Stock'}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {locale === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="p-4 text-end font-semibold" />
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-t border-border hover:bg-brand-purple/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-purple/5">
                          {p.images?.[0] && (
                            <Image src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-semibold">
                            {getLocalizedName(p, locale)}
                          </p>
                          {p.sku && (
                            <p className="text-xs text-muted-foreground">{p.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {p.category ? getLocalizedName(p.category, locale) : '-'}
                    </td>
                    <td className="p-4 font-bold text-brand-purple">
                      {formatPrice(Number(p.price), locale)}
                    </td>
                    <td className="p-4">
                      <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.is_active ? 'success' : 'danger'}>
                        {p.is_active
                          ? locale === 'ar'
                            ? 'مفعّل'
                            : 'Active'
                          : locale === 'ar'
                          ? 'معطّل'
                          : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-end">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/${locale}/admin/products/${p.id}`}>
                          <Edit className="h-3.5 w-3.5" />
                          {locale === 'ar' ? 'تعديل' : 'Edit'}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-brand-purple/30" />
          <p className="text-muted-foreground">{t('noData')}</p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}/admin/products/new`}>
              <Plus className="h-4 w-4" />
              {t('addProduct')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}