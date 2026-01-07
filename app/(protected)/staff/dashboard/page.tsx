// app/staff/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState({
    meusDocumentos: 0,
    documentosPublicos: 0,
    documentosCompartilhados: 0,
    documentosRascunho: 0,
  });
  const [documentosRecentes, setDocumentosRecentes] = useState<any[]>([]);
  const [documentosCompartilhados, setDocumentosCompartilhados] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [baixando, setBaixando] = useState<string | null>(null);
  const [departamentos, setDepartamentos] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: usuario } = await supabase
        .from('usuario')
        .select(`
          id,
          nome,
          email,
          cargo(nome),
          role(name),
          departamento(nome)
        `)
        .eq('auth_user_id', user?.id)
        .single();

      setUserInfo(usuario);
      await carregarDocumentos(usuario?.id);

      // Carregar tipos de documento
      const { data: tipos } = await supabase
        .from('tipo_documento')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      setTiposDocumento(tipos || []);
      // Carregar estatísticas
      await carregarEstatisticas(usuario?.id);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const getVisibilidadeIcon = (visibilidade: string) => {
    const icons: any = {
      'publico': '🌐',
      'departamento': '🏢',
      'privado': '🔒',
    };
    return icons[visibilidade] || '📄';
  };

  const getVisibilidadeText = (visibilidade: string) => {
    const textos: any = {
      'publico': 'Público',
      'departamento': 'Departamento',
      'privado': 'Privado',
    };
    return textos[visibilidade] || visibilidade;
  };

  const temArquivos = (doc: any) => {
    return doc.documento_arquivo && doc.documento_arquivo.length > 0;
  };

  const carregarDocumentos = async (usuarioId: string) => {
    try {
      const { data: docs } = await supabase
        .from('documento')
        .select(`
            *,
            tipo_documento_id(nome, icon),
            documento_arquivo_id(id, nome_original)
          `)
        .eq('criado_por', usuarioId)
        .order('created_at', { ascending: false });

      setDocumentos(docs || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarDocumentos = () => {
    return documentos.filter(doc => {
      const matchesSearch =
        doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
        doc.descricao?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = filtroStatus === 'todos' || doc.status === filtroStatus;
      const matchesTipo = filtroTipo === 'todos' || doc.tipo_documento_id === filtroTipo;

      return matchesSearch && matchesStatus && matchesTipo;
    });
  };

  const documentosFiltrados = filtrarDocumentos();

  const getStatusColor = (status: string) => {
    const colors: any = {
      'rascunho': 'bg-yellow-100 text-yellow-800',
      'revisao': 'bg-blue-100 text-blue-800',
      'finalizado': 'bg-green-100 text-green-800',
      'arquivado': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const textos: any = {
      'rascunho': 'Rascunho',
      'revisao': 'Em Revisão',
      'finalizado': 'Finalizado',
      'arquivado': 'Arquivado',
    };
    return textos[status] || status;
  };

  const downloadFile = async (documentoId: string) => {
    console.log('Iniciando download para documento:', documentoId);

    try {
      // 1. Buscar informações dos arquivos
      const { data: arquivos, error: buscaError } = await supabase
        .from('documento_arquivo')
        .select('id, path, nome_original')
        .eq('documento_id', documentoId);

      if (buscaError) {
        console.error('Erro ao buscar arquivos:', buscaError);
        alert(`Erro ao buscar arquivos: ${buscaError.message}`);
        return;
      }

      if (!arquivos || arquivos.length === 0) {
        alert('Nenhum arquivo encontrado para este documento');
        return;
      }

      console.log('Arquivos encontrados:', arquivos);

      // 2. Escolher arquivo (se múltiplos)
      let arquivoSelecionado;
      if (arquivos.length === 1) {
        arquivoSelecionado = arquivos[0];
      } else {
        const nomes = arquivos.map((a, i) => `${i + 1}. ${a.nome_original}`);
        const selecao = prompt(
          `Selecione o arquivo para baixar:\n\n${nomes.join('\n')}\n\nDigite o número:`
        );

        const index = parseInt(selecao || '') - 1;
        if (index >= 0 && index < arquivos.length) {
          arquivoSelecionado = arquivos[index];
        } else {
          alert('Seleção inválida');
          return;
        }
      }

      console.log('Arquivo selecionado:', arquivoSelecionado);

      // 3. Obter URL assinada (mais confiável)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('sgid_ispeka_files')
        .createSignedUrl(arquivoSelecionado.path, 60); // 60 segundos

      if (signedUrlError) {
        console.error('Erro ao criar URL assinada:', signedUrlError);

        // Tentar URL pública como fallback
        const { data: publicUrlData } = supabase.storage
          .from('sgid_ispeka_files')
          .getPublicUrl(arquivoSelecionado.path);

        console.log('Tentando URL pública:', publicUrlData.publicUrl);

        if (publicUrlData.publicUrl) {
          window.open(publicUrlData.publicUrl, '_blank');
          return;
        }

        alert('Não foi possível acessar o arquivo. Verifique as permissões.');
        return;
      }

      // 4. Baixar via URL assinada
      console.log('URL assinada obtida:', signedUrlData.signedUrl);

      // Método 1: Abrir em nova aba (simples)
      window.open(signedUrlData.signedUrl, '_blank');

      // OU Método 2: Forçar download
      // forceDownload(signedUrlData.signedUrl, arquivoSelecionado.nome_original);

    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro: ${error.message || 'Erro desconhecido ao baixar arquivo'}`);
    }
  };

  const carregarEstatisticas = async (usuarioId: string) => {
    try {
      // Meus documentos
      const { count: meusDocs } = await supabase
        .from('documento')
        .select('*', { count: 'exact', head: true })
        .eq('criado_por', usuarioId);

      // Documentos em rascunho
      const { count: rascunhos } = await supabase
        .from('documento')
        .select('*', { count: 'exact', head: true })
        .eq('criado_por', usuarioId)
        .eq('status', 'rascunho');

      // Documentos públicos
      const { count: publicos } = await supabase
        .from('documento')
        .select('*', { count: 'exact', head: true })
        .eq('visibilidade', 'publico');

      // Documentos compartilhados comigo
      const { count: compartilhados } = await supabase
        .from('documento_compartilhamento')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', usuarioId);

      setEstatisticas({
        meusDocumentos: meusDocs || 0,
        documentosRascunho: rascunhos || 0,
        documentosPublicos: publicos || 0,
        documentosCompartilhados: compartilhados || 0,
      });

      // Documentos recentes (meus)
      const { data: recentes } = await supabase
        .from('documento')
        .select(`
          id,
          titulo,
          descricao,
          status,
          created_at,
          tipo_documento(nome)
        `)
        .eq('criado_por', usuarioId)
        .order('created_at', { ascending: false })
        .limit(5);

      setDocumentosRecentes(recentes || []);

      // Documentos compartilhados recentemente
      const { data: docsCompartilhados } = await supabase
        .from('documento_compartilhamento')
        .select(`
          documento_id,
          permissao,
          created_at,
          documento:documento_id(
            id,
            titulo,
            descricao,
            status,
            criado_por,
            usuario:usuario!documento_criado_por_fkey(nome)
          )
        `)
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false })
        .limit(5);

      setDocumentosCompartilhados(docsCompartilhados || []);

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  console.log(userInfo)
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Bem-vindo, {userInfo.nome}! • {userInfo.cargo?.nome || 'Funcionário'}
            </p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Meus Documentos</h3>
                  <p className="text-2xl font-bold">{estatisticas.meusDocumentos}</p>
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
                  <p className="text-2xl font-bold">{estatisticas.documentosRascunho}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Compartilhados</h3>
                  <p className="text-2xl font-bold">{estatisticas.documentosCompartilhados}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Públicos</h3>
                  <p className="text-2xl font-bold">{estatisticas.documentosPublicos}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Conteúdo */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {documentosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {search || filtroStatus !== 'todos' || filtroTipo !== 'todos'
                        ? 'Tente ajustar seus filtros de busca'
                        : 'Comece criando seu primeiro documento'}
                    </p>
                    <a
                      href="/staff/documents/new"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Criar Primeiro Documento
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {documentosFiltrados.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                            <span className="text-xl">
                              {doc.tipo_documento?.icon || '📄'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900">{doc.titulo}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                  {getStatusText(doc.status)}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {getVisibilidadeIcon(doc.visibilidade)} {getVisibilidadeText(doc.visibilidade)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                  <span className="text-blue-600 text-xs font-medium">
                                    {doc.usuario?.nome?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span>{doc.usuario?.nome}</span>
                                {doc.usuario?.cargo_id?.nome && (
                                  <span className="ml-2 text-gray-500">• {doc.usuario.cargo_id.nome}</span>
                                )}
                              </div>
                              {doc.usuario?.departamento && (
                                <span className="text-gray-500">• {doc.usuario.departamento}</span>
                              )}
                              <span className="text-gray-500">
                                • {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>

                            {doc.descricao && (
                              <p className="mt-3 text-gray-600">{doc.descricao}</p>
                            )}

                            <div className="mt-3 flex items-center space-x-4">
                              <span className="text-sm text-gray-600">
                                {doc.tipo_documento_id?.nome}
                              </span>
                              {temArquivos(doc) && (
                                <span className="text-sm text-gray-500 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  {doc.documento_arquivo.length} arquivo(s)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => downloadFile(doc.id)}
                          disabled={baixando === doc.id}
                          className={`text-indigo-600 hover:text-indigo-900 text-sm flex items-center ${baixando === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}

                        >
                          {baixando === doc.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 mr-1"></div>
                              Baixando...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Baixar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/staff/documents/new"
                className="flex items-center p-6 bg-white rounded-lg shadow border hover:bg-gray-50"
              >
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Novo Documento</h3>
                  <p className="text-sm text-gray-600 mt-1">Crie um novo documento ou relatório</p>
                </div>
              </a>

              <a
                href="/staff/documents/publics"
                className="flex items-center p-6 bg-white rounded-lg shadow border hover:bg-gray-50"
              >
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Documentos Públicos</h3>
                  <p className="text-sm text-gray-600 mt-1">Acesse documentos compartilhados publicamente</p>
                </div>
              </a>

              <a
                href="/staff/profile"
                className="flex items-center p-6 bg-white rounded-lg shadow border hover:bg-gray-50"
              >
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Meu Perfil</h3>
                  <p className="text-sm text-gray-600 mt-1">Atualize suas informações e senha</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}