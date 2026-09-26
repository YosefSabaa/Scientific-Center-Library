'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, LayoutDashboard, LogOut, Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function UserMenu() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { user, profile, isAdmin } = useUser();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success(locale === 'ar' ? 'تم تسجيل الخروج' : 'Logged out');
    router.push(`/${locale}`);
    router.refresh();
  };

  const initial = (profile?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-10 w-10 ring-2 ring-brand-purple/20 hover:ring-brand-purple/50 transition-all">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate">
              {profile?.full_name || (locale === 'ar' ? 'مرحباً' : 'Welcome')}
            </span>
            <span className="text-xs font-normal text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/${locale}/account`} className="cursor-pointer">
            <User className="h-4 w-4" />
            {t('account')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/${locale}/orders`} className="cursor-pointer">
            <Package className="h-4 w-4" />
            {t('orders')}
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/admin`} className="cursor-pointer text-brand-purple">
                <LayoutDashboard className="h-4 w-4" />
                {t('admin')}
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}