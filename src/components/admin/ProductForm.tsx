'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, Save, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { getLocalizedName, slugify } from '@/lib/utils';
import type { Category, Product } from '@/types';

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const t = useTranslations('admin');
  const tf = useTranslations('admin.fields');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name_ar: product?.name_ar || '',
      name_en: product?.name_en || '',
      slug: product?.slug || '',
      description_ar: product?.description_ar || '',
      description_en: product?.description_en || '',
      price: product?.price || 0,
      compare_price: product?.compare_price || null,
      stock: product?.stock || 0,
      category_id: product?.category_id || '',
      sku: product?.sku || '',
      is_featured: product?.is_featured || false,
      is_active: product?.is_active ?? true,
    },
  });

  const nameAr = watch('name_ar');
  const categoryId = watch('category_id');
  const isFeatured = watch('is_featured');
  const isActive = watch('is_active');

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      if (error) throw error;
      const { data: url } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      setImages((imgs) => [...imgs, url.publicUrl]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((imgs) => imgs.filter((i) => i !== url));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const supabase = createClient();

    const payload = {
      ...data,
      slug: data.slug || slugify(data.name_en || data.name_ar),
      price: Number(data.price),
      compare_price: data.compare_price ? Number(data.compare_price) : null,
      stock: Number(data.stock),
      images,
    };

    let error;
    if (product) {
      const res = await supabase.from('products').update(payload).eq('id', product.id);
      error = res.error;
    } else {
      const res = await supabase.from('products').insert(payload);
      error = res.error;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(product ? t('productUpdated') : t('productCreated'));
      router.push(`/${locale}/admin/products`);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5 rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">
            {locale === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>{tf('nameAr')} *</Label>
              <Input {...register('name_ar', { required: true })} className="mt-2" />
            </div>
            <div>
              <Label>{tf('nameEn')} *</Label>
              <Input {...register('name_en', { required: true })} className="mt-2" />
            </div>
          </div>

          <div>
            <Label>{tf('slug')}</Label>
            <Input
              {...register('slug')}
              placeholder={slugify(nameAr || '')}
              className="mt-2"
              dir="ltr"
            />
          </div>

          <div>
            <Label>{tf('descriptionAr')}</Label>
            <Textarea {...register('description_ar')} className="mt-2" rows={4} />
          </div>

          <div>
            <Label>{tf('descriptionEn')}</Label>
            <Textarea {...register('description_en')} className="mt-2" rows={4} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <h3 className="font-bold">{locale === 'ar' ? 'الحالة' : 'Status'}</h3>
            <label className="flex items-center gap-3">
              <Checkbox
                checked={isActive}
                onCheckedChange={(c) => setValue('is_active', c === true)}
              />
              <span className="text-sm font-medium">{tf('isActive')}</span>
            </label>
            <label className="flex items-center gap-3">
              <Checkbox
                checked={isFeatured}
                onCheckedChange={(c) => setValue('is_featured', c === true)}
              />
              <span className="text-sm font-medium">{tf('isFeatured')}</span>
            </label>
          </div>

          {/* Pricing */}
          <div className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <h3 className="font-bold">{locale === 'ar' ? 'التسعير' : 'Pricing'}</h3>
            <div>
              <Label>{tf('price')} *</Label>
              <Input
                type="number"
                step="0.01"
                {...register('price', { required: true })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>{tf('comparePrice')}</Label>
              <Input type="number" step="0.01" {...register('compare_price')} className="mt-2" />
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <h3 className="font-bold">{locale === 'ar' ? 'المخزون' : 'Inventory'}</h3>
            <div>
              <Label>{tf('stock')} *</Label>
              <Input
                type="number"
                {...register('stock', { required: true })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>{tf('sku')}</Label>
              <Input {...register('sku')} className="mt-2" dir="ltr" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4 rounded-2xl border border-border bg-white p-6">
            <h3 className="font-bold">{tf('category')} *</h3>
            <Select
              value={categoryId}
              onValueChange={(v) => setValue('category_id', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {getLocalizedName(c, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">{tf('images')}</h2>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {images.map((img) => (
            <div
              key={img}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border"
            >
              <Image src={img} alt="" fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute top-1 end-1 flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border transition-all hover:border-brand-purple hover:bg-brand-purple/5">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-brand-purple" />
                <span className="text-[10px] font-semibold">
                  {locale === 'ar' ? 'إضافة' : 'Add'}
                </span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {locale === 'ar' ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {product ? (locale === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (locale === 'ar' ? 'إضافة المنتج' : 'Add Product')}
        </Button>
      </div>
    </form>
  );
}