import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    
    const token = request.cookies.get('app_token')?.value;

    const isLoginPage = request.nextUrl.pathname.startsWith('/login');

    if (isLoginPage && token) {
        // Se ele já tá logado e tenta ir pro /login, manda pro dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // deixa o usuario continuar
    return NextResponse.next();
}

export const config = {
    // O matcher define quais rotas vão passar pelo middleware.
    matcher: ['/dashboard/:path*']
}