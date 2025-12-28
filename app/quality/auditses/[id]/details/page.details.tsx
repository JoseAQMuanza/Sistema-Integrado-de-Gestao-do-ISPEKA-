'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, Download, Printer, Share2, Eye,
  Calendar, Users, Building2, FileText, CheckCircle,
  AlertCircle, Clock, Target, BarChart3, MessageSquare,
  MapPin, Mail, Phone, ChevronDown, MoreVertical,
  CheckSquare, XSquare, Plus, Upload, Trash2,
  Save
} from 'lucide-react'

// Dados mockados da auditoria
const auditData = {
  id: 1,
  codigo: 'AUD-2024-001',
  titulo: 'Auditoria Interna - Departamento de Engenharia',
  tipo: 'Interna',
  descricao: 'Auditoria interna para verificar conformidade com normas de qualidade e processos acadêmicos.',
  departamento: {
    id: '2',
    nome: 'Engenharia',
    codigo: 'ENG',
    chefe: 'Prof. Dr. António Costa'
  },
  
  // Agendamento
  dataProgramada: '2024-02-15',
  horaInicio: '09:00',
  horaFim: '17:00',
  local: 'Sala de Reuniões - Bloco C',
  
  // Âmbito
  ambito: 'Processos acadêmicos, gestão de qualidade, infraestrutura de laboratórios',
  normas: ['ISO 9001:2015', 'Normas Internas ISPEKA'],
  criterios: 'Conformidade com procedimentos, eficácia dos processos, satisfação dos estudantes',
  
  // Equipe
  auditores: [
    { id: 'A1', nome: 'Dr. João Silva', papel: 'Líder', departamento: 'CSH' },
    { id: 'A2', nome: 'Dra. Maria Santos', papel: 'Auditor', departamento: 'ENG' }
  ],
  observadores: [
    { nome: 'Prof. Carlos Mendes', departamento: 'SAU' }
  ],
  
  // Contato
  contatoDepartamento: 'Eng. Ana Pereira',
  emailContato: 'ana.pereira@ispeka.edu.ao',
  telefoneContato: '+244 923 456 789',
  
  // Status
  status: 'em_andamento',
  prioridade: 'alta',
  progresso: 60,
  
  // Documentos
  documentosNecessarios: [
    'Manual de Procedimentos',
    'Registros de Aulas',
    'Relatórios de Laboratório'
  ],
  documentosAnexados: [
    { nome: 'Checklist Pré-Auditoria.pdf', tipo: 'Checklist', data: '2024-01-20', tamanho: '2.1 MB' },
    { nome: 'Plano de Auditoria.doc', tipo: 'Plano', data: '2024-01-18', tamanho: '1.5 MB' }
  ],
  
  // Achados
  achados: [
    { id: 1, tipo: 'nconformidade', descricao: 'Falta de registro em atas de reunião', status: 'aberto', gravidade: 'menor' },
    { id: 2, tipo: 'observacao', descricao: 'Boa organização dos laboratórios', status: 'fechado', gravidade: null },
    { id: 3, tipo: 'melhoria', descricao: 'Sugestão para digitalização de processos', status: 'em_andamento', gravidade: null }
  ],
  
  // Histórico
  dataCriacao: '2024-01-10',
  dataInicio: '2024-02-15',
  ultimaAtualizacao: '2024-02-15',
  criadoPor: 'Sistema de Qualidade'
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Eye },
  { id: 'team', label: 'Equipe', icon: Users },
  { id: 'scope', label: 'Âmbito', icon: Target },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'findings', label: 'Achados', icon: CheckSquare },
  { id: 'timeline', label: 'Cronograma', icon: Calendar },
]

const statusColors = {
  planejada: 'bg-blue-100 text-blue-800',
  em_andamento: 'bg-amber-100 text-amber-800',
  concluida: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-800'
}

const priorityColors = {
  alta: 'bg-red-100 text-red-800',
  media: 'bg-amber-100 text-amber-800',
  baixa: 'bg-blue-100 text-blue-800'
}

const findingTypeColors = {
  nconformidade: 'bg-red-100 text-red-800',
  observacao: 'bg-blue-100 text-blue-800',
  melhoria: 'bg-emerald-100 text-emerald-800'
}

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [audit, setAudit] = useState(auditData)
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState(false)
  const [showAddFinding, setShowAddFinding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simulação de carregamento
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [params.id])

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      planejada: 'Planejada',
      em_andamento: 'Em Andamento',
      concluida: 'Concluída',
      cancelada: 'Cancelada'
    }
    return texts[status] || status
  }

  const getPriorityText = (priority: string) => {
    const texts: Record<string, string> = {
      alta: 'Alta',
      media: 'Média',
      baixa: 'Baixa'
    }
    return texts[priority] || priority
  }

  const getFindingTypeText = (type: string) => {
    const texts: Record<string, string> = {
      nconformidade: 'Não Conformidade',
      observacao: 'Observação',
      melhoria: 'Oportunidade de Melhoria'
    }
    return texts[type] || type
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setAudit(prev => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando auditoria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{audit.titulo}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className="font-mono text-gray-600">{audit.codigo}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[audit.status as keyof typeof statusColors]}`}>
                {getStatusText(audit.status)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <Link
            href={`/qualidade/auditorias/${params.id}/editar`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Auditoria
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                    <Share2 className="w-4 h-4 mr-3" />
                    Compartilhar
                  </button>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Comentários
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-3" />
                    Cancelar Auditoria
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${statusColors[audit.status as keyof typeof statusColors]}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Status da Auditoria</h3>
                <p className="text-sm text-gray-600">
                  {audit.status === 'planejada' && 'Auditoria planejada e agendada'}
                  {audit.status === 'em_andamento' && 'Auditoria em execução'}
                  {audit.status === 'concluida' && 'Auditoria concluída com sucesso'}
                  {audit.status === 'cancelada' && 'Auditoria cancelada'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${priorityColors[audit.prioridade as keyof typeof priorityColors]}`}>
                Prioridade {getPriorityText(audit.prioridade)}
              </span>
              
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {audit.tipo}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-3">
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Progresso</span>
                  <span className="text-xs font-medium">{audit.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${audit.progresso}%` }}
                  />
                </div>
              </div>
              
              {/* Status Actions */}
              <div className="relative">
                <select
                  value={audit.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="planejada">Planejada</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da Esquerda - Informações Rápidas */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card Informações */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Informações da Auditoria</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Código</span>
                <p className="font-medium text-gray-900">{audit.codigo}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Tipo</span>
                <p className="font-medium text-gray-900">{audit.tipo}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Departamento</span>
                <div className="flex items-center mt-1">
                  <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">{audit.departamento.nome}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Chefe do Departamento</span>
                <p className="font-medium text-gray-900">{audit.departamento.chefe}</p>
              </div>
            </div>
          </div>

          {/* Card Data e Hora */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Agendamento
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Data</span>
                <p className="font-medium text-gray-900">
                  {new Date(audit.dataProgramada).toLocaleDateString('pt-AO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-gray-500">Início</span>
                  <p className="font-medium text-gray-900">{audit.horaInicio}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Término</span>
                  <p className="font-medium text-gray-900">{audit.horaFim}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Local</span>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">{audit.local}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Contato */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Contato</h3>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 text-gray-400 mr-3" />
                <span>{audit.contatoDepartamento}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <a href={`mailto:${audit.emailContato}`} className="text-blue-600 hover:text-blue-800">
                  {audit.emailContato}
                </a>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <a href={`tel:${audit.telefoneContato}`} className="text-blue-600 hover:text-blue-800">
                  {audit.telefoneContato}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowAddFinding(true)}
                className="w-full btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Achado
              </button>
              
              <Link
                href={`/qualidade/auditorias/${params.id}/relatorio`}
                className="w-full btn-primary"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Link>
              
              <button className="w-full btn-secondary">
                <Upload className="w-4 h-4 mr-2" />
                Anexar Documento
              </button>
            </div>
          </div>
        </div>

        {/* Coluna da Direita - Conteúdo Principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                        ${isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Visão Geral */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h3>
                    <p className="text-gray-700">{audit.descricao}</p>
                  </div>

                  {/* Estatísticas Rápidas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Equipe</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{audit.auditores.length}</p>
                      <p className="text-xs text-gray-500">Auditores</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Documentos</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{audit.documentosAnexados.length}</p>
                      <p className="text-xs text-gray-500">Anexados</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckSquare className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Achados</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{audit.achados.length}</p>
                      <p className="text-xs text-gray-500">Registrados</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Não Conform.</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {audit.achados.filter(a => a.tipo === 'nconformidade').length}
                      </p>
                      <p className="text-xs text-gray-500">Identificadas</p>
                    </div>
                  </div>

                  {/* Âmbito Resumido */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Âmbito da Auditoria</h3>
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                      <p className="text-gray-700">{audit.ambito}</p>
                    </div>
                  </div>

                  {/* Normas Aplicáveis */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Normas Aplicáveis</h3>
                    <div className="flex flex-wrap gap-2">
                      {audit.normas.map((norma, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {norma}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Equipe */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Equipe de Auditoria</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {audit.auditores.map((auditor) => (
                        <div key={auditor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <Users className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{auditor.nome}</h4>
                                <p className="text-sm text-gray-600">{auditor.papel}</p>
                                <div className="flex items-center mt-1">
                                  <Building2 className="w-3 h-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{auditor.departamento}</span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              auditor.papel === 'Líder' 
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {auditor.papel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observadores */}
                  {audit.observadores.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Observadores</h4>
                      <div className="space-y-3">
                        {audit.observadores.map((obs, index) => (
                          <div key={index} className="flex items-center p-3 border rounded-lg">
                            <Users className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{obs.nome}</p>
                              <p className="text-sm text-gray-600">{obs.departamento}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Âmbito */}
              {activeTab === 'scope' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Âmbito Detalhado</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-700">{audit.ambito}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Critérios de Auditoria</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-700">{audit.criterios}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Processos a Serem Auditados</h3>
                    <div className="space-y-3">
                      {[
                        'Gestão Acadêmica',
                        'Processos de Ensino',
                        'Gestão de Laboratórios',
                        'Avaliação de Desempenho',
                        'Documentação e Registros'
                      ].map((processo, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                          <span className="text-gray-700">{processo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Documentos */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Documentos da Auditoria</h3>
                    <button className="btn-primary">
                      <Upload className="w-4 h-4 mr-2" />
                      Anexar Documento
                    </button>
                  </div>

                  {/* Documentos Necessários */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Documentos Necessários</h4>
                    <div className="space-y-3">
                      {audit.documentosNecessarios.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-gray-900">{doc}</span>
                          </div>
                          <span className="text-sm text-gray-500">Pendente</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documentos Anexados */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Documentos Anexados</h4>
                    {audit.documentosAnexados.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhum documento anexado</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {audit.documentosAnexados.map((doc, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-2">{doc.nome}</h4>
                            
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{doc.tipo}</span>
                              <span>{doc.tamanho}</span>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(doc.data).toLocaleDateString('pt-AO')}
                              </span>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Achados */}
              {activeTab === 'findings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Achados da Auditoria</h3>
                    <button
                      onClick={() => setShowAddFinding(true)}
                      className="btn-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Achado
                    </button>
                  </div>

                  {/* Filtros de Achados */}
                  <div className="flex items-center space-x-3">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                      Todos
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      Não Conformidades
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      Observações
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      Melhorias
                    </button>
                  </div>

                  {/* Lista de Achados */}
                  <div className="space-y-4">
                    {audit.achados.map((finding) => (
                      <div key={finding.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${
                                findingTypeColors[finding.tipo as keyof typeof findingTypeColors]
                              }`}>
                                {getFindingTypeText(finding.tipo)}
                              </span>
                              {finding.gravidade && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  {finding.gravidade === 'menor' ? 'Menor' : 'Maior'}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900">{finding.descricao}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              finding.status === 'aberto' 
                                ? 'bg-red-100 text-red-800'
                                : finding.status === 'em_andamento'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {finding.status === 'aberto' ? 'Aberto' :
                               finding.status === 'em_andamento' ? 'Em Andamento' : 'Fechado'}
                            </span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Registrado em {new Date().toLocaleDateString('pt-AO')}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Ver detalhes →
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {audit.achados.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhum achado registrado</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Adicione achados durante a execução da auditoria
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cronograma */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Cronograma e Atividades</h3>
                  
                  <div className="relative">
                    {/* Timeline */}
                    <div className="space-y-8">
                      {[
                        { 
                          step: 'Planejamento',
                          date: '10 Jan 2024',
                          status: 'completed',
                          description: 'Definição do âmbito e equipe'
                        },
                        { 
                          step: 'Reunião de Abertura',
                          date: '15 Jan 2024',
                          status: 'completed',
                          description: 'Apresentação do plano de auditoria'
                        },
                        { 
                          step: 'Execução',
                          date: '15 Fev 2024',
                          status: 'current',
                          description: 'Coleta de evidências e entrevistas'
                        },
                        { 
                          step: 'Reunião de Encerramento',
                          date: '16 Fev 2024',
                          status: 'pending',
                          description: 'Apresentação dos achados'
                        },
                        { 
                          step: 'Relatório Final',
                          date: '20 Fev 2024',
                          status: 'pending',
                          description: 'Emissão do relatório oficial'
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-600'
                                : item.status === 'current'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {item.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span className="font-semibold">{index + 1}</span>
                              )}
                            </div>
                            {index < 4 && (
                              <div className={`w-0.5 h-full ${
                                item.status === 'completed' ? 'bg-emerald-200' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                          
                          <div className={`flex-1 pb-8 ${index < 4 ? 'border-b border-gray-200' : ''}`}>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{item.step}</h4>
                              <span className="text-sm text-gray-500">{item.date}</span>
                            </div>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Achado */}
      {showAddFinding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Adicionar Achado</h3>
              <button
                onClick={() => setShowAddFinding(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <XSquare className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Achado
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                    Não Conformidade
                  </button>
                  <button className="p-3 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg">
                    Observação
                  </button>
                  <button className="p-3 border border-emerald-300 bg-emerald-50 text-emerald-700 rounded-lg">
                    Melhoria
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  className="w-full input-field"
                  placeholder="Descreva o achado em detalhes..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processo Envolvido
                  </label>
                  <select className="w-full input-field">
                    <option>Selecione o processo</option>
                    <option>Gestão Acadêmica</option>
                    <option>Processos de Ensino</option>
                    <option>Laboratórios</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gravidade
                  </label>
                  <select className="w-full input-field">
                    <option>Selecione</option>
                    <option>Menor</option>
                    <option>Maior</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidência (opcional)
                </label>
                <input
                  type="file"
                  className="w-full input-field"
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddFinding(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Salvar Achado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}