// app/estudantes/page.tsx
'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  CheckCircle,
  XCircle,
  ChevronDown,
  Upload,
  UserPlus,
  AlertCircle
} from 'lucide-react'

// Dados mockados
const students = [
  {
    id: 1,
    numero: '20230001',
    nome: 'Maria Silva',
    email: 'maria.silva@ispeka.edu.ao',
    telefone: '+244 923 456 789',
    curso: 'Direito',
    ano: '3º',
    estado: 'ativo',
    propinas: 'em dia',
    ultimaAtividade: '2024-01-15',
    dataMatricula: '2021-09-01'
  },
  {
    id: 2,
    numero: '20230002',
    nome: 'João Pereira',
    email: 'joao.pereira@ispeka.edu.ao',
    telefone: '+244 924 567 890',
    curso: 'Engenharia Informática',
    ano: '2º',
    estado: 'ativo',
    propinas: 'atrasado',
    ultimaAtividade: '2024-01-14',
    dataMatricula: '2022-09-01'
  },
  {
    id: 3,
    numero: '20230003',
    nome: 'Ana Costa',
    email: 'ana.costa@ispeka.edu.ao',
    telefone: '+244 925 678 901',
    curso: 'Enfermagem',
    ano: '4º',
    estado: 'ativo',
    propinas: 'em dia',
    ultimaAtividade: '2024-01-13',
    dataMatricula: '2020-09-01'
  },
  {
    id: 4,
    numero: '20230004',
    nome: 'Carlos Santos',
    email: 'carlos.santos@ispeka.edu.ao',
    telefone: '+244 926 789 012',
    curso: 'Economia',
    ano: '1º',
    estado: 'ativo',
    propinas: 'em dia',
    ultimaAtividade: '2024-01-12',
    dataMatricula: '2023-09-01'
  },
  {
    id: 5,
    numero: '20230005',
    nome: 'Luísa Fernandes',
    email: 'luisa.fernandes@ispeka.edu.ao',
    telefone: '+244 927 890 123',
    curso: 'Psicologia',
    ano: '3º',
    estado: 'trancado',
    propinas: 'pendente',
    ultimaAtividade: '2023-12-15',
    dataMatricula: '2021-09-01'
  },
  {
    id: 6,
    numero: '20230006',
    nome: 'Miguel Oliveira',
    email: 'miguel.oliveira@ispeka.edu.ao',
    telefone: '+244 928 901 234',
    curso: 'Engenharia Civil',
    ano: '5º',
    estado: 'ativo',
    propinas: 'em dia',
    ultimaAtividade: '2024-01-10',
    dataMatricula: '2019-09-01'
  }
]

const courses = [
  'Todos os cursos',
  'Direito',
  'Engenharia Informática',
  'Enfermagem',
  'Economia',
  'Psicologia',
  'Engenharia Civil'
]

const statusOptions = [
  'Todos os estados',
  'ativo',
  'trancado',
  'formado',
  'cancelado'
]

const tuitionStatus = [
  'Todos',
  'em dia',
  'atrasado',
  'pendente'
]

export default function EstudantesPage() {
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('Todos os cursos')
  const [selectedStatus, setSelectedStatus] = useState('Todos os estados')
  const [selectedTuition, setSelectedTuition] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nome.toLowerCase().includes(search.toLowerCase()) ||
                         student.numero.includes(search) ||
                         student.email.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = selectedCourse === 'Todos os cursos' || 
                         student.curso === selectedCourse
    const matchesStatus = selectedStatus === 'Todos os estados' || 
                         student.estado === selectedStatus
    const matchesTuition = selectedTuition === 'Todos' || 
                          student.propinas === selectedTuition
    return matchesSearch && matchesCourse && matchesStatus && matchesTuition
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Estudantes</h1>
            <p className="text-gray-600">Gerencie estudantes, matrículas e dados académicos</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn-secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </button>
            <a
              href="/students/new"
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Estudante
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Estudantes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">2,845</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">+12.5% este ano</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estudantes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">2,720</p>
              <p className="text-xs text-gray-500">95.6% do total</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Propinas em Dia</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">2,540</p>
              <p className="text-xs text-gray-500">89.3% dos ativos</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <Calendar className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Novas Matrículas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">356</p>
              <p className="text-xs text-gray-500">Este ano académico</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/estudantes/matriculas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Nova Matrícula</span>
            <p className="text-sm text-gray-600 mt-1">Cadastrar estudante</p>
          </div>
        </a>

        <a
          href="/estudantes/inscricoes"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Inscrições</span>
            <p className="text-sm text-gray-600 mt-1">Em disciplinas</p>
          </div>
        </a>

        <a
          href="/estudantes/notas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Lançar Notas</span>
            <p className="text-sm text-gray-600 mt-1">Avaliações</p>
          </div>
        </a>

        <a
          href="/estudantes/relatorios"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Relatórios</span>
            <p className="text-sm text-gray-600 mt-1">Académicos</p>
          </div>
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por nome, número ou email..."
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
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  Estado Académico
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situação de Propinas
                </label>
                <select
                  value={selectedTuition}
                  onChange={(e) => setSelectedTuition(e.target.value)}
                  className="w-full input-field"
                >
                  {tuitionStatus.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano Académico
                </label>
                <select className="w-full input-field">
                  <option>Todos os anos</option>
                  <option>1º Ano</option>
                  <option>2º Ano</option>
                  <option>3º Ano</option>
                  <option>4º Ano</option>
                  <option>5º Ano</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="table-header">
                  Número
                </th>
                <th scope="col" className="table-header">
                  Estudante
                </th>
                <th scope="col" className="table-header">
                  Curso
                </th>
                <th scope="col" className="table-header">
                  Ano
                </th>
                <th scope="col" className="table-header">
                  Contacto
                </th>
                <th scope="col" className="table-header">
                  Estado
                </th>
                <th scope="col" className="table-header">
                  Propinas
                </th>
                <th scope="col" className="table-header">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {student.numero}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {student.nome.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{student.curso}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {student.ano} Ano
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.telefone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.estado === 'ativo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : student.estado === 'trancado'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.propinas === 'em dia'
                        ? 'bg-emerald-100 text-emerald-800'
                        : student.propinas === 'atrasado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {student.propinas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/students/${student.id}/details`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      <a
                        href={`/students/${student.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </a>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Mostrando <span className="font-medium">1</span> a{' '}
              <span className="font-medium">{filteredStudents.length}</span> de{' '}
              <span className="font-medium">{students.length}</span> estudantes
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum estudante encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Não foram encontrados estudantes com os filtros aplicados.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setSearch('')
                setSelectedCourse('Todos os cursos')
                setSelectedStatus('Todos os estados')
                setSelectedTuition('Todos')
              }}
              className="btn-primary"
            >
              Limpar filtros
            </button>
            <a
              href="/estudantes/novo"
              className="btn-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Estudante
            </a>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Importar Estudantes</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 mb-2">Arraste ou selecione um arquivo</p>
              <p className="text-sm text-gray-500 mb-4">CSV ou Excel (máx. 10MB)</p>
              <button className="btn-primary">
                Selecionar Arquivo
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Formato: Nome, Email, Telefone, Curso, Ano
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Use o template disponível para download
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                Cursos devem existir no sistema
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button className="btn-primary">
                Iniciar Importação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}