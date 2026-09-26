'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={switchLanguage}
      className="flex h-10 items-center gap-1.5 rounded-xl border border-brand-purple/20 px-3 text-sm font-semibold transition-colors hover:border-brand-purple hover:bg-brand-purple/10 hover:text-brand-purple"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{locale === 'ar' ? 'EN' : 'ع'}</span>
    </motion.button>
  );
}