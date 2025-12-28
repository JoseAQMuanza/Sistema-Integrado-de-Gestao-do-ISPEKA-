// app/docentes/page.tsx
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
  BookOpen,
  Clock,
  Mail,
  Phone,
  Building2,
  ChevronDown,
  Upload,
  UserPlus,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

// Dados mockados
const teachers = [
  {
    id: 1,
    numero: 'DOC-001',
    nome: 'Dr. João Manuel',
    email: 'joao.manuel@ispeka.edu.ao',
    telefone: '+244 923 111 111',
    departamento: 'Ciências Sociais e Humanas',
    titulacao: 'Doutor',
    regimeTrabalho: 'Tempo Integral',
    cargaHoraria: 40,
    estado: 'ativo',
    cursos: ['Direito', 'Economia'],
    dataContratacao: '2018-03-15',
    ultimaAtividade: '2024-01-15'
  },
  {
    id: 2,
    numero: 'DOC-002',
    nome: 'Dra. Maria Santos',
    email: 'maria.santos@ispeka.edu.ao',
    telefone: '+244 923 222 222',
    departamento: 'Ciências Sociais e Humanas',
    titulacao: 'Mestre',
    regimeTrabalho: 'Tempo Parcial',
    cargaHoraria: 20,
    estado: 'ativo',
    cursos: ['Psicologia'],
    dataContratacao: '2020-08-01',
    ultimaAtividade: '2024-01-14'
  },
  {
    id: 3,
    numero: 'DOC-003',
    nome: 'Prof. Carlos Silva',
    email: 'carlos.silva@ispeka.edu.ao',
    telefone: '+244 923 333 333',
    departamento: 'Engenharia',
    titulacao: 'Doutor',
    regimeTrabalho: 'Tempo Integral',
    cargaHoraria: 40,
    estado: 'ativo',
    cursos: ['Engenharia Informática', 'Engenharia Civil'],
    dataContratacao: '2015-06-10',
    ultimaAtividade: '2024-01-13'
  },
  {
    id: 4,
    numero: 'DOC-004',
    nome: 'Dra. Ana Costa',
    email: 'ana.costa@ispeka.edu.ao',
    telefone: '+244 923 444 444',
    departamento: 'Saúde',
    titulacao: 'Doutor',
    regimeTrabalho: 'Tempo Integral',
    cargaHoraria: 40,
    estado: 'ativo',
    cursos: ['Enfermagem'],
    dataContratacao: '2019-11-20',
    ultimaAtividade: '2024-01-12'
  },
  {
    id: 5,
    numero: 'DOC-005',
    nome: 'Prof. Miguel Oliveira',
    email: 'miguel.oliveira@ispeka.edu.ao',
    telefone: '+244 923 555 555',
    departamento: 'Engenharia',
    titulacao: 'Mestre',
    regimeTrabalho: 'Tempo Parcial',
    cargaHoraria: 20,
    estado: 'licenca',
    cursos: ['Engenharia Mecânica'],
    dataContratacao: '2021-02-28',
    ultimaAtividade: '2023-12-20'
  },
  {
    id: 6,
    numero: 'DOC-006',
    nome: 'Dra. Luísa Fernandes',
    email: 'luisa.fernandes@ispeka.edu.ao',
    telefone: '+244 923 666 666',
    departamento: 'Ciências Sociais e Humanas',
    titulacao: 'Doutor',
    regimeTrabalho: 'Tempo Integral',
    cargaHoraria: 40,
    estado: 'ativo',
    cursos: ['Direito'],
    dataContratacao: '2017-09-15',
    ultimaAtividade: '2024-01-10'
  }
]

const departments = [
  'Todos os departamentos',
  'Ciências Sociais e Humanas',
  'Engenharia',
  'Saúde'
]

const statusOptions = [
  'Todos os estados',
  'ativo',
  'licenca',
  'aposentado',
  'inativo'
]

const titulacoes = [
  'Todas as titulações',
  'Licenciado',
  'Mestre',
  'Doutor',
  'PhD'
]

export default function DocentesPage() {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('Todos os departamentos')
  const [selectedStatus, setSelectedStatus] = useState('Todos os estados')
  const [selectedTitulacao, setSelectedTitulacao] = useState('Todas as titulações')
  const [showFilters, setShowFilters] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.nome.toLowerCase().includes(search.toLowerCase()) ||
                         teacher.numero.includes(search) ||
                         teacher.email.toLowerCase().includes(search.toLowerCase())
    const matchesDept = selectedDept === 'Todos os departamentos' || 
                       teacher.departamento === selectedDept
    const matchesStatus = selectedStatus === 'Todos os estados' || 
                         teacher.estado === selectedStatus
    const matchesTitulacao = selectedTitulacao === 'Todas as titulações' || 
                            teacher.titulacao === selectedTitulacao
    return matchesSearch && matchesDept && matchesStatus && matchesTitulacao
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Docentes</h1>
            <p className="text-gray-600">Gerencie docentes, carga horária e atribuições</p>
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
              href="/teachers/new"
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Docente
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Docentes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">86</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">+8 este ano</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Docentes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">78</p>
              <p className="text-xs text-gray-500">90.7% do total</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doutores</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">42</p>
              <p className="text-xs text-gray-500">48.8% dos ativos</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <Award className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Integral</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">65</p>
              <p className="text-xs text-gray-500">75.6% dos ativos</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/docentes/horarios"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Horários</span>
            <p className="text-sm text-gray-600 mt-1">Alocar aulas</p>
          </div>
        </a>

        <a
          href="/docentes/avaliacoes"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Avaliações</span>
            <p className="text-sm text-gray-600 mt-1">Avaliar desempenho</p>
          </div>
        </a>

        <a
          href="/docentes/relatorios"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Relatórios</span>
            <p className="text-sm text-gray-600 mt-1">Produção científica</p>
          </div>
        </a>

        <a
          href="/docentes/carga-horaria"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Carga Horária</span>
            <p className="text-sm text-gray-600 mt-1">Distribuir horas</p>
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
                  Departamento
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full input-field"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
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
                  Titulação
                </label>
                <select
                  value={selectedTitulacao}
                  onChange={(e) => setSelectedTitulacao(e.target.value)}
                  className="w-full input-field"
                >
                  {titulacoes.map(titulacao => (
                    <option key={titulacao} value={titulacao}>
                      {titulacao}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regime de Trabalho
                </label>
                <select className="w-full input-field">
                  <option>Todos os regimes</option>
                  <option>Tempo Integral</option>
                  <option>Tempo Parcial</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="table-header">
                  Número
                </th>
                <th scope="col" className="table-header">
                  Docente
                </th>
                <th scope="col" className="table-header">
                  Departamento
                </th>
                <th scope="col" className="table-header">
                  Titulação
                </th>
                <th scope="col" className="table-header">
                  Regime
                </th>
                <th scope="col" className="table-header">
                  Estado
                </th>
                <th scope="col" className="table-header">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {teacher.numero}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {teacher.nome.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {teacher.email}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {teacher.telefone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{teacher.departamento}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {teacher.cursos.length} curso(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.titulacao === 'Doutor' || teacher.titulacao === 'PhD'
                        ? 'bg-purple-100 text-purple-800'
                        : teacher.titulacao === 'Mestre'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {teacher.titulacao}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.regimeTrabalho}
                        </div>
                        <div className="text-xs text-gray-500">
                          {teacher.cargaHoraria}h semanais
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.estado === 'ativo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : teacher.estado === 'licenca'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {teacher.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/teachers/${teacher.id}/details`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      <a
                        href={`/teachers/${teacher.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </a>
                      <button
                        className="text-red-600 hover:text-red-900 p-1"
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
              <span className="font-medium">{filteredTeachers.length}</span> de{' '}
              <span className="font-medium">{teachers.length}</span> docentes
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
      {filteredTeachers.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum docente encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Não foram encontrados docentes com os filtros aplicados.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setSearch('')
                setSelectedDept('Todos os departamentos')
                setSelectedStatus('Todos os estados')
                setSelectedTitulacao('Todas as titulações')
              }}
              className="btn-primary"
            >
              Limpar filtros
            </button>
            <a
              href="/docentes/novo"
              className="btn-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Docente
            </a>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Importar Docentes</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
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
                Formato: Nome, Email, Telefone, Departamento, Titulação
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Use o template disponível para download
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                Departamentos devem existir no sistema
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