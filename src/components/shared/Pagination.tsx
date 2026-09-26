'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border transition-all',
          'hover:border-brand-purple hover:text-brand-purple',
          'disabled:opacity-40 disabled:pointer-events-none'
        )}
      >
        {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={cn(
            'flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all',
            page === currentPage
              ? 'bg-gradient-to-r from-brand-purple to-brand-light text-white border-transparent shadow-lg shadow-brand-purple/30'
              : 'hover:border-brand-purple hover:text-brand-purple',
            page === '...' && 'pointer-events-none'
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border transition-all',
          'hover:border-brand-purple hover:text-brand-purple',
          'disabled:opacity-40 disabled:pointer-events-none'
        )}
      >
        {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
}