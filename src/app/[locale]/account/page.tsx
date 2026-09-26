import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabase/queries';
import AccountClient from './account-client';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await getProfile(user.id);
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <AccountClient
      user={{ email: user.email, id: user.id }}
      profile={profile}
      title={t('title')}
    />
  );
}