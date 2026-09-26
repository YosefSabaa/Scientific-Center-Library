import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/format';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{t('orders')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders?.length || 0} {locale === 'ar' ? 'طلب' : 'orders'}
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
            const paymentInfo =
              PAYMENT_STATUSES[order.payment_status as keyof typeof PAYMENT_STATUSES];
            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-brand-purple/5 p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">#</p>
                      <p className="font-mono text-sm font-bold text-brand-purple">
                        {order.order_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'العميل' : 'Customer'}
                      </p>
                      <p className="text-sm font-semibold">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {order.customer_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'التاريخ' : 'Date'}
                      </p>
                      <p className="text-xs">{formatDateTime(order.created_at, locale)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={paymentInfo?.color || ''}>
                      {locale === 'ar' ? paymentInfo?.labelAr : paymentInfo?.labelEn}
                    </Badge>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-3 flex gap-2 overflow-x-auto">
                      {order.items?.slice(0, 6).map((item: any) => (
                        <div
                          key={item.id}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-purple/5"
                        >
                          {item.image_url && (
                            <Image src={item.image_url} alt="" fill className="object-cover" sizes="64px" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-foreground">
                          {locale === 'ar' ? 'العنوان:' : 'Address:'}
                        </span>{' '}
                        {order.shipping_address}
                      </p>
                      {order.notes && (
                        <p>
                          <span className="font-semibold text-foreground">
                            {locale === 'ar' ? 'ملاحظات:' : 'Notes:'}
                          </span>{' '}
                          {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-end">
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'الإجمالي' : 'Total'}
                      </p>
                      <p className="text-xl font-bold gradient-text">
                        {formatPrice(Number(order.total), locale)}
                      </p>
                    </div>
                    {order.payment_receipt_url && (
                      <a
                        href={order.payment_receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-20 w-20 overflow-hidden rounded-xl border border-border"
                      >
                        <Image
                          src={order.payment_receipt_url}
                          alt="Receipt"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-brand-purple/30" />
          <p className="text-muted-foreground">{t('noData')}</p>
        </div>
      )}
    </div>
  );
}