'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { useCart } from '@/hooks/useCart';
import { useUIStore } from '@/stores/ui-store';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const { count } = useCart();
  const { setCartOpen } = useUIStore();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/categories`, label: t('categories') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-brand-purple/10'
            : 'bg-white'
        )}
      >
        <div className="container-page">
          <div className="flex h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Logo />
              <nav className="hidden lg:flex items-center gap-1">
                {links.map((link) => {
                  const isActive =
                    link.href === `/${locale}`
                      ? pathname === link.href
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative px-4 py-2 text-sm font-semibold transition-colors',
                        isActive
                          ? 'text-brand-purple'
                          : 'text-foreground hover:text-brand-purple'
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute bottom-0 start-4 end-4 h-0.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-light"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:block w-72">
                <SearchBar />
              </div>

              <LanguageSwitcher />

              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href={`/${locale}/auth/login`}
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-purple/10 transition-colors"
                  aria-label={t('login')}
                >
                  <User className="h-5 w-5" />
                </Link>
              )}

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-purple/10 transition-colors"
                aria-label={t('cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-purple to-brand-light px-1 text-[10px] font-bold text-white"
                  >
                    {count > 99 ? '99+' : count}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-purple/10 transition-colors"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} links={links} />
    </>
  );
}