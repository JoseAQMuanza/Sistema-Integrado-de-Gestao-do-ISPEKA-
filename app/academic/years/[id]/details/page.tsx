'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, Calendar, CheckCircle, XCircle,
  Clock, Users, BookOpen, BarChart3, ChevronDown,
  MoreVertical, Eye, Printer, Download
} from 'lucide-react'

const yearData = {
  id: 1,
  ano: '2023/2024',
  codigo: 'AA-2023-2024',
  dataInicio: '2023-09-01',
  dataFim: '2024-07-31',
  descricao: 'Ano académico 2023/2024 com foco em qualidade e inovação',
  status: 'ativo',
  
  semestres: [
    { id: 1, numero: 1, nome: 'Primeiro Semestre', dataInicio: '2023-09-01', dataFim: '2024-01-31' },
    { id: 2, numero: 2, nome: 'Segundo Semestre', dataInicio: '2024-02-01', dataFim: '2024-07-31' }
  ],
  
  estatisticas: {
    cursosAtivos: 18,
    estudantesMatriculados: 2845,
    disciplinas: 256,
    docentes: 187,
    turmas: 142
  },
  
  feriados: [
    { data: '2023-12-25', descricao: 'Natal' },
    { data: '2024-01-01', descricao: 'Ano Novo' },
    { data: '2024-02-08', descricao: 'Carnaval' }
  ],
  
  criadoPor: 'Admin Sistema',
  dataCriacao: '2023-06-15',
  ultimaAtualizacao: '2024-01-15'
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Eye },
  { id: 'semesters', label: 'Semestres', icon: Calendar },
  { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
  { id: 'calendar', label: 'Calendário', icon: Calendar }
]

export default function AnoAcademicoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [year, setYear] = useState(yearData)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [params.id])

  const getStatusInfo = (status: string) => {
    const info = {
      ativo: { color: 'emerald', text: 'Ativo', icon: CheckCircle },
      encerrado: { color: 'gray', text: 'Encerrado', icon: XCircle },
      planejado: { color: 'blue', text: 'Planejado', icon: Clock }
    }
    return info[status as keyof typeof info] || info.encerrado
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setYear(prev => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const status = getStatusInfo(year.status)
  const Icon = status.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ano Acadêmico {year.ano}</h1>
            <p className="text-gray-600">Código: {year.codigo}</p>
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
          <Link href={`/academico/anos/${params.id}/editar`} className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 
                               status.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Status: {status.text}</h3>
              <p className="text-sm text-gray-600">
                {year.dataInicio 
                  ? `${new Date(year.dataInicio).toLocaleDateString('pt-AO')} - ${new Date(year.dataFim).toLocaleDateString('pt-AO')}`
                  : 'Período não definido'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}-100 text-${status.color}-800`}>
              {status.text}
            </span>
            
            <div className="relative">
              <select
                value={year.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="planejado">Planejado</option>
                <option value="ativo">Ativo</option>
                <option value="encerrado">Encerrado</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Cursos', value: year.estatisticas.cursosAtivos, icon: BookOpen, color: 'blue' },
          { label: 'Estudantes', value: year.estatisticas.estudantesMatriculados, icon: Users, color: 'emerald' },
          { label: 'Disciplinas', value: year.estatisticas.disciplinas, icon: BookOpen, color: 'violet' },
          { label: 'Docentes', value: year.estatisticas.docentes, icon: Users, color: 'amber' },
          { label: 'Turmas', value: year.estatisticas.turmas, icon: Users, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border rounded-xl p-4">
            <div className="flex items-center">
              <div className={`p-2 bg-${stat.color}-50 rounded-lg mr-3`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border">
        <div className="border-b">
          <nav className="flex overflow-x-auto -mb-px">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                    ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}
                  `}
                >
                  <TabIcon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h3>
                <p className="text-gray-700">{year.descricao}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Informações Gerais</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código:</span>
                      <span className="font-medium">{year.codigo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Período:</span>
                      <span className="font-medium">
                        {new Date(year.dataInicio).toLocaleDateString('pt-AO')} - {new Date(year.dataFim).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duração:</span>
                      <span className="font-medium">
                        {Math.round((new Date(year.dataFim).getTime() - new Date(year.dataInicio).getTime()) / (1000 * 3600 * 24))} dias
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Metadados</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Criado por:</span>
                      <span className="font-medium">{year.criadoPor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data criação:</span>
                      <span className="font-medium">
                        {new Date(year.dataCriacao).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="font-medium">
                        {new Date(year.ultimaAtualizacao).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Semesters */}
          {activeTab === 'semesters' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Semestres</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {year.semestres.map((sem) => (
                  <div key={sem.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="font-bold text-blue-600">{sem.numero}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{sem.nome}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(sem.dataInicio).toLocaleDateString('pt-AO')} - {new Date(sem.dataFim).toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {Math.round((new Date(sem.dataFim).getTime() - new Date(sem.dataInicio).getTime()) / (1000 * 3600 * 24))} dias
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disciplinas:</span>
                        <span className="font-medium">128</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avaliações:</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Férias:</span>
                        <span className="font-medium">15 dias</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          {activeTab === 'stats' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Estatísticas Detalhadas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(year.estatisticas).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-bold text-lg text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar */}
          {activeTab === 'calendar' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Calendário</h3>
              
              <div className="space-y-4">
                {year.feriados.map((feriado, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{feriado.descricao}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(feriado.data).toLocaleDateString('pt-AO', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                      Feriado
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href={`/academico/disciplinas?ano=${year.id}`}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Disciplinas</span>
            <p className="text-sm text-gray-600">{year.estatisticas.disciplinas} registradas</p>
          </div>
        </Link>

        <Link
          href={`/academico/turmas?ano=${year.id}`}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Turmas</span>
            <p className="text-sm text-gray-600">{year.estatisticas.turmas} turmas</p>
          </div>
        </Link>

        <Link
          href={`/academico/horarios?ano=${year.id}`}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3">
              <Calendar className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Horários</span>
            <p className="text-sm text-gray-600">Gerir horários</p>
          </div>
        </Link>

        <Link
          href={`/academico/relatorios?ano=${year.id}`}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Relatórios</span>
            <p className="text-sm text-gray-600">Estatísticas</p>
          </div>
        </Link>
      </div>
    </div>
  )
}