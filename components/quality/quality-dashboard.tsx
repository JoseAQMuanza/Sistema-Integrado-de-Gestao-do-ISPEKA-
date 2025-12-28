// components/quality/QualityDashboard.tsx
'use client'

import {
  BarChart3,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Download
} from 'lucide-react'

const indicators = [
  {
    id: 1,
    nome: 'Taxa de Aprovação',
    curso: 'Engenharia Informática',
    valor: 78,
    meta: 80,
    status: 'warning',
    tendencia: 'up'
  },
  {
    id: 2,
    nome: 'Satisfação dos Estudantes',
    curso: 'Direito',
    valor: 85,
    meta: 75,
    status: 'good',
    tendencia: 'up'
  },
  {
    id: 3,
    nome: 'Retenção de Estudantes',
    curso: 'Enfermagem',
    valor: 92,
    meta: 90,
    status: 'good',
    tendencia: 'stable'
  },
  {
    id: 4,
    nome: 'Publicações Científicas',
    curso: 'Todos',
    valor: 45,
    meta: 60,
    status: 'bad',
    tendencia: 'down'
  }
]

const nonConformities = [
  {
    id: 1,
    descricao: 'Falta de laboratórios adequados para Engenharia',
    curso: 'Engenharia Civil',
    data: '2024-01-15',
    status: 'open',
    prazo: '2024-03-15'
  },
  {
    id: 2,
    descricao: 'Biblioteca com acervo desatualizado',
    departamento: 'Ciências Sociais',
    data: '2024-01-10',
    status: 'in_progress',
    prazo: '2024-02-28'
  }
]

export default function QualityDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Qualidade</h1>
            <p className="text-gray-600">Monitoramento e avaliação contínua</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-5 h-5 mr-2" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Quality Indicators */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Indicadores de Qualidade</h2>
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
            <option>Último Semestre</option>
            <option>Ano Académico 2023</option>
            <option>Ano Académico 2022</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indicators.map(indicator => (
            <div key={indicator.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  indicator.status === 'good' ? 'bg-emerald-100 text-emerald-800' :
                  indicator.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {indicator.status === 'good' ? 'Atingiu' : 
                   indicator.status === 'warning' ? 'Perto' : 'Não Atingiu'}
                </span>
              </div>
              
              <h3 className="font-medium text-gray-900">{indicator.nome}</h3>
              <p className="text-sm text-gray-600 mb-2">{indicator.curso}</p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">{indicator.valor}%</span>
                <div className="flex items-center">
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    indicator.tendencia === 'up' ? 'text-emerald-500' :
                    indicator.tendencia === 'down' ? 'text-red-500' :
                    'text-gray-400'
                  }`} />
                  <span className="text-sm text-gray-600">Meta: {indicator.meta}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    indicator.valor >= indicator.meta ? 'bg-emerald-500' :
                    indicator.valor >= indicator.meta * 0.9 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, indicator.valor)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Conformities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Não Conformidades</h2>
          <button className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <AlertCircle className="w-4 h-4 mr-2" />
            Nova Não Conformidade
          </button>
        </div>

        <div className="space-y-4">
          {nonConformities.map(nc => (
            <div key={nc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                    <h3 className="font-medium text-gray-900">{nc.descricao}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Área:</span> {nc.curso || nc.departamento}
                    </div>
                    <div>
                      <span className="font-medium">Data:</span> {nc.data}
                    </div>
                    <div>
                      <span className="font-medium">Prazo:</span> {nc.prazo}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    nc.status === 'open' ? 'bg-red-100 text-red-800' :
                    nc.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {nc.status === 'open' ? 'Aberto' :
                     nc.status === 'in_progress' ? 'Em Progresso' : 'Resolvido'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Plans */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Planos de Melhoria Contínua</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Melhoria #{i}</h3>
                  <p className="text-sm text-gray-600">Curso de Direito</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                Implementação de novas metodologias de ensino para aumentar engajamento.
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-gray-600">Início: Jan 2024</span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  60% completo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}