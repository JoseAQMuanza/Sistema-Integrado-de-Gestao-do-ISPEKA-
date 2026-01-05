// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import HeaderAdmin from '@/components/admin/layout/header';
import StatsCard from '@/components/admin/stats-cards';
import QuickActions from '@/components/admin/quick-actions';
import RecentUsers from '@/components/admin/recents-users';

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
      <Sidebar userRole='admin' />
      {/* Main Content */}
      <div className="flex-1">
        <HeaderAdmin userInfo={userInfo} />
        {/* Main Content */}
        <main className="p-8">
          <>
            {/* Stats Cards */}
            <StatsCard stats={stats}/>

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Users */}
            <RecentUsers />
          </>
        </main>
      </div>
    </div>
  );
}
