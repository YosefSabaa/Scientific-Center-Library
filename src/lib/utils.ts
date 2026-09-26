import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SC-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getLocalizedName(
  item: { name_ar: string; name_en: string },
  locale: string
): string {
  return locale === 'ar' ? item.name_ar : item.name_en;
}

export function getLocalizedDescription(
  item: { description_ar?: string | null; description_en?: string | null },
  locale: string
): string {
  return (locale === 'ar' ? item.description_ar : item.description_en) || '';
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}