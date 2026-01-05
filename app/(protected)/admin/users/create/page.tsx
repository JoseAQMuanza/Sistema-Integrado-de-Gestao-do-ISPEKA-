// app/admin/usuarios/criar/page.tsx (ATUALIZADO)
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CriarUsuarioPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cargos, setCargos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo_id: '',        
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [credenciaisGeradas, setCredenciaisGeradas] = useState<any>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

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
            role(name)`)
        .eq('auth_user_id', user.id)
        .single();

      if (usuario?.role?.name !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUserInfo(usuario);

      const { data: cargosData } = await supabase
        .from('cargo')
        .select('*')
        .order('nome');

      setCargos(cargosData || []);
      if (cargosData && cargosData.length > 0) {
        setFormData(prev => ({ ...prev, cargo_id: cargosData[0].id }));
      }
    };

    loadData();
  }, [router]);

  // Função para gerar senha aleatória
  const gerarSenha = (): string => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    const comprimento = 12;
    let senha = '';

    // Garante pelo menos um de cada tipo
    senha += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    senha += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    senha += '0123456789'[Math.floor(Math.random() * 10)];
    senha += '!@#$%&*'[Math.floor(Math.random() * 7)];

    // Completa o resto
    for (let i = 4; i < comprimento; i++) {
      senha += caracteres[Math.floor(Math.random() * caracteres.length)];
    }

    // Embaralha a senha
    return senha.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Função para copiar senha
  const copiarSenha = async () => {
    if (novaSenha) {
      await navigator.clipboard.writeText(novaSenha);
      alert('Senha copiada para a área de transferência!');
    }
  };

  // Função para copiar todas as credenciais
  const copiarCredenciais = async () => {
    if (credenciaisGeradas) {
      const texto = `Novo Usuário Criado\n\n` +
        `Nome: ${credenciaisGeradas.nome}\n` +
        `Email: ${credenciaisGeradas.email}\n` +
        `Senha: ${credenciaisGeradas.senha}\n` +
        `Cargo: ${credenciaisGeradas.cargo}\n` +
        `URL do Sistema: ${window.location.origin}\n\n` +
        `Instruções:\n` +
        `1. Acesse o sistema no link acima\n` +
        `2. Use o email e senha fornecidos\n` +
        `3. Altere sua senha no primeiro acesso`;

      await navigator.clipboard.writeText(texto);
      alert('Credenciais copiadas para a área de transferência!');
    }
  };

  // Função para gerar PDF
  const gerarPDF = () => {
    if (!credenciaisGeradas) return;

    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Credenciais de Acesso', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Sistema de Gestão de Documentos Escolares', 105, 30, { align: 'center' });

    // Linha decorativa
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Informações do usuário
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Dados do Usuário:', 20, 50);

    const infoData = [
      ['Nome:', credenciaisGeradas.nome],
      ['Email:', credenciaisGeradas.email],
      ['Senha:', credenciaisGeradas.senha],
      ['Cargo:', credenciaisGeradas.cargo],
      ['Data de Criação:', new Date().toLocaleDateString('pt-BR')],
      ['URL do Sistema:', window.location.origin],
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Campo', 'Valor']],
      body: infoData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 11 },
      margin: { left: 20, right: 20 },
    });

    // --- SOLUÇÃO DO ERRO: Captura o finalY usando Type Casting ---
    const finalY = (doc as any).lastAutoTable.finalY;

    // Instruções
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Instruções de Acesso:', 20, finalY + 20);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);

    const instructions = [
      '1. Acesse o sistema usando a URL fornecida acima',
      '2. Utilize o email e senha para fazer login',
      '3. No primeiro acesso, altere sua senha em "Perfil"',
      '4. Em caso de problemas, entre em contato com o administrador',
      '5. Mantenha suas credenciais em local seguro',
    ];

    instructions.forEach((instruction, index) => {
      // Usando a variável finalY calculada anteriormente
      doc.text(instruction, 25, finalY + 35 + (index * 7));
    });

    // Rodapé
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento gerado automaticamente pelo sistema', 105, pageHeight - 20, { align: 'center' });
    doc.text(new Date().toLocaleString('pt-BR'), 105, pageHeight - 15, { align: 'center' });

    // Salvar PDF
    doc.save(`credenciais-${credenciaisGeradas.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setNovaSenha('');
    setCredenciaisGeradas(null);

    try {
      // 1. Verificar se email já existe
      const { data: existingUser } = await supabase
        .from('usuario')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Este email já está cadastrado no sistema');
      }

      // 2. Gerar senha aleatória
      const senhaGerada = gerarSenha();
      setNovaSenha(senhaGerada);

      // 3. Obter nome do cargo selecionado
      const cargoSelecionado = cargos.find(c => c.id === formData.cargo_id);
      const cargoNome = cargoSelecionado ? cargoSelecionado.nome : 'Não definido';

      // 4. **IMPORTANTE: Chamar a API com credentials: 'include' para enviar cookies**
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          cargo_id: formData.cargo_id,
          password: senhaGerada,          
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar usuário');
      }

      // 5. Armazenar credenciais para exibir
      const credenciais = {
        nome: formData.nome,
        email: formData.email,
        senha: senhaGerada,
        cargo: cargoNome,
        data: new Date().toLocaleString('pt-BR'),
        userId: result.userId,
      };

      setCredenciaisGeradas(credenciais);

      

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao criar usuário',
      });
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo?.role?.name} />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <a
              href="/admin/users"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para Usuários
            </a>
            <h1 className="text-2xl font-bold text-gray-900">Criar Novo Usuário</h1>
            <p className="text-gray-600">Adicione um novo funcionário ao sistema</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {message.type === 'success' ? (
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Nome */}
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="nome"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: Maria Silva"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Institucional *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: maria.silva@escola.com"
                      />
                    </div>

                    {/* Cargo */}
                    <div>
                      <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo / Função
                      </label>
                      <select
                        id="cargo"
                        value={formData.cargo_id}
                        onChange={(e) => setFormData({ ...formData, cargo_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Selecione um cargo...</option>
                        {cargos.map((cargo) => (
                          <option key={cargo.id} value={cargo.id}>
                            {cargo.nome}
                          </option>
                        ))}
                      </select>
                    </div>                    

                    {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <a
                        href="/admin/users"
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </a>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Criando...
                          </>
                        ) : (
                          'Criar Usuário'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Painel de Credenciais */}
            <div className="lg:col-span-1">
              {credenciaisGeradas ? (
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Usuário Criado!</h3>
                    <p className="text-sm text-gray-600">Credenciais geradas com sucesso</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Dados do Usuário</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Nome</p>
                          <p className="font-medium">{credenciaisGeradas.nome}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium">{credenciaisGeradas.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Cargo</p>
                          <p className="font-medium">{credenciaisGeradas.cargo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Senha Temporária</p>
                          <div className="flex items-center">
                            <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm flex-1">
                              {credenciaisGeradas.senha}
                            </code>
                            <button
                              onClick={copiarSenha}
                              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                              title="Copiar senha"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={copiarCredenciais}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar Todas as Credenciais
                      </button>

                      <button
                        onClick={gerarPDF}
                        className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Gerar PDF com Credenciais
                      </button>

                      <button
                        onClick={() => {
                          setFormData({
                            nome: '',
                            email: '',
                            cargo_id: cargos.length > 0 ? cargos[0].id : '',                                                    
                          });
                          setCredenciaisGeradas(null);
                          setNovaSenha('');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Criar Novo Usuário
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Credenciais</h3>
                    <p className="text-sm text-gray-600">
                      Após criar o usuário, as credenciais aparecerão aqui
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Instruções</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Preencha os dados do formulário
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Clique em "Criar Usuário"
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Gere PDF com as credenciais
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Entregue ao novo usuário
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}