import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // إذا كان المسار / أو فارغاً — أعد كتابته داخلياً إلى /ar (بدون redirect)
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = '/ar';
    return NextResponse.rewrite(url);
  }

  // إذا كان المسار لا يبدأ بـ /ar أو /en ولم يكن مساراً خاصاً
  const isLocalePath = /^\/(ar|en)(\/|$)/.test(pathname);
  const isSpecialPath = /^\/(api|_next|_vercel|.*\..*)/.test(pathname);

  if (!isLocalePath && !isSpecialPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/ar${pathname}`;
    return NextResponse.rewrite(url);
  }

  // بقية الحماية (admin, auth, account, orders, checkout)
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const locale = pathname.split('/')[1] || 'ar';

  if (/^\/(ar|en)\/admin/.test(pathname)) {
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  if (/^\/(ar|en)\/auth\/(login|register)/.test(pathname) && user) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (/^\/(ar|en)\/(account|orders|checkout)/.test(pathname) && !user) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};