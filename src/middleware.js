import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();

  // Se o usuário não está logado E a página é uma sub-página de /painel
  if (!session && url.pathname.startsWith('/painel') && url.pathname !== '/painel') {
    // Redireciona para a página de login, que é /painel
    url.pathname = '/painel';
    return NextResponse.redirect(url);
  }
  


  return res;
}

// Configuração que define quais rotas serão protegidas pelo middleware
export const config = {
  matcher: [
    '/painel/:path*', // Protege todas as sub-rotas
    '/painel',        // Protege também a rota principal /painel
  ],
};