// app/perfil/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function PerfilPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    departamento: '',
    bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: usuario } = await supabase
        .from('usuario')
        .select(`
          *,
          cargo(nome),
          role(name)
        `)
        .eq('auth_user_id', user.id)
        .single();

      if (!usuario) {
        router.push('/dashboard');
        return;
      }

      setUserInfo(usuario);
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        departamento: usuario.departamento || '',
        bio: usuario.bio || '',
      });
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
          departamento: formData.departamento,
          bio: formData.bio,
        })
        .eq('id', userInfo.id);

      if (error) throw error;

      // Atualizar metadata no auth
      await supabase.auth.updateUser({
        data: { nome: formData.nome }
      });

      // Recarregar dados
      const { data: updated } = await supabase
        .from('usuario')
        .select(`
          *,
          cargo(nome),
          role(name)
        `)
        .eq('id', userInfo.id)
        .single();

      setUserInfo(updated);
      setEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha');
    }
  };

  const handleUploadFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho e tipo
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userInfo.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('usuario')
        .update({ avatar_url: publicUrl })
        .eq('id', userInfo.id);

      if (updateError) throw updateError;

      // Atualizar localmente
      setUserInfo({ ...userInfo, avatar_url: publicUrl });
      alert('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da foto');
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card do Perfil */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block">
                    <div className="h-32 w-32 rounded-full bg-orange-100 mx-auto overflow-hidden">
                      {userInfo.avatar_url ? (
                        <img
                          src={userInfo.avatar_url}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-4xl text-orange-600">
                            {userInfo.nome?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadFoto}
                      />
                    </label>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-gray-900">{userInfo.nome}</h2>
                  <p className="text-gray-600">{userInfo.cargo?.nome || 'Sem cargo'}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {userInfo.email}
                    </div>
                    {userInfo.telefone && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {userInfo.telefone}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mt-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userInfo.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {userInfo.ativo ? '✅ Ativo' : '❌ Inativo'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ml-2">
                      {userInfo.role?.name === 'admin' ? '👑 Admin' : '👤 Staff'}
                    </span>
                  </div>

                  {/* Estatísticas */}
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Documentos Criados</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Último Acesso</span>
                      <span className="font-medium">Hoje</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Membro Desde</span>
                      <span className="font-medium">
                        {new Date(userInfo.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {/* Abas */}
                <div className="border-b">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`py-4 px-6 text-sm font-medium ${activeTab === 'info'
                          ? 'border-b-2 border-orange-500 text-orange-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Informações Pessoais
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`py-4 px-6 text-sm font-medium ${activeTab === 'password'
                          ? 'border-b-2 border-orange-500 text-orange-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Segurança
                    </button>
                    <button
                      onClick={() => setActiveTab('preferences')}
                      className={`py-4 px-6 text-sm font-medium ${activeTab === 'preferences'
                          ? 'border-b-2 border-orange-500 text-orange-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Preferências
                    </button>
                  </nav>
                </div>

                {/* Conteúdo das Abas */}
                <div className="p-6">
                  {/* Tab: Informações Pessoais */}
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      {editing ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome Completo *
                              </label>
                              <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Para alterar o email, entre em contato com o administrador.
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone
                              </label>
                              <input
                                type="tel"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="(00) 00000-0000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departamento
                              </label>
                              <input
                                type="text"
                                value={formData.departamento}
                                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Biografia
                            </label>
                            <textarea
                              value={formData.bio}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Conte um pouco sobre você..."
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setEditing(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                              Salvar Alterações
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Nome Completo</h4>
                              <p className="mt-1 text-gray-900">{userInfo.nome}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Email</h4>
                              <p className="mt-1 text-gray-900">{userInfo.email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                              <p className="mt-1 text-gray-900">{userInfo.telefone || 'Não informado'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Departamento</h4>
                              <p className="mt-1 text-gray-900">{userInfo.departamento || 'Não informado'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-gray-500">Biografia</h4>
                              <p className="mt-1 text-gray-900">{userInfo.bio || 'Nenhuma biografia adicionada.'}</p>
                            </div>
                          </div>
                          <div className="pt-6 border-t">
                            <button
                              onClick={() => setEditing(true)}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                              Editar Perfil
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Tab: Segurança */}
                  {activeTab === 'password' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Senha Atual
                            </label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nova Senha
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Confirmar Nova Senha
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleChangePassword}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                              Alterar Senha
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Sessões Ativas</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Este dispositivo</p>
                              <p className="text-sm text-gray-500">Navegador: Chrome • Sistema: Windows</p>
                            </div>
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Encerrar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Preferências */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notificações</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Notificações por Email</p>
                              <p className="text-sm text-gray-500">Receba notificações sobre seus documentos</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Lembretes</p>
                              <p className="text-sm text-gray-500">Lembretes de prazos de documentos</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Aparência</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tema
                            </label>
                            <div className="flex space-x-4">
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                🌙 Escuro
                              </button>
                              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                                ☀️ Claro
                              </button>
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                ⚙️ Automático
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}