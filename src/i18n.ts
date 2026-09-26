import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = (locale ?? defaultLocale) as Locale;

  if (!locales.includes(currentLocale)) notFound();

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
    timeZone: 'Africa/Cairo',
    now: new Date(),
  };
});