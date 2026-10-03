import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // ساعة

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('slug, updated_at').eq('is_active', true),
    supabase.from('categories').select('slug, created_at').eq('is_active', true),
  ]);

  const staticPages = ['', '/products', '/categories', '/about', '/contact'];
  const locales = ['ar', 'en'];

  const routes: MetadataRoute.Sitemap = [];

  // الصفحات الثابتة
  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    }
  }

  // المنتجات
  products?.forEach((p) => {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  });

  // التصنيفات
  categories?.forEach((c) => {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}/categories/${c.slug}`,
        lastModified: new Date(c.created_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  });

  return routes;
}