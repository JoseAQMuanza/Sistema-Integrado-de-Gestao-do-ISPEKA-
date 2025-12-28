'use client'

import { useState } from 'react'
import {
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Users, Calendar, Clock, Building, ChevronDown, MoreVertical,
  BookOpen, User, CheckCircle, XCircle,
  ChartBar
} from 'lucide-react'
import TurmaModal from '@/components/academic/classes/classes-modal'

// Dados mockados
const turmas = [
  {
    id: 1,
    codigo: 'TUR-DIR101-A',
    disciplina: 'Direito Civil I',
    curso: 'Direito',
    professor: 'Dr. João Silva',
    periodo: '2023/2024 - 1º Semestre',
    horario: 'Segunda 08:00-10:00 | Quarta 10:00-12:00',
    sala: 'Sala 101 - Bloco A',
    vagas: 40,
    matriculados: 38,
    status: 'ativa'
  },
  {
    id: 2,
    codigo: 'TUR-INF201-B',
    disciplina: 'Programação Avançada',
    curso: 'Engenharia Informática',
    professor: 'Dra. Maria Santos',
    periodo: '2023/2024 - 1º Semestre',
    horario: 'Terça 14:00-16:00 | Quinta 16:00-18:00',
    sala: 'Lab. Informática 3',
    vagas: 30,
    matriculados: 28,
    status: 'ativa'
  },
  {
    id: 3,
    codigo: 'TUR-ENF102-C',
    disciplina: 'Anatomia Humana',
    curso: 'Enfermagem',
    professor: 'Prof. Carlos Mendes',
    periodo: '2023/2024 - 1º Semestre',
    horario: 'Sexta 08:00-12:00',
    sala: 'Anfiteatro Anatomia',
    vagas: 50,
    matriculados: 45,
    status: 'ativa'
  }
]

const cursos = ['Todos os cursos', 'Direito', 'Engenharia Informática', 'Enfermagem']
const periodos = ['Todos os períodos', '2023/2024 - 1º Semestre', '2023/2024 - 2º Semestre']
const statusOptions = ['Todas', 'ativa', 'encerrada', 'planejada']

export default function TurmasPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTurma, setEditingTurma] = useState(null)
  const [selectedCurso, setSelectedCurso] = useState('Todos os cursos')
  const [selectedStatus, setSelectedStatus] = useState('Todas')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTurmas = turmas.filter(turma => {
    const matchesSearch = turma.codigo.toLowerCase().includes(search.toLowerCase()) ||
                         turma.disciplina.toLowerCase().includes(search.toLowerCase())
    const matchesCurso = selectedCurso === 'Todos os cursos' || 
                        turma.curso === selectedCurso
    const matchesStatus = selectedStatus === 'Todas' || 
                         turma.status === selectedStatus
    return matchesSearch && matchesCurso && matchesStatus
  })

  const handleEdit = (turma: any) => {
    setEditingTurma(turma)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      console.log('Excluir turma:', id)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingTurma(null)
  }

  const handleModalSave = (data: any) => {
    if (editingTurma) {
      console.log('Atualizar turma:', data)
    } else {
      console.log('Criar turma:', data)
    }
    handleModalClose()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ativa: 'bg-emerald-100 text-emerald-800',
      encerrada: 'bg-gray-100 text-gray-800',
      planejada: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    return status === 'ativa' ? CheckCircle : XCircle
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
            <p className="text-gray-600">Gerencie as turmas das disciplinas</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Turma
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Turmas Ativas', value: '142', icon: Users, color: 'emerald' },
          { label: 'Vagas Disponíveis', value: '286', icon: User, color: 'blue' },
          { label: 'Taxa de Ocupação', value: '92%', icon: ChartBar, color: 'violet' },
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
                placeholder="Pesquisar por código ou disciplina..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso
                </label>
                <select
                  value={selectedCurso}
                  onChange={(e) => setSelectedCurso(e.target.value)}
                  className="w-full input-field"
                >
                  {cursos.map(curso => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select className="w-full input-field">
                  {periodos.map(periodo => (
                    <option key={periodo} value={periodo}>
                      {periodo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full input-field"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Disciplina
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Detalhes
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vagas
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
              {filteredTurmas.map((turma) => {
                const StatusIcon = getStatusIcon(turma.status)
                return (
                  <tr key={turma.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-blue-600">
                        {turma.codigo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{turma.disciplina}</div>
                          <div className="text-sm text-gray-600">{turma.curso}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{turma.professor}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{turma.periodo}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{turma.horario}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Building className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{turma.sala}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Matriculados:</span>
                          <span className="font-medium">{turma.matriculados}/{turma.vagas}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(turma.matriculados / turma.vagas) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {turma.vagas - turma.matriculados} vagas disponíveis
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(turma.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {turma.status.charAt(0).toUpperCase() + turma.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/academico/turmas/${turma.id}`}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleEdit(turma)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(turma.id)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-900">
                          <MoreVertical className="w-5 h-5" />
                        </button>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Nova Turma</span>
            <p className="text-sm text-gray-600 mt-1">Criar nova turma</p>
          </div>
        </button>

        <a
          href="/academico/horarios"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Horários</span>
            <p className="text-sm text-gray-600 mt-1">Gerir horários</p>
          </div>
        </a>

        <a
          href="/academico/matriculas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Matrículas</span>
            <p className="text-sm text-gray-600 mt-1">Gerir estudantes</p>
          </div>
        </a>

        <a
          href="/academico/relatorios/turmas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3">
              <Download className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Relatórios</span>
            <p className="text-sm text-gray-600 mt-1">Estatísticas</p>
          </div>
        </a>
      </div>

      {/* Modal */}
      <TurmaModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        turma={editingTurma}
      />
    </div>
  )
}