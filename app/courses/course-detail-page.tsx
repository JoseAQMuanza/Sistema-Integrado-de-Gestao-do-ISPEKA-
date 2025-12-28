'use client'

type CourseDetailPageProps = {
  courseId: number
}
import { useState } from 'react'
import {
  ArrowLeft,
  Edit,
  Download,
  Printer,
  Share2,
  MoreVertical,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Building2,
  Calendar,
  Award,
  FileText,
  BarChart3,
  BookMarked,
  UserCheck
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { curriculum , tabs, courseData} from './courses-utilities'

export default function CourseDetailPage( {courseId }: CourseDetailPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState(false)

  const course = courseData[courseId] // Em produção, buscaria pelo ID dos params  

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.nome}</h1>
            <p className="text-gray-600">Código: {course.codigo}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <a
            href={`/cursos/${courseId}/editar`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Curso
          </a>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                    <Share2 className="w-4 h-4 mr-3" />
                    Compartilhar
                  </button>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                    <FileText className="w-4 h-4 mr-3" />
                    Gerar Relatório
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <Edit className="w-4 h-4 mr-3" />
                    Arquivar Curso
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl p-4 ${
        course.estado === 'ativo' 
          ? 'bg-emerald-50 border border-emerald-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${
              course.estado === 'ativo' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Curso {course.estado === 'ativo' ? 'Ativo' : 'Inativo'}
              </h3>
              <p className="text-sm text-gray-600">
                {course.estado === 'ativo' 
                  ? 'Este curso está atualmente ativo e aceitando matrículas.' 
                  : 'Este curso não está aceitando novas matrículas.'}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.estado === 'ativo' 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {course.estado}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Course Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Curso</h2>
                <p className="text-gray-600 mb-6">{course.descricao}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Departamento</span>
                    </div>
                    <p className="text-gray-900 font-medium">{course.departamento}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Duração</span>
                    </div>
                    <p className="text-gray-900 font-medium">{course.duracao} anos</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Award className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Grau</span>
                    </div>
                    <p className="text-gray-900 font-medium">{course.grau}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Ano de Criação</span>
                    </div>
                    <p className="text-gray-900 font-medium">{course.anoCriacao}</p>
                  </div>
                </div>
              </div>

              {/* Coordinator Info */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Coordenador do Curso</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold">
                      {course.coordenador.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.coordenador}</p>
                    <p className="text-sm text-gray-600">{course.emailCoordenador}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Total de Estudantes</span>
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{course.totalEstudantes}</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Estudantes Ativos</span>
                      <UserCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{course.estudantesAtivos}</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Taxa de Retenção</span>
                      <BarChart3 className="w-5 h-5 text-violet-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">92.5%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Plano Curricular</h2>
                <button className="btn-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Plano
                </button>
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(ano => (
                  <div key={ano} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3">
                      <h3 className="font-semibold text-gray-900">{ano}º Ano</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {curriculum
                        .filter(disc => disc.ano === ano)
                        .map((disciplina, index) => (
                          <div key={index} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{disciplina.disciplina}</p>
                                <div className="flex items-center mt-1 space-x-4">
                                  <span className="text-sm text-gray-600">
                                    {disciplina.semestre}º Semestre
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {disciplina.creditos} créditos
                                  </span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                disciplina.tipo === 'Obrigatória'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {disciplina.tipo}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Estudantes Matriculados</h2>
                <button className="btn-primary">
                  <Users className="w-4 h-4 mr-2" />
                  Nova Matrícula
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Lista de Estudantes
                </h3>
                <p className="text-gray-600">
                  Em desenvolvimento. Aqui será exibida a lista completa de estudantes.
                </p>
              </div>
            </div>
          )}

          {/* Outras tabs placeholder */}
          {!['overview', 'curriculum', 'students'].includes(activeTab) && (
            <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
              <div className="inline-flex p-3 bg-blue-100 rounded-lg mb-4">
                {(() => {
                  const Icon = tabs.find(t => t.id === activeTab)?.icon || BookOpen
                  return <Icon className="h-8 w-8 text-blue-600" />
                })()}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-600">
                Esta funcionalidade está em desenvolvimento e estará disponível em breve.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}