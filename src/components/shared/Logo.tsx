'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const locale = useLocale();

  const sizes = {
    sm: { img: 32, text: 'text-base' },
    md: { img: 44, text: 'text-lg' },
    lg: { img: 64, text: 'text-2xl' },
  };

  return (
    <Link
      href={`/${locale}`}
      className={cn('flex items-center gap-3 group transition-transform hover:scale-105', className)}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-brand-gradient rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
        <Image
          src="/logo.png"
          alt="Scientific Center Bookstore"
          width={sizes[size].img}
          height={sizes[size].img}
          className="relative object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-bold gradient-text', sizes[size].text)}>
            {locale === 'ar' ? 'مكتبة المركز العلمي' : 'Scientific Center'}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider">
            {locale === 'ar' ? 'BOOKSTORE' : 'مكتبة المركز العلمي'}
          </span>
        </div>
      )}
    </Link>
  );
}