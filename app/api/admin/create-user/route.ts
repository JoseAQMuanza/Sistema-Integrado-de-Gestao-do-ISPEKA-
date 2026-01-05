// app/api/admin/create-user/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // 1. Criar cliente Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignora erro
            }
          },
        },
      }
    );

    // 2. Verificar autenticação
    console.log('Verificando autenticação do usuário...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Erro ao verificar autenticação:', authError);
    }

    console.log('Usuário encontrado:', user?.email);
    console.log('Usuário ID:', user?.id);

    if (!user) {
      console.log('ERRO: Usuário não autenticado');
      return NextResponse.json(
        { error: 'Não autenticado. Faça login novamente.' },
        { status: 401 }
      );
    }

    // 3. Verificar se é admin
    console.log('Verificando se usuário é admin...');
    const { data: usuario, error: userError } = await supabase
      .from('usuario')
      .select(`
        *,
        id,
        role:role_id(name)
      `)
      .eq('auth_user_id', user.id)
      .single();

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
    }

    console.log('Usuário da tabela:', usuario);

    if (!usuario) {
      console.log('ERRO: Usuário não encontrado na tabela usuario');
      return NextResponse.json(
        { error: 'Perfil de usuário não encontrado' },
        { status: 404 }
      );
    }

    // Acessar o nome do role corretamente
    const isAdmin = usuario.role?.name === 'admin';
    console.log('É admin?', isAdmin);
    console.log('Role do usuário:', usuario.role?.name);

    if (!isAdmin) {
      console.log('ERRO: Usuário não tem permissão de admin');
      return NextResponse.json(
        { error: 'Não autorizado. Apenas administradores podem criar usuários.' },
        { status: 403 }
      );
    }

    // 4. Obter dados do request
    const body = await request.json();
    console.log('Dados recebidos do frontend:', body);

    const { nome, email, cargo_id, password } = body;

    // Validação básica
    if (!nome || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // 5. Verificar se email já existe
    console.log('Verificando se email já existe...');
    const { data: existingUser } = await supabase
      .from('usuario')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      console.log('Email já cadastrado:', email);
      return NextResponse.json(
        { error: 'Este email já está cadastrado no sistema' },
        { status: 400 }
      );
    }

    const adminAuthUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`;

    const authResponse = await fetch(adminAuthUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({
        email: email,
        password: password,   
        email_confirm: true,     
        user_metadata: { nome },
      }),
    });

    console.log('Resposta do Auth - Status:', authResponse.status);

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Erro detalhado do Supabase Auth:', errorText);
      throw new Error(`Falha ao criar usuário: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    console.log('Usuário criado no Auth com ID:', authData.id);

    // 7. Buscar role "staff"
    console.log('Buscando role "staff"...');
    const { data: roleStaff, error: roleError } = await supabase
      .from('role')
      .select('id')
      .eq('name', 'staff')
      .single();

    if (roleError || !roleStaff) {
      console.error('Erro ao buscar role staff:', roleError);
      // Pode continuar com um valor padrão se necessário
    }

    // 8. Inserir na tabela usuario
    console.log('Inserindo usuário na tabela...');
    const { error: dbError } = await supabase
      .from('usuario')
      .insert({
        auth_user_id: authData.id,
        nome: nome,
        email: email,
        cargo_id: cargo_id || null,
        role_id: roleStaff?.id || 2, // ID padrão se não encontrar
        ativo: true,
        password: password
      });

    if (dbError) {
      console.error('Erro ao inserir na tabela usuario:', dbError);
      throw dbError;
    }

    console.log('Usuário inserido na tabela com sucesso');

    console.log('=== USUÁRIO CRIADO COM SUCESSO ===');

    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      userId: authData.id,
    });

  } catch (error: any) {
    console.error('Erro completo ao criar usuário:', error);
    return NextResponse.json(
      {
        error: error.message || 'Erro interno do servidor',
        details: error.toString()
      },
      { status: 500 }
    );
  }
  }

