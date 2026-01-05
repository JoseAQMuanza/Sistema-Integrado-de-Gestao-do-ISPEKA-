'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  const handleSubmit = async (e: React.FormEvent) => {    
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Autenticação
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Obter o usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Usuário não encontrado');
        setLoading(false);
        return;
      }

      // 3. Buscar informações do usuário com role
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuario')
        .select(`
        *,
        role(name)
      `)
        .eq('auth_user_id', user.id)
        .single();

      if (usuarioError) {
        console.error('Erro ao buscar dados do usuário:', usuarioError);
        setError('Erro ao carregar perfil do usuário');
        setLoading(false);
        return;
      }            

      if (usuario?.role?.name === 'admin') {
        router.push("/admin/dashboard")
      } else {
        router.push("staff/dashboard")
      }
      
    } catch (error) {      
      setError('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return  (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-orange-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sistema de Documentos
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ISPEKA - Acesso Restrito
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Institucional
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="seu.email@escola.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a 
                href="/recuperar-senha" 
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-orange-500 group-hover:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Entrar no Sistema
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>Acesso restrito a funcionários autorizados</p>
          </div>
        </form>
      </div>
    </div>
  );
}
