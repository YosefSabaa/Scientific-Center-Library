'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';

export default function WhyUs() {
  const t = useTranslations('home');

  const features = [
    {
      icon: Truck,
      title: t('fastDelivery'),
      desc: t('fastDeliveryDesc'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ShieldCheck,
      title: t('quality'),
      desc: t('qualityDesc'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Headphones,
      title: t('support'),
      desc: t('supportDesc'),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: CreditCard,
      title: t('securePayment'),
      desc: t('securePaymentDesc'),
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-page">
        <SectionTitle title={t('whyUs')} subtitle={t('whyUsSubtitle')} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-2xl hover:shadow-brand-purple/20"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.gradient}`}
              />
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}
              >
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}