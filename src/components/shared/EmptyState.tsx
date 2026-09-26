'use client';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-brand-purple/20 bg-brand-purple/5 p-12 text-center',
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-light/20 text-brand-purple">
        {icon || <PackageOpen className="h-10 w-10" />}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}