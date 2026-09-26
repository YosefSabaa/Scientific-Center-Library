'use client';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-1 hover:text-brand-purple transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{locale === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </li>
        {items.map((item, idx) => (
          <Fragment key={idx}>
            <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <li>
              {item.href && idx < items.length - 1 ? (
                <Link href={item.href} className="hover:text-brand-purple transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}