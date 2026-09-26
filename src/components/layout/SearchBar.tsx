'use client';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useDebounce } from '@/hooks/useDebounce';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/format';

type ProductResult = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  price: number;
  images: string[];
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 300);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('id, name_ar, name_en, slug, price, images')
        .eq('is_active', true)
        .or(`name_ar.ilike.%${debounced}%,name_en.ilike.%${debounced}%`)
        .limit(6);
      setResults(data || []);
      setOpen(true);
      setLoading(false);
    };
    search();
  }, [debounced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={t('search')}
          className="h-11 w-full rounded-xl border border-border bg-brand-purple/5 ps-10 pe-10 text-sm transition-all focus:border-brand-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-purple"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-2xl z-50"
          >
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t('loading')}
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${locale}/products/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-brand-purple/5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-purple/5">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={locale === 'ar' ? p.name_ar : p.name_en}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {locale === 'ar' ? p.name_ar : p.name_en}
                      </p>
                      <p className="text-xs font-bold text-brand-purple">
                        {formatPrice(p.price, locale)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {locale === 'ar' ? 'لا توجد نتائج' : 'No results'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}