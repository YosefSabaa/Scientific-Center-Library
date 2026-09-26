'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/shared/Logo';

export default function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(locale === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
      setLoading(false);
      return;
    }

    toast.success(t('loginSuccess'));
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
            {t('loginTitle')}
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {t('loginSubtitle')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative mt-2">
                <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="example@email.com"
                  className="ps-10"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
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
                  placeholder="••••••••"
                  className="ps-10 pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-purple"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {locale === 'ar' ? 'جاري الدخول...' : 'Logging in...'}
                </>
              ) : (
                t('loginBtn')
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link
              href={`/${locale}/auth/register`}
              className="font-semibold text-brand-purple hover:underline"
            >
              {t('registerBtn')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}