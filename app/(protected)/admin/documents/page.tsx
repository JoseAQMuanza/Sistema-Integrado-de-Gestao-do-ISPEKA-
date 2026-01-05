// app/admin/documents/page.tsx (ATUALIZADO)
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function TodosDocumentosPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [arquivosPorDocumento, setArquivosPorDocumento] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [baixando, setBaixando] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: usuario } = await supabase
        .from('usuario')
        .select('role(name)')
        .eq('auth_user_id', user?.id)
        .single();
      setUserInfo(usuario);

      // Carregar documentos
      const { data: docs } = await supabase
        .from('documento')
        .select(`
          *          
        `)
        .order('created_at', { ascending: false });

      setDocumentos(docs || []);

      // Carregar arquivos para cada documento
      if (docs && docs.length > 0) {
        const arquivosMap: Record<string, any[]> = {};

        for (const doc of docs) {
          const { data: arquivos } = await supabase
            .from('documento_arquivo')
            .select('*')
            .eq('documento_id', doc.id)
            .order('created_at', { ascending: false });

          arquivosMap[doc.id] = arquivos || [];
        }

        setArquivosPorDocumento(arquivosMap);
      }

      // Carregar tipos de documento
      const { data: tipos } = await supabase
        .from('tipo_documento')
        .select('*')
        .order('nome');

      setTiposDocumento(tipos || []);
      setLoading(false);
    };

    loadData();
  }, [router]);

  // Função para baixar arquivo
  const baixarArquivo = async (documentoId: string) => {
    try {
      setBaixando(documentoId);

      const arquivos = arquivosPorDocumento[documentoId];

      if (!arquivos || arquivos.length === 0) {
        const documento = documentos.find(d => d.id === documentoId);

        // Criar um PDF com o conteúdo do documento
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        // Adicionar título
        doc.setFontSize(16);
        doc.text(`📄 ${documento.titulo}`, 20, 20);

        // Adicionar informações
        doc.setFontSize(12);
        doc.text(`Tipo: ${documento.tipo_documento?.nome || 'Não especificado'}`, 20, 35);
        doc.text(`Status: ${getStatusText(documento.status)}`, 20, 42);
        doc.text(`Autor: ${documento.criador?.nome || 'Desconhecido'}`, 20, 49);
        doc.text(`Data: ${new Date(documento.created_at).toLocaleDateString('pt-BR')}`, 20, 56);

        // Adicionar descrição se existir
        if (documento.descricao) {
          doc.text('Descrição:', 20, 70);
          const descricaoLines = doc.splitTextToSize(documento.descricao, 170);
          doc.text(descricaoLines, 20, 78);
        }

        // Adicionar conteúdo se existir
        if (documento.conteudo) {
          // Remover tags HTML para texto simples
          const texto = documento.conteudo.replace(/<[^>]*>/g, '');
          if (texto.trim()) {
            const yPos = documento.descricao ? 90 : 78;
            doc.text('Conteúdo:', 20, yPos);
            const conteudoLines = doc.splitTextToSize(texto, 170);
            doc.text(conteudoLines, 20, yPos + 8);
          }
        }

        // Salvar PDF
        doc.save(`${documento.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        alert('Documento baixado como PDF!');

      } else {
        // Baixar o primeiro arquivo (ou todos se múltiplos)
        if (arquivos.length === 1) {

        }
      }
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      alert('Erro ao baixar o arquivo');
    } finally {
      setBaixando(null);
    }
  };

  // Função para baixar arquivo
  // Versão básica que corrige problemas comuns de path
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

// Função para forçar download com URL
const forceDownload = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função alternativa usando fetch
const downloadFileAlt = async (documentoId: string) => {
  try {
    // Buscar arquivo
    const { data: arquivo, error } = await supabase
      .from('documento_arquivo')
      .select('path, nome_original')
      .eq('documento_id', documentoId)
      .single();

    if (error) throw error;

    // Obter URL assinada
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('sgid_ispeka_files')
      .createSignedUrl(arquivo.path, 60);

    if (urlError) throw urlError;

    // Usar fetch para baixar
    const response = await fetch(signedUrl.signedUrl);
    if (!response.ok) throw new Error('Falha no fetch');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = arquivo.nome_original;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error: any) {
    console.error('Erro:', error);
    alert(`Falha: ${error.message}`);
  }
};





  // Função para visualizar documento
  const visualizarDocumento = (documentoId: string) => {
    router.push(`/documents/${documentoId}`);
  };

  // Função para editar documento
  const editarDocumento = (documentoId: string) => {
    router.push(`/documents/${documentoId}/editar`);
  };

  const filtrarDocumentos = () => {
    return documentos.filter(doc => {
      const matchesSearch =
        doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
        doc.descricao?.toLowerCase().includes(search.toLowerCase()) ||
        doc.criador?.nome.toLowerCase().includes(search.toLowerCase());

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

      <div className="flex-1 p-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Todos os Documentos</h1>
            <p className="text-gray-600">Gerencie todos os documentos do sistema</p>
          </div>

          {/* Filtros e Estatísticas */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Título, descrição ou autor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="todos">Todos os status</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="revisao">Em Revisão</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="todos">Todos os tipos</option>
                  {tiposDocumento.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => router.push('documents/new')}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Novo Documento
                </button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Documentos</p>
                <p className="text-2xl font-bold">{documentos.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Com Arquivos</p>
                <p className="text-2xl font-bold">
                  {Object.values(arquivosPorDocumento).filter(arr => arr.length > 0).length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Finalizados</p>
                <p className="text-2xl font-bold">
                  {documentos.filter(d => d.status === 'finalizado').length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Arquivos Totais</p>
                <p className="text-2xl font-bold">
                  {Object.values(arquivosPorDocumento).reduce((acc, arr) => acc + arr.length, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Documentos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : documentosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search ? 'Tente outra busca' : 'Comece criando um novo documento'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Autor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arquivos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documentosFiltrados.map((doc) => {
                      const arquivos = arquivosPorDocumento[doc.id] || [];
                      const temArquivos = arquivos.length > 0;

                      return (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{doc.titulo}</div>
                              {doc.descricao && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {doc.descricao}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 text-xs">
                                  {doc.tipo_documento?.nome?.charAt(0) || 'D'}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm text-gray-900">
                                  {doc.tipo_documento?.nome || 'Não especificado'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{doc.criador?.nome}</div>
                            <div className="text-sm text-gray-500">{doc.criador?.cargo?.nome}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {temArquivos ? (
                                <>
                                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 text-xs">
                                      {arquivos.length}
                                    </span>
                                  </div>
                                  <div className="ml-2">
                                    <div className="text-sm text-gray-900">
                                      {arquivos.length} arquivo(s)
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {arquivos[0]?.nome_original}
                                      {arquivos.length > 1 && ` +${arquivos.length - 1} mais`}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">Sem arquivos</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                              {getStatusText(doc.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {/* Botão VER - Agora baixa o arquivo */}
                              <button
                                onClick={() => downloadFile(doc.id)}
                                disabled={baixando === doc.id}
                                className={`text-indigo-600 hover:text-indigo-900 text-sm flex items-center ${baixando === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                title={temArquivos ? "Baixar arquivo(s)" : "Baixar como PDF"}
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

                              {/* Botão VISUALIZAR (para ver detalhes) */}
                              <button
                                onClick={() => visualizarDocumento(doc.id)}
                                className="text-blue-600 hover:text-blue-900 text-sm"
                                title="Visualizar detalhes"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>

                              {/* Botão EDITAR */}
                              <button
                                onClick={() => editarDocumento(doc.id)}
                                className="text-gray-600 hover:text-gray-900 text-sm"
                                title="Editar documento"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>

                              {/* Botão EXCLUIR (apenas admin) */}
                              <button
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir o documento "${doc.titulo}"?`)) {
                                    // Implementar exclusão
                                    alert('Funcionalidade de exclusão a ser implementada');
                                  }
                                }}
                                className="text-red-600 hover:text-red-900 text-sm"
                                title="Excluir documento"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Instruções de download */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Como funciona o download</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Baixar</strong> (ícone ↓): Baixa os arquivos anexados ou gera PDF do conteúdo</li>
                    <li><strong>Visualizar</strong> (ícone 👁️): Abre a página de detalhes do documento</li>
                    <li>Se houver múltiplos arquivos, você poderá escolher qual baixar</li>
                    <li>Documentos sem arquivos serão convertidos para PDF automaticamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}