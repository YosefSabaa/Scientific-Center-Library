'use client';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/format';

interface StatsCardsProps {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function StatsCards({
  totalProducts,
  totalOrders,
  totalRevenue,
  pendingOrders,
}: StatsCardsProps) {
  const t = useTranslations('admin.stats');
  const locale = useLocale();

  const stats = [
    {
      title: t('totalProducts'),
      value: totalProducts.toString(),
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('totalOrders'),
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: t('totalRevenue'),
      value: formatPrice(totalRevenue, locale),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: t('pendingOrders'),
      value: pendingOrders.toString(),
      icon: Clock,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all hover:shadow-xl"
        >
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`}
          />
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                {stat.title}
              </p>
              <p className="truncate text-2xl font-bold">{stat.value}</p>
            </div>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}