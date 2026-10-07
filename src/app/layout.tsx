import type { Metadata, Viewport } from 'next';
import { Cairo, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PWARegister from '@/components/shared/PWARegister';
import GoogleAnalytics from '@/components/shared/GoogleAnalytics';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1E3A8A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'المركز العلمي',
    statusBarStyle: 'default',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} font-sans`}>
        {children}
        <Toaster position="top-center" richColors closeButton toastOptions={{ duration: 3500 }} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <PWARegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}