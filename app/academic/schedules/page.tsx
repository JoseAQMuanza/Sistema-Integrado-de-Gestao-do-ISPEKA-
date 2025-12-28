'use client'

import { useState } from 'react'
import {
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Users, Calendar, Clock, Building, ChevronDown, MoreVertical,
  BookOpen, User, CheckCircle, XCircle, Bell, AlertCircle
} from 'lucide-react'
import HorarioModal from '@/components/academic/schedules/schedules-modal'

// Dados mockados
const horarios = [
  {
    id: 1,
    turma: 'TUR-DIR101-A',
    disciplina: 'Direito Civil I',
    professor: 'Dr. João Silva',
    dia: 'Segunda-feira',
    horario: '08:00 - 10:00',
    sala: 'Sala 101 - Bloco A',
    curso: 'Direito',
    periodo: '2023/2024 - 1º Semestre',
    status: 'ativo'
  },
  {
    id: 2,
    turma: 'TUR-INF201-B',
    disciplina: 'Programação Avançada',
    professor: 'Dra. Maria Santos',
    dia: 'Terça-feira',
    horario: '14:00 - 16:00',
    sala: 'Lab. Informática 3',
    curso: 'Engenharia Informática',
    periodo: '2023/2024 - 1º Semestre',
    status: 'ativo'
  },
  {
    id: 3,
    turma: 'TUR-ENF102-C',
    disciplina: 'Anatomia Humana',
    professor: 'Prof. Carlos Mendes',
    dia: 'Sexta-feira',
    horario: '08:00 - 12:00',
    sala: 'Anfiteatro Anatomia',
    curso: 'Enfermagem',
    periodo: '2023/2024 - 1º Semestre',
    status: 'ativo'
  }
]

const dias = ['Todos os dias', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const cursos = ['Todos os cursos', 'Direito', 'Engenharia Informática', 'Enfermagem']
const periodos = ['Todos os períodos', '2023/2024 - 1º Semestre', '2023/2024 - 2º Semestre']
const statusOptions = ['Todos', 'ativo', 'cancelado', 'substituto']

export default function HorariosPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingHorario, setEditingHorario] = useState(null)
  const [selectedDia, setSelectedDia] = useState('Todos os dias')
  const [selectedCurso, setSelectedCurso] = useState('Todos os cursos')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filteredHorarios = horarios.filter(horario => {
    const matchesSearch = horario.turma.toLowerCase().includes(search.toLowerCase()) ||
                         horario.disciplina.toLowerCase().includes(search.toLowerCase()) ||
                         horario.professor.toLowerCase().includes(search.toLowerCase())
    const matchesDia = selectedDia === 'Todos os dias' || 
                      horario.dia === selectedDia
    const matchesCurso = selectedCurso === 'Todos os cursos' || 
                        horario.curso === selectedCurso
    const matchesStatus = selectedStatus === 'Todos' || 
                         horario.status === selectedStatus
    return matchesSearch && matchesDia && matchesCurso && matchesStatus
  })

  const handleEdit = (horario: any) => {
    setEditingHorario(horario)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este horário?')) {
      console.log('Excluir horário:', id)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingHorario(null)
  }

  const handleModalSave = (data: any) => {
    if (editingHorario) {
      console.log('Atualizar horário:', data)
    } else {
      console.log('Criar horário:', data)
    }
    handleModalClose()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: 'bg-emerald-100 text-emerald-800',
      cancelado: 'bg-red-100 text-red-800',
      substituto: 'bg-amber-100 text-amber-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      ativo: CheckCircle,
      cancelado: XCircle,
      substituto: AlertCircle
    }
    return icons[status as keyof typeof icons] || AlertCircle
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Horários</h1>
            <p className="text-gray-600">Gerencie os horários das turmas</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Horário
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Horários Hoje', value: '24', icon: Calendar, color: 'blue' },
          { label: 'Turmas Ativas', value: '18', icon: Users, color: 'emerald' },
          { label: 'Professores', value: '12', icon: User, color: 'violet' },
          { label: 'Aulas Canceladas', value: '2', icon: Bell, color: 'red' },
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
                placeholder="Pesquisar por turma, disciplina ou professor..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dia da Semana
                </label>
                <select
                  value={selectedDia}
                  onChange={(e) => setSelectedDia(e.target.value)}
                  className="w-full input-field"
                >
                  {dias.map(dia => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>

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
                  Turma/Disciplina
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Professor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Dia/Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Curso
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
              {filteredHorarios.map((horario) => {
                const StatusIcon = getStatusIcon(horario.status)
                return (
                  <tr key={horario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-mono font-bold text-blue-600">
                            {horario.turma}
                          </div>
                          <div className="font-medium text-gray-900">{horario.disciplina}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="font-medium text-gray-900">{horario.professor}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center font-medium text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {horario.dia}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          {horario.horario}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="font-medium text-gray-900">{horario.sala}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{horario.curso}</div>
                      <div className="text-sm text-gray-600">{horario.periodo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(horario.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {horario.status.charAt(0).toUpperCase() + horario.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/academico/horarios/${horario.id}`}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleEdit(horario)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(horario.id)}
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
            <span className="font-medium text-gray-900">Novo Horário</span>
            <p className="text-sm text-gray-600 mt-1">Agendar aula</p>
          </div>
        </button>

        <a
          href="/academico/turmas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Turmas</span>
            <p className="text-sm text-gray-600 mt-1">Gerir turmas</p>
          </div>
        </a>

        <a
          href="/academico/salas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3">
              <Building className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Salas</span>
            <p className="text-sm text-gray-600 mt-1">Disponibilidade</p>
          </div>
        </a>

        <a
          href="/academico/relatorios/horarios"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3">
              <Download className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Relatórios</span>
            <p className="text-sm text-gray-600 mt-1">Exportar horários</p>
          </div>
        </a>
      </div>

      {/* Modal */}
      <HorarioModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        horario={editingHorario}
      />
    </div>
  )
}