// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import HeaderAdmin from '@/components/admin/layout/header';

export default function DashboardPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalDocumentos: 0,
    usuariosAtivos: 0,
    documentosRascunho: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // Carregar informações do usuário
      const { data: usuario } = await supabase
        .from('usuario')
        .select(`
          *,
          role(name),
          cargo(nome)
        `)
        .eq('auth_user_id', user?.id)
        .single();

      setUserInfo(usuario);

      // Se for admin, carregar estatísticas
      if (usuario?.role?.name === 'admin') {
        // Total de usuários
        const { count: totalUsuarios } = await supabase
          .from('usuario')
          .select('*', { count: 'exact', head: true });

        // Usuários ativos
        const { count: usuariosAtivos } = await supabase
          .from('usuario')
          .select('*', { count: 'exact', head: true })
          .eq('ativo', true);

        // Total de documentos
        const { count: totalDocumentos } = await supabase
          .from('documento')
          .select('*', { count: 'exact', head: true });

        // Documentos em rascunho
        const { count: documentosRascunho } = await supabase
          .from('documento')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rascunho');

        setStats({
          totalUsuarios: totalUsuarios || 0,
          totalDocumentos: totalDocumentos || 0,
          usuariosAtivos: usuariosAtivos || 0,
          documentosRascunho: documentosRascunho || 0,
        });
      }
    };

    loadData();
  }, [router]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole='admin'/>        
      {/* Main Content */}
      <div className="flex-1">        
        <HeaderAdmin userInfo={userInfo}/>        
        {/* Main Content */}
        <main className="p-8">
          {userInfo.role?.name === 'admin' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A21 21 0 0034 4.354" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Usuários</h3>
                      <p className="text-2xl font-bold">{stats.totalUsuarios}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Usuários Ativos</h3>
                      <p className="text-2xl font-bold">{stats.usuariosAtivos}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Documentos</h3>
                      <p className="text-2xl font-bold">{stats.totalDocumentos}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Em Rascunho</h3>
                      <p className="text-2xl font-bold">{stats.documentosRascunho}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/admin/users/create"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Criar Usuário</h3>
                      <p className="text-sm text-gray-500">Adicionar novo funcionário</p>
                    </div>
                  </a>

                  <a
                    href="/admin/documents/type"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Tipos de Documento</h3>
                      <p className="text-sm text-gray-500">Gerenciar categorias</p>
                    </div>
                  </a>

                  <a
                    href="/admin/documentos"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Todos Documentos</h3>
                      <p className="text-sm text-gray-500">Ver todos os arquivos</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Usuários Recentes</h2>
                  <a href="/admin/users" className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                    Ver todos →
                  </a>
                </div>
                <UsersTable />
              </div>
            </>
          ) : (
            /* Dashboard para Staff */
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bem-vindo ao Sistema de Documentos
                </h2>
                <p className="text-gray-600 mb-6">
                  Você está logado como <span className="font-semibold">{userInfo.cargo?.nome}</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <a
                    href="/documentos/meus"
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    <div className="text-orange-600 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Meus Documentos</h3>
                    <p className="text-sm text-gray-600 mt-1">Acesse seus documentos</p>
                  </a>

                  <a
                    href="/documentos/publicos"
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <div className="text-green-600 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Documentos Públicos</h3>
                    <p className="text-sm text-gray-600 mt-1">Documentos compartilhados</p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Componente de tabela de usuários (para dashboard)
function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase
        .from('usuario')
        .select(`
          id,
          nome,
          email,
          ativo,
          created_at,
          cargo(nome),
          role(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setUsers(data || []);
      setLoading(false);
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cargo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-medium">
                      {user.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.cargo?.nome || '-'}</div>
                <div className="text-sm text-gray-500">
                  {user.role?.name === 'admin' ? 'Admin' : 'Staff'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.ativo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}