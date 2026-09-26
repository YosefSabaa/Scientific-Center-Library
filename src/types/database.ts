export type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  compare_price: number | null;
  images: string[];
  stock: number;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  type: string;
  value: string;
  price_diff: number;
  stock: number;
  image_url: string | null;
  created_at: string;
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'wallet' | 'instapay';

export type PaymentStatus = 'unpaid' | 'pending_review' | 'paid' | 'rejected';

export type Order = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_receipt_url: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name_ar: string;
  product_name_en: string;
  variant_info: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
};

export type CartItem = {
  productId: string;
  variantId: string | null;
  nameAr: string;
  nameEn: string;
  price: number;
  quantity: number;
  image: string;
  variantInfo?: string;
  stock: number;
};