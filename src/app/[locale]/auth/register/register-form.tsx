'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/shared/Logo';

export default function RegisterForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success(t('registerSuccess'));
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-3xl border border-border bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-2xl font-bold text-center gradient-text">
            {t('registerTitle')}
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {t('registerSubtitle')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <div className="relative mt-2">
                <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="fullName" {...register('fullName')} className="ps-10" />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative mt-2">
                <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" {...register('email')} className="ps-10" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">{t('phone')}</Label>
              <div className="relative mt-2">
                <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" {...register('phone')} className="ps-10" dir="ltr" />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative mt-2">
                <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  {...register('password')}
                  className="ps-10 pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('registerBtn')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('haveAccount')}{' '}
            <Link href={`/${locale}/auth/login`} className="font-semibold text-brand-purple hover:underline">
              {t('loginBtn')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}