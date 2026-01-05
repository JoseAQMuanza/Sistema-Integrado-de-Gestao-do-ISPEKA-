// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Verificar se o usuário está logado
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isSignInPage = pathname === '/signin'

  // Caso 1: Não está logado
  if (!user) {
    if (!isSignInPage) {
      // Redireciona qualquer tentativa de acesso para /signin
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return response // Permite ficar na página de signin
  }

  // 2. Se está logado, buscar a ROLE no banco de dados
  const { data: usuario } = await supabase
    .from('usuario')
    .select(`*,
      role(name)`) 
    .eq('auth_user_id', user.id)
    .single()

  const role = (usuario?.role as any)?.name?.toLowerCase()

  // 3. Lógica de Redirecionamento Baseado em Role
  
  // Se tentar acessar o login já estando logado, manda para o destino certo
  if (isSignInPage) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'staff') return NextResponse.redirect(new URL('/staff/dashboard', request.url))
  }

  // Proteção de Rotas Cruzadas (Prevenir admin em staff e vice-versa)
  if (pathname.startsWith('/staff') && role !== 'staff') {
    // Se for admin tentando entrar em /staff, manda para /admin/dashboard
    const dest = role === 'admin' ? '/admin/dashboard' : '/signin'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    // Se for staff tentando entrar em /admin, manda para /staff/dashboard
    const dest = role === 'staff' ? '/staff/dashboard' : '/signin'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Se estiver na raiz "/" manda para o dashboard específico
  if (pathname === '/') {
    const dest = role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Protege todas as rotas exceto arquivos estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
