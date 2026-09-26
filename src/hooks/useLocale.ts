'use client';
import { useLocale as useNextIntlLocale } from 'next-intl';

export function useLocale() {
  const locale = useNextIntlLocale();
  return {
    locale,
    isRTL: locale === 'ar',
  };
}