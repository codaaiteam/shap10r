import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ja', 'ko', 'zh-CN', 'zh-tw', 'fr', 'de', 'es', 'it', 'ru']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    const locale = request.headers.get('accept-language')?.split(',')?.[0].split('-')?.[0] || 'en'
    const finalLocale = locales.includes(locale) ? locale : 'en'
    
    return NextResponse.redirect(
      new URL(`/${finalLocale}${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}