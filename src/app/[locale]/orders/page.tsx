import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserOrders } from '@/lib/supabase/queries';
import Breadcrumb from '@/components/shared/Breadcrumb';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDateTime } from '@/lib/format';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'orders' });
  return { title: t('title') };
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const orders = await getUserOrders(user.id);
  const t = await getTranslations({ locale, namespace: 'orders' });
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t('title') }]} />

      <h1 className="mb-8 text-4xl font-bold gradient-text md:text-5xl">{t('title')}</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title={t('noOrders')}
          description={t('noOrdersDesc')}
          action={
            <Button asChild size="lg">
              <Link href={`/${locale}/products`}>{t('startShopping')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
            const paymentInfo =
              PAYMENT_STATUSES[order.payment_status as keyof typeof PAYMENT_STATUSES];
            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-brand-purple/5 p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('orderNumber')}</p>
                      <p className="font-mono font-bold text-brand-purple">
                        {order.order_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('date')}</p>
                      <p className="text-sm font-semibold">
                        {formatDateTime(order.created_at, locale)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusInfo?.color || ''}>
                      {locale === 'ar' ? statusInfo?.labelAr : statusInfo?.labelEn}
                    </Badge>
                    <Badge className={paymentInfo?.color || ''}>
                      {locale === 'ar' ? paymentInfo?.labelAr : paymentInfo?.labelEn}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4 flex gap-2 overflow-x-auto">
                    {order.items?.slice(0, 5).map((item: any) => (
                      <div
                        key={item.id}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-purple/5"
                      >
                        {item.image_url && (
                          <Image
                            src={item.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                    ))}
                    {order.items?.length > 5 && (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-sm font-bold text-brand-purple">
                        +{order.items.length - 5}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('total')}</p>
                      <p className="text-xl font-bold gradient-text">
                        {formatPrice(order.total, locale)}
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/${locale}/orders/${order.id}`}>
                        {t('details')}
                        <ArrowIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}