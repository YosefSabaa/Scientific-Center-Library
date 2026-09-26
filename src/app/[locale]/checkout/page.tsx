import { setRequestLocale, getTranslations } from 'next-intl/server';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import Breadcrumb from '@/components/shared/Breadcrumb';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'checkout' });
  return { title: t('title') };
}

export default async function CheckoutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t('title') }]} />

      <h1 className="mb-8 text-4xl font-bold gradient-text md:text-5xl">
        {t('title')}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </div>
  );
}