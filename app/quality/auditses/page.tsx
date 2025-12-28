'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, Download, Eye, Edit, FileText,
  Calendar, Users, Building2, AlertCircle, CheckCircle,
  Clock, ChevronDown
} from 'lucide-react'

const audits = [
  { id: 1, codigo: 'AUD-2024-001', tipo: 'Interna', departamento: 'Ciências Sociais', data: '2024-01-15', status: 'concluida', auditores: 3 },
  { id: 2, codigo: 'AUD-2024-002', tipo: 'Interna', departamento: 'Engenharia', data: '2024-01-10', status: 'concluida', auditores: 2 },
  { id: 3, codigo: 'AUD-2024-003', tipo: 'Externa', departamento: 'Saúde', data: '2024-02-05', status: 'em_andamento', auditores: 4 },
  { id: 4, codigo: 'AUD-2024-004', tipo: 'Interna', departamento: 'Gestão', data: '2024-02-20', status: 'agendada', auditores: 2 },
]

const auditTypes = ['Todos', 'Interna', 'Externa', 'Recertificação']
const statuses = ['Todos', 'agendada', 'em_andamento', 'concluida', 'cancelada']
const departments = ['Todos', 'Ciências Sociais', 'Engenharia', 'Saúde', 'Gestão', 'Artes']

export default function AuditoriasPage() {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAudits = audits.filter(audit =>
    audit.codigo.toLowerCase().includes(search.toLowerCase()) ||
    audit.departamento.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusInfo = (status: string) => {
    const info: Record<string, { text: string, color: string }> = {
      'concluida': { text: 'Concluída', color: 'emerald' },
      'em_andamento': { text: 'Em Andamento', color: 'blue' },
      'agendada': { text: 'Agendada', color: 'amber' },
      'cancelada': { text: 'Cancelada', color: 'red' }
    }
    return info[status] || { text: status, color: 'gray' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auditorias</h1>
            <p className="text-gray-600">Programação e execução de auditorias internas</p>
          </div>
          <Link href="/qualidade/auditorias/nova" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Auditoria
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Auditorias', value: audits.length, icon: FileText, color: 'blue' },
          { label: 'Concluídas', value: audits.filter(a => a.status === 'concluida').length, icon: CheckCircle, color: 'emerald' },
          { label: 'Em Andamento', value: audits.filter(a => a.status === 'em_andamento').length, icon: Clock, color: 'amber' },
          { label: 'Agendadas', value: audits.filter(a => a.status === 'agendada').length, icon: Calendar, color: 'violet' },
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
                placeholder="Pesquisar auditorias..."
                className="pl-10 w-full input-field"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Relatório
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select className="w-full input-field">
                  {auditTypes.map(type => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full input-field">
                  {statuses.map(status => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                <select className="w-full input-field">
                  {departments.map(dept => <option key={dept}>{dept}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audits Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Código</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Auditores</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAudits.map((audit) => {
                const status = getStatusInfo(audit.status)
                return (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-gray-900">{audit.codigo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        audit.tipo === 'Interna' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {audit.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{audit.departamento}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(audit.data).toLocaleDateString('pt-AO')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{audit.auditores}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/qualidade/auditorias/${audit.id}`} className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link href={`/qualidade/auditorias/${audit.id}/editar`} className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link href={`/qualidade/auditorias/${audit.id}/relatorio`} className="text-emerald-600 hover:text-emerald-900">
                          <FileText className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}