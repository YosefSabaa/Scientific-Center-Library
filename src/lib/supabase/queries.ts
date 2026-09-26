import { createClient } from './server';

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}) {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*, category:categories(id, name_ar, name_en, slug)')
    .eq('is_active', true);

  if (options?.categoryId) query = query.eq('category_id', options.categoryId);
  if (options?.featured) query = query.eq('is_featured', true);
  if (options?.search) {
    query = query.or(
      `name_ar.ilike.%${options.search}%,name_en.ilike.%${options.search}%`
    );
  }

  if (options?.sort === 'price-asc') query = query.order('price', { ascending: true });
  else if (options?.sort === 'price-desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name_ar, name_en, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data;
}

export async function getProductVariants(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId);
  if (error) return [];
  return data;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name_ar, name_en, slug)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(limit);
  if (error) return [];
  return data;
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}