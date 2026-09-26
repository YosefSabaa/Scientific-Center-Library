import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { STORE_INFO, SOCIAL_LINKS } from '@/lib/constants';

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  const contactItems = [
    {
      icon: MapPin,
      title: t('address'),
      value: locale === 'ar' ? STORE_INFO.addressAr : STORE_INFO.addressEn,
    },
    {
      icon: Phone,
      title: locale === 'ar' ? 'الهاتف' : 'Phone',
      value: STORE_INFO.phone,
      href: `tel:${STORE_INFO.phone}`,
    },
    {
      icon: Mail,
      title: locale === 'ar' ? 'البريد' : 'Email',
      value: STORE_INFO.email,
      href: `mailto:${STORE_INFO.email}`,
    },
    {
      icon: Clock,
      title: t('workingHours'),
      value: t('workingHoursValue'),
    },
  ];

  const socials = [
    { href: SOCIAL_LINKS.facebook, icon: Facebook, label: 'Facebook' },
    { href: SOCIAL_LINKS.instagram, icon: Instagram, label: 'Instagram' },
    { href: SOCIAL_LINKS.twitter, icon: Twitter, label: 'Twitter' },
    { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: 'WhatsApp' },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t('title') }]} />

      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold gradient-text md:text-5xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {contactItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-white p-6 text-center transition-all hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-light text-white shadow-lg">
              <item.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            {item.href ? (
              <a
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-brand-purple"
                dir={item.icon === Phone ? 'ltr' : undefined}
              >
                {item.value}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{item.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Social */}
      <div className="mt-16 text-center">
        <h2 className="mb-6 text-2xl font-bold">{t('followUs')}</h2>
        <div className="flex justify-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-light text-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
              aria-label={s.label}
            >
              <s.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}