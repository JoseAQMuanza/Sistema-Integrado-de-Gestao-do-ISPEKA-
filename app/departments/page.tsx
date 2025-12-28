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
  BookOpen,
  Building2,
  ChevronDown,
  Upload,
  Star,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,  
} from 'lucide-react'
import HeaderPage from '@/components/ui/header-page'

// Dados mockados dos departamentos
import { departments } from "@/lib/utilities/departments-utilities"
import StatsGrid from '@/components/departments/stats-grid'
import QuickActions from '@/components/dashboard/quick-actions'
import Filters from '@/components/departments/filters'

export default function DepartamentsPage() {
  const [search, setSearch] = useState('')
  const [selectedArea, setSelectedArea] = useState('Todas as áreas')
  const [selectedStatus, setSelectedStatus] = useState('Todos os estados')
  
  const [showImportModal, setShowImportModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.nome.toLowerCase().includes(search.toLowerCase()) ||
                         dept.codigo.toLowerCase().includes(search.toLowerCase()) ||
                         dept.chefe.toLowerCase().includes(search.toLowerCase())
    const matchesArea = selectedArea === 'Todas as áreas' || 
                       dept.areaCientifica === selectedArea
    const matchesStatus = selectedStatus === 'Todos os estados' || 
                         dept.estado === selectedStatus
    return matchesSearch && matchesArea && matchesStatus
  })

 

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { text: string, color: string }> = {
      'ativo': { text: 'Ativo', color: 'emerald' },
      'inativo': { text: 'Inativo', color: 'red' },
      'em_reestruturacao': { text: 'Reestruturação', color: 'amber' },
      'em_implementacao': { text: 'Implementação', color: 'blue' }
    }
    return statusMap[status] || { text: status, color: 'gray' }
  }

  const handleDelete = (id: number) => {
    // Simulação de delete
    console.log('Deletar departamento:', id)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Page*/}
      <HeaderPage 
        headerTitle='Gestão de Departamentos' 
        discriptions='Gerencie departamentos acadêmicos e suas estruturas'
        pageName='Departamento'
        showExportButton={true}
      />
      
      {/* Stats */}
      <StatsGrid />

      {/* Quick Actions */}
      <QuickActions />

      {/* Filters */}
      <Filters />

      {/* Departments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="table-header">
                  Código
                </th>
                <th scope="col" className="table-header">
                  Departamento
                </th>
                <th scope="col" className="table-header">
                  Chefe
                </th>
                <th scope="col" className="table-header">
                  Estatísticas
                </th>
                <th scope="col" className="table-header">
                  Avaliação
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
              {filteredDepartments.map((dept) => {
                const status = getStatusText(dept.estado)
                return (
                  <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-blue-600">
                        {dept.codigo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {dept.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {dept.areaCientifica}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{dept.chefe}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{dept.numeroDocentes}</div>
                          <div className="text-xs text-gray-500">Docentes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{dept.numeroCursos}</div>
                          <div className="text-xs text-gray-500">Cursos</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {dept.numeroEstudantes.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Estudantes</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className={`w-4 h-4 mr-1 ${
                          dept.avaliacaoQualidade >= 4.5 ? 'text-amber-500 fill-amber-500' :
                          dept.avaliacaoQualidade >= 4.0 ? 'text-amber-400 fill-amber-400' :
                          'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          dept.avaliacaoQualidade >= 4.5 ? 'text-amber-600' :
                          dept.avaliacaoQualidade >= 4.0 ? 'text-amber-500' :
                          'text-gray-600'
                        }`}>
                          {dept.avaliacaoQualidade}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/5.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/departamentos/${dept.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Visualizar"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <a
                          href={`/departamentos/${dept.id}/editar`}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirm(dept.id)}
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
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Mostrando <span className="font-medium">1</span> a{' '}
              <span className="font-medium">{filteredDepartments.length}</span> de{' '}
              <span className="font-medium">{departments.length}</span> departamentos
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
      {filteredDepartments.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum departamento encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Não foram encontrados departamentos com os filtros aplicados.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setSearch('')
                setSelectedArea('Todas as áreas')
                setSelectedStatus('Todos os estados')
              }}
              className="btn-primary"
            >
              Limpar filtros
            </button>
            <a
              href="/departamentos/novo"
              className="btn-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Departamento
            </a>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Importar Departamentos</h3>
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
                Formato: Código, Nome, Área, Chefe, Estado
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Use o template disponível para download
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                Chefes devem existir no sistema
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir Departamento</h3>
                <p className="text-sm text-gray-600">Esta ação requer confirmação</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir este departamento? 
              Esta ação pode afetar cursos, docentes e estudantes associados.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Excluir Departamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}