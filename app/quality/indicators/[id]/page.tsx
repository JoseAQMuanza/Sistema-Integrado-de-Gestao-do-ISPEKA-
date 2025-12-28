'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Edit, Download, Printer, Target, TrendingUp,
  Calendar, Users, BarChart3, FileText, AlertCircle,
  CheckCircle, Clock, Building2, Eye, MoreVertical
} from 'lucide-react'

const indicatorData = {
  id: 1,
  codigo: 'IND-001',
  nome: 'Satisfação dos Estudantes',
  descricao: 'Mede o nível de satisfação dos estudantes com os serviços académicos.',
  categoria: 'Ensino',
  responsavel: 'Direção Académica',
  departamento: 'Todos',
  formula: 'Média das avaliações por questionário',
  unidadeMedida: 'Escala 1-5',
  periodo: 'Semestral',
  meta: 4.5,
  valorAtual: 4.7,
  tendencia: 'ascendente',
  status: 'atingida',
  dataCriacao: '2023-01-15',
  proximaMedicao: '2024-02-01'
}

const historicalData = [
  { periodo: '2023/2', valor: 4.7, meta: 4.5 },
  { periodo: '2023/1', valor: 4.6, meta: 4.5 },
  { periodo: '2022/2', valor: 4.5, meta: 4.5 },
  { periodo: '2022/1', valor: 4.4, meta: 4.5 },
]

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Eye },
  { id: 'history', label: 'Histórico', icon: BarChart3 },
  { id: 'analysis', label: 'Análise', icon: TrendingUp },
  { id: 'documents', label: 'Documentos', icon: FileText },
]

export default function IndicatorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const indicator = indicatorData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{indicator.nome}</h1>
            <p className="text-gray-600">{indicator.codigo} • {indicator.categoria}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </button>
          <a href={`/qualidade/indicadores/${params.id}/editar`} className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </a>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-emerald-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Meta Atingida</h3>
              <p className="text-sm text-gray-600">Indicador dentro dos parâmetros esperados</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{indicator.valorAtual}</p>
              <p className="text-sm text-gray-600">Valor Atual</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{indicator.meta}</p>
              <p className="text-sm text-gray-600">Meta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Informações</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Responsável</span>
                <p className="font-medium">{indicator.responsavel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Departamento</span>
                <p className="font-medium">{indicator.departamento}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Período</span>
                <p className="font-medium">{indicator.periodo}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Unidade</span>
                <p className="font-medium">{indicator.unidadeMedida}</p>
              </div>
            </div>
          </div>

          {/* Next Measurement */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Próxima Medição</h3>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">
                  {new Date(indicator.proximaMedicao).toLocaleDateString('pt-AO')}
                </p>
                <p className="text-sm text-gray-600">Data prevista</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="bg-white rounded-xl border mb-6">
            <div className="border-b">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500'
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
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
                    <p className="text-gray-700">{indicator.descricao}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fórmula de Cálculo</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-mono text-gray-900">{indicator.formula}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium">Tendência</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 capitalize">{indicator.tendencia}</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
                        <span className="font-medium">Data Criação</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date(indicator.dataCriacao).toLocaleDateString('pt-AO')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              {activeTab === 'history' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Medições</h3>
                  <div className="space-y-4">
                    {historicalData.map((item, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.periodo}</span>
                          <div className="flex items-center">
                            <span className={`text-lg font-bold ${
                              item.valor >= item.meta ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {item.valor}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">/ {item.meta}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.valor >= item.meta ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${(item.valor / item.meta) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis */}
              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Desempenho</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        O indicador apresenta tendência ascendente desde 2022, com melhoria contínua.
                        A meta foi superada nos últimos dois semestres.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                        <p>Manter as ações atuais de melhoria</p>
                      </div>
                      <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
                        <p>Monitorar satisfação por departamento</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {activeTab === 'documents' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos Relacionados</h3>
                  <div className="space-y-4">
                    {[
                      { nome: 'Relatório de Análise 2023', tipo: 'Análise', data: '2024-01-10' },
                      { nome: 'Questionário de Satisfação', tipo: 'Instrumento', data: '2023-12-15' },
                      { nome: 'Plano de Ação', tipo: 'Planejamento', data: '2023-11-20' },
                    ].map((doc, i) => (
                      <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{doc.nome}</p>
                              <p className="text-sm text-gray-600">{doc.tipo}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(doc.data).toLocaleDateString('pt-AO')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}