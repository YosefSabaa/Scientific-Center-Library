'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

export default function CategoryForm({ category }: { category?: Category }) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name_ar: category?.name_ar || '',
      name_en: category?.name_en || '',
      slug: category?.slug || '',
      description_ar: category?.description_ar || '',
      description_en: category?.description_en || '',
      icon: category?.icon || '',
      sort_order: category?.sort_order || 0,
    },
  });

  const nameEn = watch('name_en');

  const onSubmit = async (data: any) => {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      ...data,
      slug: data.slug || slugify(data.name_en || data.name_ar),
      sort_order: Number(data.sort_order),
      is_active: isActive,
    };

    let error;
    if (category) {
      const res = await supabase.from('categories').update(payload).eq('id', category.id);
      error = res.error;
    } else {
      const res = await supabase.from('categories').insert(payload);
      error = res.error;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(category ? 'تم التحديث' : 'تم الإضافة');
      router.push(`/${locale}/admin/categories`);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5 rounded-2xl border border-border bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>الاسم بالعربية *</Label>
              <Input {...register('name_ar', { required: true })} className="mt-2" />
            </div>
            <div>
              <Label>الاسم بالإنجليزية *</Label>
              <Input {...register('name_en', { required: true })} className="mt-2" />
            </div>
          </div>

          <div>
            <Label>Slug</Label>
            <Input {...register('slug')} placeholder={slugify(nameEn || '')} className="mt-2" dir="ltr" />
          </div>

          <div>
            <Label>الوصف بالعربية</Label>
            <Textarea {...register('description_ar')} className="mt-2" rows={3} />
          </div>

          <div>
            <Label>الوصف بالإنجليزية</Label>
            <Textarea {...register('description_en')} className="mt-2" rows={3} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            <h3 className="font-bold">الحالة</h3>
            <label className="flex items-center gap-3">
              <Checkbox
                checked={isActive}
                onCheckedChange={(c) => setIsActive(c === true)}
              />
              <span className="text-sm font-medium">مفعّل</span>
            </label>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            <h3 className="font-bold">الإعدادات</h3>
            <div>
              <Label>الأيقونة (Lucide name)</Label>
              <Input {...register('icon')} placeholder="BookOpen" className="mt-2" dir="ltr" />
            </div>
            <div>
              <Label>الترتيب</Label>
              <Input type="number" {...register('sort_order')} className="mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ
        </Button>
      </div>
    </form>
  );
}