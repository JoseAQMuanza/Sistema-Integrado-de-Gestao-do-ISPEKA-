// app/admin/cargos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function CargosPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [cargos, setCargos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: usuario } = await supabase
        .from('usuario')
        .select('*, role(name)')
        .eq('auth_user_id', user.id)
        .single();

      if (usuario?.role?.name !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUserInfo(usuario);
      carregarCargos();
    };

    loadData();
  }, [router]);

  const carregarCargos = async () => {
    const { data } = await supabase
      .from('cargo')
      .select(`
        *,
        usuarios:usuario(count)
      `)
      .order('nome');
    
    setCargos(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editing) {
        // Atualizar
        const { error } = await supabase
          .from('cargo')
          .update(formData)
          .eq('id', editing.id);
        
        if (error) throw error;
      } else {
        // Criar
        const { error } = await supabase
          .from('cargo')
          .insert([formData]);
        
        if (error) throw error;
      }
      
      carregarCargos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar cargo');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', descricao: '' });
    setEditing(null);
  };

  const handleEdit = (cargo: any) => {
    setFormData({
      nome: cargo.nome,
      descricao: cargo.descricao || '',
    });
    setEditing(cargo);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    // Verificar se há usuários com este cargo
    const { count } = await supabase
      .from('usuario')
      .select('*', { count: 'exact', head: true })
      .eq('cargo_id', id);

    if (count && count > 0) {
      alert(`Não é possível excluir este cargo. Existem ${count} usuário(s) vinculado(s) a ele.`);
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este cargo?')) return;
    
    try {
      const { error } = await supabase
        .from('cargo')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      carregarCargos();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir cargo');
    }
  };

  if (!userInfo || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo.role?.name} />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cargos Institucionais</h1>
                <p className="text-gray-600">Gerencie os cargos/funções da instituição</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Cargo
              </button>
            </div>
          </div>

          {/* Lista de Cargos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuários
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cargos.map((cargo) => (
                    <tr key={cargo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {cargo.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {cargo.nome}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {cargo.descricao || 'Sem descrição'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 text-sm font-medium">
                              {cargo.usuarios?.[0]?.count || 0}
                            </span>
                          </span>
                          <span className="ml-2 text-sm text-gray-600">
                            usuário(s)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(cargo.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(cargo)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(cargo.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {cargos.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cargo cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece criando seu primeiro cargo institucional
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editing ? 'Editar Cargo' : 'Novo Cargo Institucional'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Cargo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Ex: Professor, Diretor, Secretário"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Descreva as responsabilidades deste cargo..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editing ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}