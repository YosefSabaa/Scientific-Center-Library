 
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Newsletter() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-purple to-brand-light p-10 md:p-16"
        >
          {/* Decorative */}
          <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div className="text-white">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold md:text-4xl">{t('newsletterTitle')}</h3>
              <p className="mt-3 text-white/80">{t('newsletterDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-purple" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletterPlaceholder')}
                  required
                  className="h-14 w-full rounded-2xl bg-white ps-12 pe-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-white text-brand-purple hover:bg-white/90 hover:shadow-white/30"
              >
                {loading ? '...' : t('subscribe')}
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}