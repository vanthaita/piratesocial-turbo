import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/in'];
const authPath = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;
    if (!token && privatePath.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (token && authPath.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (token && privatePath.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }
    return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/messages/:path*',
  ],
}