import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,
  Users,
  Clock,
} from 'lucide-react'
import { useState } from 'react'
import { courses } from './courses-utilities'

export default function CoursesTable() {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('Todos os departamentos')
  const [selectedStatus, setSelectedStatus] = useState('Todos os estados')


  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.nome.toLowerCase().includes(search.toLowerCase()) ||
      course.codigo.toLowerCase().includes(search.toLowerCase())
    const matchesDept = selectedDept === 'Todos os departamentos' ||
      course.departamento === selectedDept
    const matchesStatus = selectedStatus === 'Todos os estados' ||
      course.estado === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })
  return (
    <>
      {/* Courses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-500">
              <tr>
                <th scope="col" className="table-header">
                  Código
                </th>
                <th scope="col" className="table-header">
                  Nome do Curso
                </th>
                <th scope="col" className="table-header">
                  Departamento
                </th>
                <th scope="col" className="table-header">
                  Duração
                </th>
                <th scope="col" className="table-header">
                  Estudantes
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
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {course.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.grau} • {course.regime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.departamento}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {course.duracao} anos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {course.estudantes}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.estado === 'ativo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {course.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/courses/${course.id}/details`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      <a
                        href={`/courses/${course.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer"
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
              <span className="font-medium">{filteredCourses.length}</span> de{' '}
              <span className="font-medium">{courses.length}</span> cursos
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
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum curso encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Não foram encontrados cursos com os filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedDept('Todos os departamentos')
              setSelectedStatus('Todos os estados')
            }}
            className="btn-primary"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </>
  )
}