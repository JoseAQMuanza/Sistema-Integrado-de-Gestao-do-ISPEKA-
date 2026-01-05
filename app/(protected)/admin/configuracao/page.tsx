// app/admin/configuracoes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);    

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: usuario } = await supabase
        .from('usuario')
        .select(`
          *,
          role(name)`)
        .eq('auth_user_id', user?.id)
        .single();

      setUserInfo(usuario);
    };

    loadData();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo?.role?.name} />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-gray-600">Configure as preferências do sistema</p>
          </div>
          <p>
              Pagina em Manutencao
          </p>                
        </div>
      </div>
    </div>
  );
}
