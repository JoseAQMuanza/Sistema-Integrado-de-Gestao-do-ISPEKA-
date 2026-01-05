// app/definir-senha/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react'; // Adicionado Suspense
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

// 1. Movemos toda a lógica para um componente interno
function DefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // O hook problemático está aqui agora
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const checkRecovery = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        const token = searchParams.get('token');
        if (!token) {
          setError('Link inválido ou expirado. Solicite um novo link.');
        }
      }
    };
    checkRecovery();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (error: any) {
      setError(error.message || 'Erro ao definir senha');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Senha Definida!</h2>
          <p className="text-gray-600 mb-6">Sua senha foi atualizada com sucesso.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Definir Nova Senha</h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Nova Senha"
          />
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirmar Senha"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Definindo Senha...' : 'Definir Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. A página principal agora apenas envolve o conteúdo com Suspense
export default function DefinirSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <DefinirSenhaContent />
    </Suspense>
  );
}
