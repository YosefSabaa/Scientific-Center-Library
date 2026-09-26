'use client';
import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters, { type Filters } from '@/components/products/ProductFilters';
import Pagination from '@/components/shared/Pagination';
import Breadcrumb from '@/components/shared/Breadcrumb';
import type { Product, Category } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialSearch: string;
}

const ITEMS_PER_PAGE = 12;

export default function ProductsClient({
  initialProducts,
  categories,
  initialSearch,
}: ProductsClientProps) {
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const locale = useLocale();

  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    categoryIds: [],
    minPrice: null,
    maxPrice: null,
    inStock: false,
  });

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name_ar.toLowerCase().includes(q) ||
          p.name_en.toLowerCase().includes(q)
      );
    }

    if (filters.categoryIds.length > 0) {
      result = result.filter(
        (p) => p.category_id && filters.categoryIds.includes(p.category_id)
      );
    }

    if (filters.minPrice !== null) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'newest')
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return result;
  }, [initialProducts, search, sort, filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[{ label: tc('products'), href: `/${locale}/products` }]}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-3 text-4xl font-bold gradient-text md:text-5xl">
          {t('all')}
        </h1>
        <p className="text-muted-foreground">
          {t('showing')} {paginated.length} {t('of')} {filtered.length} {t('product')}
        </p>
      </motion.div>

      {/* Search + Sort */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={tc('search')}
            className="h-12 w-full rounded-xl border border-border bg-white ps-12 pe-4 text-sm focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v)}>
          <SelectTrigger className="md:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('newest')}</SelectItem>
            <SelectItem value="price-asc">{t('priceLow')}</SelectItem>
            <SelectItem value="price-desc">{t('priceHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProductFilters
          categories={categories}
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />

        <div>
          <ProductGrid products={paginated} columns={3} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </div>
    </div>
  );
}