import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
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

export const metadata: Metadata = {
  title: {
    default: 'مكتبة المركز العلمي | Scientific Center Bookstore',
    template: '%s | مكتبة المركز العلمي',
  },
  description:
    'مكتبة المركز العلمي - وجهتك الأولى لكل المستلزمات المكتبية والمدرسية والعلمية بأفضل الأسعار',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} font-sans`}>
        {children}
        <Toaster position="top-center" richColors closeButton toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  );
}