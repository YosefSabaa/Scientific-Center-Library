'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionTitleProps) {
  const alignClass = {
    start: 'text-start items-start',
    center: 'text-center items-center',
    end: 'text-end items-end',
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('flex flex-col gap-3 mb-10', alignClass, className)}
    >
      <div className="flex items-center gap-3">
        <span className="h-1 w-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-light" />
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">{title}</h2>
        {align === 'center' && (
          <span className="h-1 w-8 rounded-full bg-gradient-to-l from-brand-purple to-brand-light" />
        )}
      </div>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl text-balance">{subtitle}</p>
      )}
    </motion.div>
  );
}