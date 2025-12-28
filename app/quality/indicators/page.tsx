'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Target, TrendingUp, AlertCircle, CheckCircle, BarChart3,
  Building2, Users, Calendar, ChevronDown
} from 'lucide-react'

const indicators = [
  { id: 1, codigo: 'IND-001', nome: 'Satisfação dos Estudantes', categoria: 'Ensino', responsavel: 'Direção Académica', periodo: 'Semestral', meta: 4.5, atual: 4.7, status: 'atingida' },
  { id: 2, codigo: 'IND-002', nome: 'Taxa de Aprovação', categoria: 'Desempenho', responsavel: 'Departamentos', periodo: 'Anual', meta: 85, atual: 87, status: 'atingida' },
  { id: 3, codigo: 'IND-003', nome: 'Publicações Científicas', categoria: 'Pesquisa', responsavel: 'Investigação', periodo: 'Anual', meta: 40, atual: 45, status: 'excedida' },
  { id: 4, codigo: 'IND-004', nome: 'Taxa de Retenção', categoria: 'Gestão', responsavel: 'Secretaria', periodo: 'Anual', meta: 95, atual: 92, status: 'abaixo' },
]

const categories = ['Todos', 'Ensino', 'Pesquisa', 'Extensão', 'Gestão', 'Infraestrutura']
const periods = ['Todos', 'Mensal', 'Trimestral', 'Semestral', 'Anual']
const statuses = ['Todos', 'atingida', 'excedida', 'abaixo', 'em_monitoramento']

export default function IndicadoresPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filteredIndicators = indicators.filter(ind =>
    ind.nome.toLowerCase().includes(search.toLowerCase()) ||
    ind.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'atingida': 'bg-emerald-100 text-emerald-800',
      'excedida': 'bg-blue-100 text-blue-800',
      'abaixo': 'bg-red-100 text-red-800',
      'em_monitoramento': 'bg-amber-100 text-amber-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Indicadores de Qualidade</h1>
            <p className="text-gray-600">Monitore e gerencie os indicadores institucionais</p>
          </div>
          <Link href="indicators/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Indicador
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Indicadores', value: indicators.length, icon: Target, color: 'blue' },
          { label: 'Metas Atingidas', value: indicators.filter(i => i.status === 'atingida').length, icon: CheckCircle, color: 'emerald' },
          { label: 'Abaixo da Meta', value: indicators.filter(i => i.status === 'abaixo').length, icon: AlertCircle, color: 'red' },
          { label: 'Em Monitoramento', value: indicators.filter(i => i.status === 'em_monitoramento').length, icon: TrendingUp, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar indicadores..."
                className="pl-10 w-full input-field"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              <ChevronDown className={`w-4 h-4 ml-2 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full input-field">
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <select className="w-full input-field">
                  {periods.map(period => <option key={period}>{period}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full input-field">
                  {statuses.map(status => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicators Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Código</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Indicador</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Valor/Meta</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Período</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIndicators.map((ind) => (
                <tr key={ind.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-blue-600">{ind.codigo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{ind.nome}</div>
                        <div className="text-sm text-gray-600">Resp: {ind.responsavel}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {ind.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-900">{ind.atual}</span>
                      <span className="text-sm text-gray-600 ml-2">/ {ind.meta}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          ind.status === 'excedida' ? 'bg-blue-600' :
                          ind.status === 'atingida' ? 'bg-emerald-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min((ind.atual / ind.meta) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ind.status)}`}>
                      {ind.status === 'atingida' ? 'Meta Atingida' :
                       ind.status === 'excedida' ? 'Meta Excedida' :
                       ind.status === 'abaixo' ? 'Abaixo da Meta' : 'Monitoramento'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ind.periodo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/qualidade/indicadores/${ind.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link href={`indicators/${ind.id}/edit`} className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}