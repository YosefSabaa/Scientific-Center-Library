'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Loader2, Save, Package } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/format';
import Breadcrumb from '@/components/shared/Breadcrumb';
import type { Profile } from '@/types';

interface Props {
  user: { id: string; email?: string };
  profile: Profile | null;
  title: string;
}

export default function AccountClient({ user, profile, title }: Props) {
  const t = useTranslations('account');
  const tc = useTranslations('common');
  const locale = useLocale();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    },
  });

  const onSubmit = async (data: any) => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
      })
      .eq('id', user.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('profileUpdated'));
    }
    setSaving(false);
  };

  const initial = (profile?.full_name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: title }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <Avatar className="h-20 w-20 ring-4 ring-brand-purple/20">
          <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold gradient-text">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {t('welcome')}, {profile?.full_name || user.email}
          </p>
          {profile?.created_at && (
            <p className="text-xs text-muted-foreground">
              {t('memberSince')} {formatDate(profile.created_at, locale)}
            </p>
          )}
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="orders">{t('myOrders')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-bold">{t('profileDesc')}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>{t('fullName')}</Label>
                <div className="relative mt-2">
                  <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input {...register('full_name')} className="ps-10" />
                </div>
              </div>
              <div>
                <Label>{t('phone')}</Label>
                <div className="relative mt-2">
                  <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input {...register('phone')} className="ps-10" dir="ltr" />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>{t('email')}</Label>
                <div className="relative mt-2">
                  <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={user.email || ''} disabled className="ps-10 bg-gray-50" />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>{t('address')}</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea {...register('address')} className="ps-10" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t('updateProfile')}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-brand-purple/30" />
            <p className="mb-4 text-muted-foreground">{t('myOrdersDesc')}</p>
            <Button asChild>
              <Link href={`/${locale}/orders`}>{t('myOrders')}</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}