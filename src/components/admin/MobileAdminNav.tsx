'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Package, Grid3X3, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { key: 'dashboard', href: '/admin', icon: LayoutDashboard },
  { key: 'products', href: '/admin/products', icon: Package },
  { key: 'categories', href: '/admin/categories', icon: Grid3X3 },
  { key: 'orders', href: '/admin/orders', icon: ShoppingBag },
];

export default function MobileAdminNav() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="lg:hidden sticky top-16 z-30 border-b border-border bg-white shadow-sm">
      <div className="container-page">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {links.map((link) => {
            const href = `/${locale}${link.href}`;
            const isActive =
              link.href === '/admin' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={link.key}
                href={href}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple to-brand-light text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-brand-purple/5 hover:text-brand-purple'
                )}
              >
                <link.icon className="h-4 w-4" />
                {t(link.key)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}