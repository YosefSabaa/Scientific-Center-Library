'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { key: 'dashboard', href: '/admin', icon: LayoutDashboard },
  { key: 'products', href: '/admin/products', icon: Package },
  { key: 'categories', href: '/admin/categories', icon: Grid3X3 },
  { key: 'orders', href: '/admin/orders', icon: ShoppingBag },
];

export default function Sidebar() {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success(locale === 'ar' ? 'تم تسجيل الخروج' : 'Logged out');
    router.push(`/${locale}`);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 bg-brand-ink text-white min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 p-6">
        <div className="relative h-12 w-12 shrink-0">
          <Image src="/logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold">{tc('storeName')}</span>
          <span className="text-[10px] text-white/60">{t('dashboard')}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const href = `/${locale}${link.href}`;
          const isActive =
            link.href === '/admin'
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={link.key}
              href={href}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-brand-purple to-brand-light text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              <span>{t(link.key)}</span>
              {isActive && (
                <motion.span
                  layoutId="adminActive"
                  className="absolute -start-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-brand-light"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/5 hover:text-white"
        >
          <ArrowIcon className="h-5 w-5" />
          {t('backToStore')}
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut className="h-5 w-5" />
          {tc('logout')}
        </button>
      </div>
    </aside>
  );
}