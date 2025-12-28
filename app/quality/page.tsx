'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, Target, AlertCircle, CheckCircle, BarChart3,
  FileText, Users, Building2, Calendar, Star,
  Filter, Download, Plus, ChevronDown
} from 'lucide-react'

// Dados de exemplo
const qualityStats = {
  overallScore: 4.6,
  indicators: 24,
  completedAudits: 18,
  pendingActions: 7,
  departments: 6,
  improvementPlans: 12
}

const recentAudits = [
  { id: 1, department: 'Ciências Sociais', type: 'Interna', date: '2024-01-15', status: 'concluida', score: 4.8 },
  { id: 2, department: 'Engenharia', type: 'Interna', date: '2024-01-10', status: 'concluida', score: 4.5 },
  { id: 3, department: 'Saúde', type: 'Externa', date: '2024-01-05', status: 'em_andamento', score: null },
]

const priorityActions = [
  { id: 1, description: 'Atualizar laboratório de informática', department: 'ENG', deadline: '2024-02-15', priority: 'alta' },
  { id: 2, description: 'Revisar programa de Direito', department: 'CSH', deadline: '2024-03-01', priority: 'media' },
  { id: 3, description: 'Capacitação em metodologias ativas', department: 'SAU', deadline: '2024-01-31', priority: 'alta' },
]

const indicatorTrends = [
  { name: 'Satisfação Estudantes', current: 4.7, previous: 4.5, trend: 'up' },
  { name: 'Taxa Aprovação', current: 87, previous: 85, trend: 'up' },
  { name: 'Publicações', current: 45, previous: 42, trend: 'up' },
  { name: 'Retenção', current: 92, previous: 93, trend: 'down' },
]

export default function QualidadePage() {
  const [timeRange, setTimeRange] = useState('2024')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão da Qualidade</h1>
            <p className="text-gray-600">Monitoramento e melhoria contínua - ISPEKA</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Relatório
            </button>
            <Link href="/qualidade/indicadores/novo" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Indicador
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Avaliação Geral', value: qualityStats.overallScore, unit: '/5.0', icon: Star, color: 'amber', trend: '+0.2' },
          { label: 'Indicadores Ativos', value: qualityStats.indicators, icon: Target, color: 'blue' },
          { label: 'Auditorias Concluídas', value: qualityStats.completedAudits, icon: CheckCircle, color: 'emerald' },
          { label: 'Ações Pendentes', value: qualityStats.pendingActions, icon: AlertCircle, color: 'red' },
          { label: 'Departamentos', value: qualityStats.departments, icon: Building2, color: 'violet' },
          { label: 'Planos de Melhoria', value: qualityStats.improvementPlans, icon: TrendingUp, color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.unit && <span className="text-sm text-gray-600 ml-1">{stat.unit}</span>}
                  {stat.trend && <span className="text-xs text-emerald-600 font-medium ml-2">{stat.trend}</span>}
                </div>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auditorias Recentes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabela Auditorias */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Auditorias Recentes</h2>
                <Link href="/qualidade/auditorias" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todas →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Departamento</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Pontuação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAudits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{audit.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{audit.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(audit.date).toLocaleDateString('pt-AO')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          audit.status === 'concluida' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {audit.status === 'concluida' ? 'Concluída' : 'Em Andamento'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {audit.score ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="font-medium">{audit.score}</span>
                            <span className="text-sm text-gray-600 ml-1">/5.0</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <Link href="/qualidade/auditorias/nova" className="btn-primary w-full">
                Nova Auditoria
              </Link>
            </div>
          </div>

          {/* Tendências */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Tendências dos Indicadores</h2>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="input-field text-sm">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div className="space-y-4">
              {indicatorTrends.map((ind, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{ind.name}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-bold text-gray-900">
                          {typeof ind.current === 'number' ? ind.current : (ind.current as number).toFixed(1)}
                      </span>
                      {typeof ind.current === 'number' && ind.current <= 100 && (
                        <span className="text-sm text-gray-600 ml-1">%</span>
                      )}
                      <div className="flex items-center ml-3">
                        {ind.trend === 'up' ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-sm text-emerald-600">+{Math.abs(ind.current - ind.previous)}</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
                            <span className="text-sm text-red-600">-{Math.abs(ind.current - ind.previous)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Anterior: {ind.previous}</p>
                    <p className="text-xs text-gray-500">Variação</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações Prioritárias */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Prioritárias</h2>
            <div className="space-y-4">
              {priorityActions.map((action) => (
                <div key={action.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{action.description}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      action.priority === 'alta' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {action.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{action.department}</span>
                    <span className="text-gray-500">
                      Prazo: {new Date(action.deadline).toLocaleDateString('pt-AO')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/qualidade/acoes" className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas as ações →
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link href="/qualidade/indicadores" className="flex items-center p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50">
                <Target className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Indicadores</p>
                  <p className="text-sm text-gray-600">Gerencie indicadores de qualidade</p>
                </div>
              </Link>
              <Link href="/qualidade/auditorias" className="flex items-center p-3 border rounded-lg hover:border-emerald-500 hover:bg-emerald-50">
                <FileText className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Auditorias</p>
                  <p className="text-sm text-gray-600">Programe e execute auditorias</p>
                </div>
              </Link>
              <Link href="/qualidade/relatorios" className="flex items-center p-3 border rounded-lg hover:border-violet-500 hover:bg-violet-50">
                <BarChart3 className="w-5 h-5 text-violet-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600">Gere relatórios de qualidade</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}