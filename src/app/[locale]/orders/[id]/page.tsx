import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckCircle2, Package, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getOrderById } from '@/lib/supabase/queries';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDateTime } from '@/lib/format';
import { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS } from '@/lib/constants';

export default async function OrderDetailsPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const order: any = await getOrderById(id);
  if (!order || order.user_id !== user.id) notFound();

  const t = await getTranslations({ locale, namespace: 'orders' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const tch = await getTranslations({ locale, namespace: 'checkout' });

  const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
  const paymentInfo = PAYMENT_STATUSES[order.payment_status as keyof typeof PAYMENT_STATUSES];
  const paymentMethodInfo = PAYMENT_METHODS.find((m) => m.value === order.payment_method);

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: t('title'), href: `/${locale}/orders` },
          { label: order.order_number },
        ]}
      />

      {/* Success Banner */}
      <div className="mb-8 flex items-start gap-4 rounded-2xl border-2 border-green-200 bg-green-50 p-6">
        <CheckCircle2 className="h-8 w-8 shrink-0 text-green-600" />
        <div>
          <h2 className="text-xl font-bold text-green-800">
            {tch('orderSuccess')}
          </h2>
          <p className="text-sm text-green-700">{tch('orderSuccessDesc')}</p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t('orderNumber')}</p>
          <p className="font-mono text-2xl font-bold gradient-text">
            {order.order_number}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateTime(order.created_at, locale)}
          </p>
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

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">{t('items')}</h3>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-border bg-white p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-purple/5">
                  {item.image_url && (
                    <Image src={item.image_url} alt="" fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <p className="font-bold">
                      {locale === 'ar' ? item.product_name_ar : item.product_name_en}
                    </p>
                    {item.variant_info && (
                      <p className="text-xs text-muted-foreground">{item.variant_info}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(item.price, locale)} × {item.quantity}
                    </span>
                    <span className="font-bold text-brand-purple">
                      {formatPrice(item.price * item.quantity, locale)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="mb-4 text-lg font-bold">{tch('orderSummary')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tc('currency') === 'ج.م' ? 'الإجمالي الفرعي' : 'Subtotal'}</span>
                <span className="font-semibold">{formatPrice(order.subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                <span className="font-semibold">{formatPrice(order.shipping, locale)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-bold">{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span className="text-xl font-bold gradient-text">
                  {formatPrice(order.total, locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="mb-4 text-lg font-bold">{tch('customerInfo')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Package className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                <span>{order.customer_name}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                <a href={`tel:${order.customer_phone}`} dir="ltr" className="hover:text-brand-purple">
                  {order.customer_phone}
                </a>
              </li>
              {order.customer_email && (
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                  <span className="break-all">{order.customer_email}</span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                <span>{order.shipping_address}</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 mt-0.5 text-brand-purple shrink-0" />
                <span>
                  {locale === 'ar' ? paymentMethodInfo?.labelAr : paymentMethodInfo?.labelEn}
                </span>
              </li>
            </ul>
          </div>

          {/* Receipt */}
          {order.payment_receipt_url && (
            <div className="rounded-2xl border border-border bg-white p-6">
              <h3 className="mb-4 text-lg font-bold">
                {locale === 'ar' ? 'إيصال التحويل' : 'Payment Receipt'}
              </h3>
              <a
                href={order.payment_receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={order.payment_receipt_url}
                  alt="Receipt"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}