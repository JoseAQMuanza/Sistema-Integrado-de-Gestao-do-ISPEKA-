// app/admin/tipos-documento/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function TiposDocumentoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tipos, setTipos] = useState<any[]>([]);
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
      carregarTipos();
    };

    loadData();
  }, [router]);

  const carregarTipos = async () => {
    const { data } = await supabase
      .from('tipo_documento')
      .select('*')
      .order('nome');
    
    setTipos(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editing) {
        // Atualizar
        const { error } = await supabase
          .from('tipo_documento')
          .update(formData)
          .eq('id', editing.id);
        
        if (error) throw error;
      } else {
        // Criar
        const { error } = await supabase
          .from('tipo_documento')
          .insert([formData]);
        
        if (error) throw error;
      }
      
      carregarTipos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar tipo de documento');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', descricao: ''});
    setEditing(null);
  };

  const handleEdit = (tipo: any) => {
    setFormData({
      nome: tipo.nome,
      descricao: tipo.descricao || ''      
    });
    setEditing(tipo);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tipo de documento?')) return;
    
    try {
      const { error } = await supabase
        .from('tipo_documento')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      carregarTipos();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir tipo de documento');
    }
  };

  if (!userInfo || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo.role?.name} />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tipos de Documento</h1>
                <p className="text-gray-600">Gerencie as categorias de documentos do sistema</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Tipo
              </button>
            </div>
          </div>

          {/* Cards dos Tipos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipos.map((tipo) => (
              <div key={tipo.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{tipo.nome}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                        tipo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tipo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(tipo)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(tipo.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {tipo.descricao && (
                  <p className="text-gray-600 text-sm mb-4">{tipo.descricao}</p>
                )}
                
                <div className="text-xs text-gray-500">
                  Criado em: {new Date(tipo.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>

          {tipos.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum tipo de documento</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando seu primeiro tipo de documento
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editing ? 'Editar Tipo' : 'Novo Tipo de Documento'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Ex: Plano de Aula"
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
                      placeholder="Descreva este tipo de documento..."
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
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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