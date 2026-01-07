// app/documentos/novo/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function NovoDocumentoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [usuariosCompartilhamento, setUsuariosCompartilhamento] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data - REMOVIDO campo "conteudo"
  const [formData, setFormData] = useState({
    titulo: '',
    tipo_documento_id: '',
    descricao: '',
    status: 'rascunho',
    visibilidade: 'privado',
    departamento: '',
    tags: [] as string[],
  });

  // File state - agora será obrigatório pelo menos um arquivo
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: usuario } = await supabase
        .from('usuario')
        .select(`*, role(name), cargo_id(nome), departamento_id(nome)`)
        .eq('auth_user_id', user?.id)        
        .single(); 
      setUserInfo(usuario);

      // Carregar tipos de documento ativos
      const { data: tipos } = await supabase
        .from('tipo_documento')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      setTiposDocumento(tipos || []);

      // Carregar outros usuários para compartilhamento
      const { data: usuarios } = await supabase
        .from('usuario')
        .select(`
          id,
          nome,
          email,
          cargo_id(nome),
          departamento_id(nome)          
        `)
        .neq('auth_user_id', user?.id) // Excluir o próprio usuário
        .eq('ativo', true)
        .order('nome');
        
      setUsuariosCompartilhamento(usuarios || []);      

      // Setar departamento do usuário como padrão
      if (usuario?.departamento_id.nome) {
        setFormData(prev => ({ ...prev, departamento: usuario.departamento_id.nome }));
      }
    };

    loadData();
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFileError('');

    // Validar se há pelo menos um arquivo
    if (selectedFiles.length === 0) return;

    // Validar tamanho total (max 50MB)
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      setFileError('O tamanho total dos arquivos não pode exceder 50MB');
      return;
    }

    // Validar tipos de arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];

    const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setFileError(`Tipo de arquivo não permitido: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Adicionar novos arquivos
    setFiles(prev => [...prev, ...selectedFiles]);

    // Criar previews para imagens
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFileError('');
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.currentTarget.value = '';
      e.preventDefault();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos obrigatórios
      if (!formData.titulo.trim()) {
        throw new Error('O título é obrigatório');
      }

      if (!formData.tipo_documento_id) {
        throw new Error('Selecione um tipo de documento');
      }

      // Validar que há pelo menos um arquivo
      if (files.length === 0) {
        throw new Error('É necessário fazer upload de pelo menos um arquivo');
      }

      // 1. Criar o documento (SEM conteúdo - apenas metadados)
      const { data: documento, error: docError } = await supabase
        .from('documento')
        .insert({
          titulo: formData.titulo,
          descricao: formData.descricao || null,
          tipo_documento_id: formData.tipo_documento_id,
          status: formData.status,
          visibilidade: formData.visibilidade,
          departamento: formData.departamento,
          criado_por: userInfo.id,
          tem_arquivo: true, // Marcar que este documento tem arquivos anexados          
        })
        .select()
        .single();

      if (docError) throw docError;

      console.log('✅ Documento criado:', documento.id);

      // 2. Upload dos arquivos (OBRIGATÓRIO - estes são os arquivos que serão baixados)
      const uploadedFiles = [];
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${documento.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `documentos/${fileName}`;

        // Upload para storage - ESTE É O ARQUIVO REAL QUE SERÁ BAIXADO
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sgid_ispeka_files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro no upload do arquivo:', uploadError);
          throw new Error(`Falha ao fazer upload do arquivo ${file.name}: ${uploadError.message}`);
        }

        // Inserir registro na tabela documento_arquivo - IMPORTANTE: aqui salvamos o caminho do arquivo real
        const { error: dbError } = await supabase
          .from('documento_arquivo')
          .insert({
            documento_id: documento.id,
            path: filePath,
            nome_original: file.name,
            mime_type: file.type,
            tamanho: file.size,
            versao: 1,                        
          });

        if (dbError) {
          console.error('Erro ao salvar metadados do arquivo:', dbError);
          throw new Error(`Falha ao salvar metadados do arquivo ${file.name}`);
        }

        uploadedFiles.push({
          nome: file.name,
          caminho: filePath,
          tamanho: file.size
        });
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setUploading(false);

      // 3. Compartilhamento com outros usuários
      if (selectedUsers.length > 0) {
        const compartilhamentos = selectedUsers.map(usuario_id => ({
          documento_id: documento.id,
          usuario_id: usuario_id,
          permissao: 'leitura',
          compartilhado_por: userInfo.id,
          data_compartilhamento: new Date().toISOString(),
        }));

        const { error: shareError } = await supabase
          .from('documento_compartilhamento')
          .insert(compartilhamentos);
      }

      // 4. Adicionar tags (se houver)
      if (formData.tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('documento')
          .update({ tags: formData.tags })
          .eq('id', documento.id);

        if (tagsError) {
          console.error('Erro ao salvar tags:', tagsError);
          // Não interrompemos o processo por erro nas tags
        }
      }

      // Sucesso!
      const mensagemSucesso = `Documento "${formData.titulo}" criado com sucesso!\n\n` +
        `Arquivos enviados (${uploadedFiles.length}):\n` +
        uploadedFiles.map(f => `• ${f.nome} (${(f.tamanho / 1024 / 1024).toFixed(2)} MB)`).join('\n')        

      alert(mensagemSucesso);

      // Redirecionar para a lista de documentos
      router.push('/admin/documents');

    } catch (error: any) {
      console.error('❌ Erro ao criar documento:', error);
      alert(`Erro ao criar documento: ${error.message}`);
      setLoading(false);
      setUploading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📃';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo?.role?.name} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Documento</h1>
                <p className="text-gray-600">Faça upload dos arquivos do seu computador</p>
              </div>
              <button
                onClick={() => router.push('/admin/documents')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informações Básicas */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Documento</h2>

                  <div className="space-y-4">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título do Documento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Digite o título do documento"
                      />
                    </div>

                    {/* Tipo de Documento e Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Documento *
                        </label>
                        <select
                          required
                          value={formData.tipo_documento_id}
                          onChange={(e) => setFormData({ ...formData, tipo_documento_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        >
                          <option value="">Selecione um tipo...</option>
                          {tiposDocumento.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status *
                        </label>
                        <select
                          required
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        >
                          <option value="rascunho">📝 Rascunho</option>
                          <option value="revisao">🔍 Em Revisão</option>
                          <option value="finalizado">✅ Finalizado</option>
                          <option value="arquivado">🗄️ Arquivado</option>
                        </select>
                      </div>
                    </div>

                    {/* Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição (opcional)
                      </label>
                      <textarea
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Descreva o conteúdo ou objetivo deste documento..."
                      />
                    </div>
                  </div>
                </div>

                {/* Upload de Arquivos - Seção PRINCIPAL */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Upload de Arquivos *</h2>
                    <span className="text-sm text-gray-500">
                      {files.length} arquivo(s) selecionado(s)
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Faça upload dos arquivos do seu computador. Estes arquivos serão armazenados e poderão ser baixados posteriormente.
                  </p>

                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Clique para selecionar arquivos ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos permitidos: PDF, Word, Excel, PowerPoint, Imagens, Texto
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tamanho máximo: 50MB (total)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.txt"
                      />
                    </div>

                    {fileError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                        ⚠️ {fileError}
                      </div>
                    )}

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Enviando arquivos para o servidor...</span>
                          <span className="font-medium">{uploadProgress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Files List */}
                    {files.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          Arquivos prontos para upload ({files.length}):
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center min-w-0">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="text-orange-600 text-sm">
                                    {getFileIcon(file.type)}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>{formatFileSize(file.size)}</span>
                                    <span>•</span>
                                    <span>{file.type.split('/')[1]?.toUpperCase() || 'ARQUIVO'}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Remover arquivo"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Previews */}
                    {previews.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Pré-visualização de imagens:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {previews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-all"
                                  title="Remover imagem"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna Lateral */}
              <div className="lg:col-span-1 space-y-6">
                {/* Configurações */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h2>

                  <div className="space-y-4">
                    {/* Visibilidade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibilidade do Documento
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="visibilidade"
                            value="privado"
                            checked={formData.visibilidade === 'privado'}
                            onChange={(e) => setFormData({ ...formData, visibilidade: e.target.value })}
                            className="h-4 w-4 text-orange-600"
                          />
                          <div className="ml-2">
                            <span className="text-sm font-medium">👤 Privado</span>
                            <p className="text-xs text-gray-500">Apenas você pode ver</p>
                          </div>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="visibilidade"
                            value="departamento"
                            checked={formData.visibilidade === 'departamento'}
                            onChange={(e) => setFormData({ ...formData, visibilidade: e.target.value })}
                            className="h-4 w-4 text-orange-600"
                          />
                          <div className="ml-2">
                            <span className="text-sm font-medium">🏢 Departamento</span>
                            <p className="text-xs text-gray-500">
                              {userInfo?.departamento || 'Seu departamento'}
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="visibilidade"
                            value="publico"
                            checked={formData.visibilidade === 'publico'}
                            onChange={(e) => setFormData({ ...formData, visibilidade: e.target.value })}
                            className="h-4 w-4 text-orange-600"
                          />
                          <div className="ml-2">
                            <span className="text-sm font-medium">🌐 Público</span>
                            <p className="text-xs text-gray-500">Todos os usuários</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (opcional)
                      </label>
                      <div className="mb-2">
                        <input
                          type="text"
                          onKeyDown={handleTagInput}
                          placeholder="Digite e pressione Enter para adicionar tag"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use tags para organizar seus documentos
                        </p>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-orange-600 hover:text-orange-800"
                                title="Remover tag"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>                                      
                  </div>
                </div>

                {/* Informações do Criador */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Criador</h2>

                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 text-lg font-bold">
                        {userInfo?.nome?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{userInfo?.nome || 'Usuário'}</p>
                      <p className="text-sm text-gray-600">{userInfo?.cargo_id?.nome || 'Cargo não definido'}</p>
                      <p className="text-xs text-gray-500">
                        Departamento: {userInfo?.departamento_id.nome || 'Não definido'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão de Envio */}
                <div className="sticky top-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Arquivos para upload:</span>
                        <span className={`font-medium ${files.length === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {files.length} {files.length === 0 ? '(obrigatório)' : '(pronto)'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tamanho total:</span>
                        <span className="font-medium">
                          {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compartilhado com:</span>
                        <span className="font-medium">{selectedUsers.length} usuário(s)</span>
                      </div>
                      <div className="pt-4 border-t">
                        <button
                          type="submit"
                          disabled={loading || uploading || files.length === 0}
                          className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-medium"
                        >
                          {loading || uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              {uploading ? 'Enviando arquivos...' : 'Criando documento...'}
                            </>
                          ) : (
                            'Criar Documento com Arquivos'
                          )}
                        </button>

                        <p className="mt-2 text-xs text-center text-gray-500">
                          * Os arquivos selecionados serão armazenados e poderão ser baixados
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}