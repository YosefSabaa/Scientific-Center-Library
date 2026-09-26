'use client';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Package, Users, Grid3X3, Award } from 'lucide-react';

export default function StatsSection() {
  const t = useTranslations('home');

  const stats = [
    { icon: Package, value: '100+', label: t('statsProducts') },
    { icon: Users, value: '5000+', label: t('statsCustomers') },
    { icon: Grid3X3, value: '10+', label: t('statsCategories') },
    { icon: Award, value: '15+', label: t('statsYears') },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-gradient py-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container-page relative">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center text-white"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg">
                <stat.icon className="h-8 w-8" />
              </div>
              <p className="text-3xl font-bold md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}