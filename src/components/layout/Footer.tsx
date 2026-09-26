'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, MessageCircle, Send, Camera, AtSign } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { STORE_INFO, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');
  const locale = useLocale();
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale}`, label: tc('home') },
    { href: `/${locale}/products`, label: tc('products') },
    { href: `/${locale}/categories`, label: tc('categories') },
    { href: `/${locale}/about`, label: tc('about') },
    { href: `/${locale}/contact`, label: tc('contact') },
  ];

  const customerService = [
    { label: t('faq'), href: '#' },
    { label: t('returns'), href: '#' },
    { label: t('privacy'), href: '#' },
    { label: t('terms'), href: '#' },
  ];

  const socials = [
    { href: SOCIAL_LINKS.facebook, icon: AtSign },
    { href: SOCIAL_LINKS.instagram, icon: Camera },
    { href: SOCIAL_LINKS.twitter, icon: Send },
    { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle },
  ];

  return (
    <footer className="relative mt-20 bg-brand-ink text-white overflow-hidden">
      <div className="absolute inset-0 bg-brand-radial opacity-20" />
      <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-brand-purple/30 blur-3xl" />
      <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-brand-light/30 blur-3xl" />

      <div className="container-page relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sm text-white/70 leading-relaxed">{t('about')}</p>
            <div className="flex items-center gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-all hover:bg-brand-purple hover:-translate-y-1"
                  aria-label="Social link"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{t('quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-brand-light inline-flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-brand-light" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{t('customerService')}</h3>
            <ul className="space-y-2.5">
              {customerService.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-brand-light inline-flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-brand-light" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-light shrink-0" />
                <span>{locale === 'ar' ? STORE_INFO.addressAr : STORE_INFO.addressEn}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-4 w-4 text-brand-light shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-brand-light transition-colors">
                  {STORE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-4 w-4 text-brand-light shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-brand-light transition-colors">
                  {STORE_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-white/60 text-center md:text-start">
            © {year} {tc('storeName')}. {t('rights')}
          </p>
          <p className="text-xs text-white/60">
            {locale === 'ar' ? 'صُنع بـ' : 'Made with'} ❤️ {locale === 'ar' ? 'في مصر' : 'in Egypt'}
          </p>
        </div>
      </div>
    </footer>
  );
}