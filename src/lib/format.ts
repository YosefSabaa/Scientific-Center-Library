export function formatPrice(price: number, locale: string = 'ar'): string {
  const currency = locale === 'ar' ? 'ج.م' : 'EGP';
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted} ${currency}`;
}

export function formatDate(date: string | Date, locale: string = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date, locale: string = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getDiscountPercentage(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}