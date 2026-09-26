'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-purple to-brand-light">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 start-10 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 end-10 h-96 w-96 rounded-full bg-brand-cyan/40 blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 start-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-light/30 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-page relative z-10 py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-lg"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-semibold">{t('heroBadge')}</span>
            </motion.div>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              <span className="block">{t('heroTitle')}</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-white/90">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-brand-purple hover:bg-white/90 hover:shadow-white/30"
              >
                <Link href={`/${locale}/products`}>
                  {t('shopNow')}
                  <ArrowIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/40 bg-white/5 text-white backdrop-blur-lg hover:border-white hover:bg-white/20"
              >
                <Link href={`/${locale}/categories`}>{t('browseCategories')}</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-brand-light to-brand-purple"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold">+5000</p>
                  <p className="text-white/70">{t('statsCustomers')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                ))}
                <span className="ms-2 text-sm font-semibold">4.9</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border-2 border-dashed border-white/20"
              />

              {/* Logo Center */}
              <div className="absolute inset-16 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-white/30 blur-2xl" />
                  <Image
                    src="/logo.png"
                    alt="Scientific Center"
                    width={280}
                    height={280}
                    className="relative drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              </div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 end-0 rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-lg"
              >
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-xs text-white/80">{t('statsProducts')}</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 start-0 rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-lg"
              >
                <p className="text-2xl font-bold text-white">10+</p>
                <p className="text-xs text-white/80">{t('statsCategories')}</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 end-0 -translate-y-1/2 rounded-2xl border border-white/30 bg-white/20 p-3 backdrop-blur-lg"
              >
                <p className="text-xl font-bold text-white">15+</p>
                <p className="text-[10px] text-white/80">{t('statsYears')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 start-0 end-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}