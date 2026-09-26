import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, 'الاسم قصير جداً'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const checkoutSchema = z.object({
  customer_name: z.string().min(3, 'الاسم قصير جداً'),
  customer_phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  customer_email: z.string().email().optional().or(z.literal('')),
  shipping_address: z.string().min(10, 'العنوان قصير جداً'),
  notes: z.string().optional(),
  payment_method: z.enum(['cod', 'wallet', 'instapay']),
});

export const productSchema = z.object({
  name_ar: z.string().min(2),
  name_en: z.string().min(2),
  slug: z.string().min(2),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  price: z.coerce.number().min(0),
  compare_price: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  category_id: z.string().uuid(),
  sku: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const categorySchema = z.object({
  name_ar: z.string().min(2),
  name_en: z.string().min(2),
  slug: z.string().min(2),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  icon: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;