'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Calendar, CheckCircle, XCircle, Clock, ChevronDown,
  MoreVertical, CalendarDays
} from 'lucide-react'

const academicYears = [
  {
    id: 1,
    ano: '2023/2024',
    periodo: '2023-09-01 a 2024-07-31',
    status: 'ativo',
    semestres: 2,
    cursosAtivos: 18,
    estudantes: 2845,
    dataInicio: '2023-09-01',
    dataFim: '2024-07-31'
  },
  {
    id: 2,
    ano: '2022/2023',
    periodo: '2022-09-01 a 2023-07-31',
    status: 'encerrado',
    semestres: 2,
    cursosAtivos: 17,
    estudantes: 2650,
    dataInicio: '2022-09-01',
    dataFim: '2023-07-31'
  },
  {
    id: 3,
    ano: '2024/2025',
    periodo: '2024-09-01 a 2025-07-31',
    status: 'planejado',
    semestres: 2,
    cursosAtivos: 19,
    estudantes: 0,
    dataInicio: '2024-09-01',
    dataFim: '2025-07-31'
  }
]

const statusOptions = ['Todos', 'ativo', 'encerrado', 'planejado']

export default function AnosAcademicosPage() {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filteredYears = academicYears.filter(year => {
    const matchesSearch = year.ano.includes(search)
    const matchesStatus = selectedStatus === 'Todos' || year.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusInfo = (status: string) => {
    const info = {
      ativo: { color: 'emerald', text: 'Ativo', icon: CheckCircle },
      encerrado: { color: 'gray', text: 'Encerrado', icon: XCircle },
      planejado: { color: 'blue', text: 'Planejado', icon: Clock }
    }
    return info[status as keyof typeof info] || info.encerrado
  }

  const handleActivateYear = (id: number) => {
    // Implementar ativação
    console.log('Ativar ano:', id)
  }

  const handleCloseYear = (id: number) => {
    // Implementar encerramento
    console.log('Encerrar ano:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Anos Acadêmicos</h1>
            <p className="text-gray-600">Gerencie os anos letivos da instituição</p>
          </div>
          <Link href="/academico/anos/novo" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Ano Acadêmico
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Ano Atual', value: '2023/2024', icon: Calendar, color: 'emerald' },
          { label: 'Próximo Ano', value: '2024/2025', icon: CalendarDays, color: 'blue' },
          { label: 'Estudantes Ativos', value: '2.845', icon: CheckCircle, color: 'violet' },
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por ano..."
                className="pl-10 w-full input-field"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              <ChevronDown className={`w-4 h-4 ml-2 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full input-field"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ano Acadêmico
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estatísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredYears.map((year) => {
                const status = getStatusInfo(year.status)
                const Icon = status.icon
                return (
                  <tr key={year.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-bold text-lg text-gray-900">{year.ano}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(year.dataInicio).toLocaleDateString('pt-AO')} - {new Date(year.dataFim).toLocaleDateString('pt-AO')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{year.periodo}</div>
                      <div className="text-sm text-gray-600">
                        {year.semestres} semestres
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600 w-32">Cursos Ativos:</span>
                          <span className="font-medium">{year.cursosAtivos}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600 w-32">Estudantes:</span>
                          <span className="font-medium">{year.estudantes.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit bg-${status.color}-100 text-${status.color}-800`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/academico/anos/${year.id}`}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/academico/anos/${year.id}/editar`}
                          className="p-1 text-gray-600 hover:text-gray-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        
                        {year.status === 'planejado' && (
                          <button
                            onClick={() => handleActivateYear(year.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-900"
                            title="Ativar"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        
                        {year.status === 'ativo' && (
                          <button
                            onClick={() => handleCloseYear(year.id)}
                            className="p-1 text-amber-600 hover:text-amber-900"
                            title="Encerrar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        
                        <div className="relative">
                          <button className="p-1 text-gray-600 hover:text-gray-900">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/academico/anos/novo"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Novo Ano</span>
            <p className="text-sm text-gray-600 mt-1">Criar ano académico</p>
          </div>
        </Link>

        <Link
          href="/academico/semestres"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3">
              <CalendarDays className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Semestres</span>
            <p className="text-sm text-gray-600 mt-1">Gerir períodos</p>
          </div>
        </Link>

        <Link
          href="/academico/feriados"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Calendário</span>
            <p className="text-sm text-gray-600 mt-1">Feriados e pausas</p>
          </div>
        </Link>

        <Link
          href="/academico/relatorios"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3">
              <Download className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Relatórios</span>
            <p className="text-sm text-gray-600 mt-1">Estatísticas anuais</p>
          </div>
        </Link>
      </div>
    </div>
  )
}