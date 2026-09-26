import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';
import MobileAdminNav from '@/components/admin/MobileAdminNav';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect(`/${locale}`);

  return (
    <div className="flex min-h-screen bg-brand-purple/5">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <MobileAdminNav />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}