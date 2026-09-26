'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Percent, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Banner() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-10">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 md:p-12"
        >
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -end-10 h-40 w-40 rounded-full bg-white blur-2xl" />
            <div className="absolute -bottom-10 -start-10 h-40 w-40 rounded-full bg-white blur-2xl" />
          </div>

          <div className="relative flex flex-col items-center gap-6 text-center text-white md:flex-row md:justify-between md:text-start">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg">
                <Percent className="h-10 w-10" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  {locale === 'ar' ? 'عرض محدود' : 'Limited Offer'}
                </p>
                <h3 className="text-2xl font-bold md:text-3xl">
                  {locale === 'ar' ? 'خصم حتى 30% على الأدوات المدرسية' : 'Up to 30% OFF on School Supplies'}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                  <Clock className="h-4 w-4" />
                  <span>{locale === 'ar' ? 'ينتهي قريباً' : 'Ends soon'}</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              asChild
              className="shrink-0 bg-white text-red-600 hover:bg-white/90"
            >
              <Link href={`/${locale}/products`}>
                {locale === 'ar' ? 'اكتشف العروض' : 'Shop Deals'}
                <ArrowIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}