import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

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

  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1] || defaultLocale;

  // Admin protection
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

  // Auth pages: redirect logged-in users
  if (/^\/(ar|en)\/auth\/(login|register)/.test(pathname) && user) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Protected user pages
  if (/^\/(ar|en)\/(account|orders|checkout)/.test(pathname) && !user) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};