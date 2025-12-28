'use client'

import { useState } from 'react'
import {
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  BookOpen, Clock, Users, ChevronDown, MoreVertical,
  GraduationCap, BarChart3
} from 'lucide-react'
import DisciplinaModal from '@/components/academic/disciplines/discipline-modal'

// Dados mockados
const disciplines = [
  {
    id: 1,
    codigo: 'DIR-101',
    nome: 'Direito Civil I',
    curso: 'Direito',
    departamento: 'Ciências Sociais',
    creditos: 6,
    cargaHoraria: 60,
    semestre: 1,
    tipo: 'Obrigatória',
    professor: 'Dr. João Silva',
    status: 'ativa'
  },
  {
    id: 2,
    codigo: 'INF-201',
    nome: 'Programação Avançada',
    curso: 'Engenharia Informática',
    departamento: 'Engenharia',
    creditos: 5,
    cargaHoraria: 45,
    semestre: 3,
    tipo: 'Obrigatória',
    professor: 'Dra. Maria Santos',
    status: 'ativa'
  },
  {
    id: 3,
    codigo: 'ENF-102',
    nome: 'Anatomia Humana',
    curso: 'Enfermagem',
    departamento: 'Saúde',
    creditos: 7,
    cargaHoraria: 75,
    semestre: 1,
    tipo: 'Obrigatória',
    professor: 'Prof. Carlos Mendes',
    status: 'ativa'
  }
]

const courses = ['Todos os cursos', 'Direito', 'Engenharia Informática', 'Enfermagem']
const departments = ['Todos os departamentos', 'Ciências Sociais', 'Engenharia', 'Saúde']
const semesters = ['Todos os semestres', '1º', '2º', '3º', '4º', '5º']
const types = ['Todas', 'Obrigatória', 'Optativa', 'Livre']

export default function DisciplinasPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDiscipline, setEditingDiscipline] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState('Todos os cursos')
  const [selectedSemester, setSelectedSemester] = useState('Todos os semestres')

  const filteredDisciplines = disciplines.filter(discipline => {
    const matchesSearch = discipline.nome.toLowerCase().includes(search.toLowerCase()) ||
                         discipline.codigo.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = selectedCourse === 'Todos os cursos' || 
                         discipline.curso === selectedCourse
    const matchesSemester = selectedSemester === 'Todos os semestres' || 
                          discipline.semestre === parseInt(selectedSemester[0])
    return matchesSearch && matchesCourse && matchesSemester
  })

  const handleEdit = (discipline: any) => {
    setEditingDiscipline(discipline)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      console.log('Excluir disciplina:', id)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingDiscipline(null)
  }

  const handleModalSave = (data: any) => {
    if (editingDiscipline) {
      console.log('Atualizar disciplina:', data)
    } else {
      console.log('Criar disciplina:', data)
    }
    handleModalClose()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Disciplinas</h1>
            <p className="text-gray-600">Gerencie as disciplinas dos cursos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Disciplina
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total de Disciplinas', value: '156', icon: BookOpen, color: 'blue' },
          { label: 'Disciplinas Ativas', value: '148', icon: BarChart3, color: 'emerald' },
          { label: 'Professores Envolvidos', value: '87', icon: Users, color: 'violet' },
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
                placeholder="Pesquisar por código ou nome..."
                className="pl-10 w-full input-field"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curso
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full input-field"
            >
              {courses.map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semestre
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full input-field"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select className="w-full input-field">
              {types.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Detalhes
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
              {filteredDisciplines.map((discipline) => (
                <tr key={discipline.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-blue-600">
                      {discipline.codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{discipline.nome}</div>
                        <div className="text-sm text-gray-600">{discipline.tipo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{discipline.curso}</span>
                    </div>
                    <div className="text-sm text-gray-600">{discipline.departamento}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 text-gray-400 mr-2" />
                        <span>{discipline.cargaHoraria}h ({discipline.creditos} créditos)</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 text-gray-400 mr-2" />
                        <span>Semestre {discipline.semestre}</span>
                      </div>
                      <div className="text-gray-600">{discipline.professor}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {discipline.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`disciplines/${discipline.id}/details`}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleEdit(discipline)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(discipline.id)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <DisciplinaModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        disciplina={editingDiscipline}
      />
    </div>
  )
}