import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatsCards from '@/components/admin/StatsCards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDateTime } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { Package, ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';

export default async function AdminDashboard({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createClient();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: allOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total, status'),
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const totalRevenue = allOrders?.reduce(
    (sum, o) => (o.status !== 'cancelled' ? sum + Number(o.total) : sum),
    0
  ) || 0;
  const pendingOrders = allOrders?.filter((o) => o.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{t('dashboard')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === 'ar' ? 'نظرة عامة على متجرك' : 'Overview of your store'}
        </p>
      </div>

      <StatsCards
        totalProducts={totalProducts || 0}
        totalOrders={totalOrders || 0}
        totalRevenue={totalRevenue}
        pendingOrders={pendingOrders}
      />

      {/* Recent Orders */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t('recentOrders')}</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/admin/orders`}>
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-start text-xs uppercase text-muted-foreground">
                  <th className="pb-3 text-start">#</th>
                  <th className="pb-3 text-start">
                    {locale === 'ar' ? 'العميل' : 'Customer'}
                  </th>
                  <th className="pb-3 text-start">
                    {locale === 'ar' ? 'الإجمالي' : 'Total'}
                  </th>
                  <th className="pb-3 text-start">
                    {locale === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="pb-3 text-start">
                    {locale === 'ar' ? 'التاريخ' : 'Date'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => {
                  const statusInfo =
                    ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-brand-purple/5"
                    >
                      <td className="py-3 font-mono text-xs font-bold text-brand-purple">
                        {order.order_number}
                      </td>
                      <td className="py-3">{order.customer_name}</td>
                      <td className="py-3 font-bold">
                        {formatPrice(Number(order.total), locale)}
                      </td>
                      <td className="py-3">
                        <Badge className={statusInfo?.color || ''}>
                          {locale === 'ar' ? statusInfo?.labelAr : statusInfo?.labelEn}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {formatDateTime(order.created_at, locale)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <Package className="mx-auto mb-3 h-12 w-12 text-brand-purple/30" />
            {t('noData')}
          </div>
        )}
      </div>
    </div>
  );
}