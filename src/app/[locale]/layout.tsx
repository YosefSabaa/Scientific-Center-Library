import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales } from '@/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { STORE_INFO } from '@/lib/constants';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: isAr
        ? 'مكتبة المركز العلمي | كل ما يحتاجه العلم'
        : 'Scientific Center Bookstore',
      template: isAr ? '%s | مكتبة المركز العلمي' : '%s | Scientific Center',
    },
    description: isAr
      ? 'مكتبة المركز العلمي - وجهتك الأولى لكل المستلزمات المكتبية والمدرسية والعلمية بأفضل الأسعار وأعلى جودة'
      : 'Scientific Center Bookstore - Your first destination for all office, school, and scientific supplies',
    keywords: isAr
      ? ['مكتبة', 'قرطاسية', 'أدوات مكتبية', 'أدوات مدرسية', 'كتب', 'أقلام']
      : ['stationery', 'office supplies', 'books', 'pens', 'notebooks'],
    authors: [{ name: STORE_INFO.nameAr }],
    openGraph: {
      type: 'website',
      locale: isAr ? 'ar_EG' : 'en_US',
      url: baseUrl,
      siteName: isAr ? STORE_INFO.nameAr : STORE_INFO.nameEn,
      title: isAr ? 'مكتبة المركز العلمي' : 'Scientific Center Bookstore',
      description: isAr
        ? 'كل ما تحتاجه من قرطاسية وأدوات مكتبية بأفضل الأسعار'
        : 'Everything you need at best prices',
      images: [
        {
          url: '/logo.png',
          width: 512,
          height: 512,
          alt: isAr ? 'مكتبة المركز العلمي' : 'Scientific Center',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? 'مكتبة المركز العلمي' : 'Scientific Center Bookstore',
      description: isAr
        ? 'كل ما تحتاجه من قرطاسية وأدوات مكتبية'
        : 'Everything you need',
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ar: `${baseUrl}/ar`,
        en: `${baseUrl}/en`,
      },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </div>
      </NextIntlClientProvider>
    </div>
  );
}