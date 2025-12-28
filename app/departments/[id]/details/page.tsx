'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Edit, Download, Printer, Mail, Phone,
  Calendar, MapPin, Building2, Users, BookOpen, FileText,
  BarChart3, DollarSign, User, AlertCircle, Clock, Award,
  Eye, MoreVertical, GraduationCap, Target, TrendingUp, Star
} from 'lucide-react'

// Dados do departamento (reduzido mas completo)
const departmentData = {
  id: 1,
  codigo: 'CSH',
  nome: 'Ciências Sociais e Humanas',
  areaCientifica: 'Humanidades',
  chefe: 'Dr. João Silva',
  viceChefe: 'Prof. Maria Santos',
  telefone: '+244 923 456 789',
  email: 'csh@ispeka.edu.ao',
  endereco: 'Edifício Central, 2º Andar',
  dataCriacao: '2010-03-15',
  orcamento: 12500000,
  docentes: 45,
  cursos: 8,
  estudantes: 1250,
  estado: 'ativo',
  avaliacaoQualidade: 4.8,
  missao: 'Formar profissionais qualificados em ciências humanas.',
  visao: 'Ser referência nacional em ensino e pesquisa.',
  ultimaAuditoria: '2023-11-20'
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Eye },
  { id: 'structure', label: 'Estrutura', icon: Building2 },
  { id: 'academic', label: 'Académico', icon: GraduationCap },
  { id: 'quality', label: 'Qualidade', icon: Star },
  { id: 'documents', label: 'Documentos', icon: FileText },
]

const recentCourses = [
  { nome: 'Direito', coordenador: 'Dr. Silva', estudantes: 320, estado: 'ativo' },
  { nome: 'Psicologia', coordenador: 'Dra. Costa', estudantes: 280, estado: 'ativo' },
  { nome: 'Economia', coordenador: 'Prof. Mendes', estudantes: 250, estado: 'ativo' },
]

const qualityIndicators = [
  { nome: 'Taxa de Aprovação', valor: '87%', meta: '85%', status: 'atingida' },
  { nome: 'Satisfação Estudantes', valor: '4.5/5.0', meta: '4.3', status: 'excedida' },
  { nome: 'Publicações', valor: '24', meta: '20', status: 'atingida' },
]

export default function DepartmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const dept = departmentData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dept.nome}</h1>
            <p className="text-gray-600">Código: {dept.codigo}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </button>
          <Link href={`/departamentos/${params.id}/editar`} className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="w-5 h-5 text-emerald-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Departamento Ativo</h3>
              <p className="text-sm text-gray-600">Em funcionamento normal</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
            {dept.estado}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna Esquerda - Perfil */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card Perfil */}
          <div className="bg-white rounded-xl border p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{dept.nome}</h2>
              <p className="text-gray-600 mb-2">{dept.codigo}</p>
              <p className="text-sm text-gray-500">{dept.areaCientifica}</p>
              
              <div className="mt-4 flex justify-center space-x-4">
                <a href={`mailto:${dept.email}`} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5" />
                </a>
                <a href={`tel:${dept.telefone}`} className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-3">Informações de Contacto</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <a href={`mailto:${dept.email}`} className="text-blue-600 hover:text-blue-800">
                    {dept.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{dept.telefone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{dept.endereco}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Estatísticas */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{dept.docentes}</p>
                  <p className="text-xs text-gray-600">Docentes</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{dept.cursos}</p>
                  <p className="text-xs text-gray-600">Cursos</p>
                </div>
              </div>
              <div className="text-center p-3 bg-violet-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dept.estudantes.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Estudantes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Conteúdo */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border">
            <div className="border-b">
              <nav className="flex overflow-x-auto -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Visão Geral */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { icon: Calendar, label: 'Data Criação', value: new Date(dept.dataCriacao).toLocaleDateString('pt-AO') },
                      { icon: DollarSign, label: 'Orçamento', value: dept.orcamento.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) },
                      { icon: User, label: 'Chefe', value: dept.chefe },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <item.icon className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </div>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Missão e Visão */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Missão</h3>
                      <p className="text-gray-700">{dept.missao}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Visão</h3>
                      <p className="text-gray-700">{dept.visao}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Estrutura */}
              {activeTab === 'structure' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Liderança</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <User className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-gray-900">Chefe do Departamento</span>
                        </div>
                        <p className="text-gray-900">{dept.chefe}</p>
                        <p className="text-sm text-gray-600 mt-1">Responsável máximo</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Users className="w-5 h-5 text-emerald-600 mr-2" />
                          <span className="font-medium text-gray-900">Vice-Chefe</span>
                        </div>
                        <p className="text-gray-900">{dept.viceChefe}</p>
                        <p className="text-sm text-gray-600 mt-1">Substituto legal</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipa Docente</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-gray-900">{dept.docentes} Docentes</p>
                          <p className="text-sm text-gray-600">Equipa completa do departamento</p>
                        </div>
                        <Link href={`/docentes?departamento=${dept.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Ver todos →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Professores Catedráticos', 'Professores Associados', 'Professores Auxiliares'].map((cat, i) => (
                          <div key={i} className="text-center p-3 bg-white rounded-lg border">
                            <p className="text-lg font-bold text-gray-900">{Math.floor(dept.docentes / 3) + i}</p>
                            <p className="text-sm text-gray-600">{cat}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Acadêmico */}
              {activeTab === 'academic' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Cursos do Departamento</h3>
                    <Link href="/cursos/novo" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Curso
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recentCourses.map((curso, i) => (
                      <div key={i} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">{curso.nome}</h4>
                              <p className="text-sm text-gray-600">Coordenador: {curso.coordenador}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                            {curso.estado}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{curso.estudantes} estudantes</span>
                          <Link href={`/cursos/1`} className="text-blue-600 hover:text-blue-800 font-medium">
                            Ver detalhes →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Acadêmicas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Taxa de Aprovação', value: '87%', icon: TrendingUp },
                        { label: 'Trabalhos Publicados', value: '45', icon: FileText },
                        { label: 'Projetos de Pesquisa', value: '12', icon: Target },
                      ].map((stat, i) => (
                        <div key={i} className="border rounded-lg p-4 text-center">
                          <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Qualidade */}
              {activeTab === 'quality' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliação de Qualidade</h3>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-emerald-600 mr-3" />
                        <div>
                          <p className="font-medium text-emerald-900">Avaliação Geral: {dept.avaliacaoQualidade}/5.0</p>
                          <p className="text-sm text-emerald-700">Última auditoria: {new Date(dept.ultimaAuditoria).toLocaleDateString('pt-AO')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Indicadores de Desempenho</h4>
                    <div className="space-y-4">
                      {qualityIndicators.map((ind, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{ind.nome}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              ind.status === 'excedida' ? 'bg-emerald-100 text-emerald-800' :
                              ind.status === 'atingida' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ind.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-gray-600">Valor: </span>
                              <span className="font-medium">{ind.valor}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Meta: </span>
                              <span className="font-medium">{ind.meta}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Documentos */}
              {activeTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Documentos do Departamento</h3>
                    <button className="btn-primary">
                      <Upload className="w-4 h-4 mr-2" />
                      Carregar
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { nome: 'Regulamento Interno', tipo: 'Regulamentar', data: '2023-01-15' },
                      { nome: 'Relatório Anual 2023', tipo: 'Relatório', data: '2024-01-10' },
                      { nome: 'Plano Estratégico', tipo: 'Planejamento', data: '2022-09-30' },
                    ].map((doc, i) => (
                      <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{doc.nome}</h4>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{doc.tipo}</span>
                          <span>{new Date(doc.data).toLocaleDateString('pt-AO')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar Link (simplificado)
import NextLink from 'next/link'

function Link({ href, children, className = '', ...props }: any) {
  return (
    <NextLink href={href} className={`text-blue-600 hover:text-blue-800 ${className}`} {...props}>
      {children}
    </NextLink>
  )
}

// Componente auxiliar Plus (adicionado)
function Plus(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}

// Componente auxiliar Upload (adicionado)
function Upload(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  )
}