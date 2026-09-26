'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Banknote, Wallet, Smartphone, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethodProps {
  value: 'cod' | 'wallet' | 'instapay';
  onChange: (v: 'cod' | 'wallet' | 'instapay') => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  const t = useTranslations('checkout');

  const methods = [
    {
      id: 'cod' as const,
      icon: Banknote,
      title: t('cod'),
      desc: t('codDesc'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'wallet' as const,
      icon: Wallet,
      title: t('wallet'),
      desc: t('walletDesc'),
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'instapay' as const,
      icon: Smartphone,
      title: t('instapay'),
      desc: t('instapayDesc'),
      color: 'from-purple-500 to-blue-500',
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {methods.map((method) => {
        const selected = value === method.id;
        return (
          <motion.button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            whileHover={{ y: -4 }}
            className={cn(
              'relative overflow-hidden rounded-2xl border-2 p-5 text-start transition-all',
              selected
                ? 'border-brand-purple bg-brand-purple/5 shadow-lg shadow-brand-purple/20'
                : 'border-border hover:border-brand-purple/40'
            )}
          >
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 end-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-white"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </motion.div>
            )}

            <div
              className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${method.color} text-white shadow-md`}
            >
              <method.icon className="h-6 w-6" />
            </div>

            <h3 className="mb-1 font-bold">{method.title}</h3>
            <p className="text-xs text-muted-foreground">{method.desc}</p>
          </motion.button>
        );
      })}
    </div>
  );
}