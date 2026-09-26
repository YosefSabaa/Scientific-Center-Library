'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: { href: string; label: string }[];
}

export default function MobileMenu({ open, onOpenChange, links }: MobileMenuProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isRTL ? 'end-0' : 'start-0'} z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col`}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <Logo size="sm" />
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-purple/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {links.map((link, idx) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-brand-purple/10 hover:text-brand-purple"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border p-4">
              <LanguageSwitcher />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}