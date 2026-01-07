// app/documentos/publicos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function DocumentosPublicosPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [baixando, setBaixando] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: usuario } = await supabase
        .from('usuario')
        .select('id, nome, role_id(name)')
        .eq('auth_user_id', user?.id)
        .single();
        
        console.log(usuario)
      setUserInfo(usuario);
      await carregarDocumentos();

      // Carregar tipos de documento
      const { data: tipos } = await supabase
        .from('tipo_documento')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
        console.log(tipos)
      setTiposDocumento(tipos || []);
    };

    loadData();
  }, [router]);

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

  const carregarDocumentos = async () => {
    try {
      // Buscar documentos públicos ou do mesmo departamento
      const { data: docs } = await supabase
        .from('documento')
        .select(`
          *,
          tipo_documento_id(nome),
          usuario:usuario!documento_criado_por_fkey(nome, cargo_id(nome), departamento_id(nome)),
          documento_arquivo_id(id, nome_original)
        `)
        .or('visibilidade.eq.publico,visibilidade.eq.departamento')
        .order('created_at', { ascending: false });

      setDocumentos(docs || []);

      console.log(docs, "docum")
      // Extrair departamentos únicos
      const depts = [...new Set(docs?.map(d => d.usuario?.departamento_id?.nome).filter(Boolean))] as string[];
      setDepartamentos(depts);
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
        doc.descricao?.toLowerCase().includes(search.toLowerCase()) ||
        doc.usuario?.nome.toLowerCase().includes(search.toLowerCase());

      const matchesTipo = filtroTipo === 'todos' || doc.tipo_documento_id === filtroTipo;

      const matchesDepartamento = filtroDepartamento === 'todos' ||
        doc.usuario?.departamento === filtroDepartamento;

      // Verificar se usuário tem acesso ao documento do departamento
      const temAcessoDepartamento = doc.visibilidade !== 'departamento' ||
        (userInfo?.departamento_id && doc.usuario?.departamento_id === userInfo.departamento_id);

      return matchesSearch && matchesTipo && matchesDepartamento && temAcessoDepartamento;
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

  if (!userInfo || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo.role_id?.name} />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Documentos Públicos</h1>
            <p className="text-gray-600">
              Documentos compartilhados publicamente ou do seu departamento
              {userInfo.departamento_id && ` (Seu departamento: ${userInfo.departamento_id})`}
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou autor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  value={filtroDepartamento}
                  onChange={(e) => setFiltroDepartamento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="todos">Todos departamentos</option>
                  {departamentos.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Documentos */}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {search || filtroTipo !== 'todos' || filtroDepartamento !== 'todos'
                        ? 'Tente ajustar seus filtros de busca'
                        : 'Não há documentos públicos disponíveis no momento'}
                    </p>
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

          {/* Estatísticas */}
          {documentos.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Documentos</p>
                  <p className="text-xl font-bold">{documentos.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Públicos</p>
                  <p className="text-xl font-bold">
                    {documentos.filter(d => d.visibilidade === 'publico').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Por Departamento</p>
                  <p className="text-xl font-bold">
                    {documentos.filter(d => d.visibilidade === 'departamento').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Autores Diferentes</p>
                  <p className="text-xl font-bold">
                    {new Set(documentos.map(d => d.usuario?.id)).size}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


