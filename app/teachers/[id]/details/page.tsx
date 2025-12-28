'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Edit,
  Download,
  Printer,
  Share2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  CreditCard,
  User,
  AlertCircle,
  Clock,
  Award,
  Building2,
  Shield,
  Eye,
  MoreVertical,
  IdCard,
  Camera,
  Briefcase,
  DollarSign,
  Globe,
  Book,
  Brain,
  TrendingUp,
  Star,
  Target,
  CheckCircle,
  XCircle,
  Clock4,
  Users as UsersIcon,
  Upload
} from 'lucide-react'

// Dados mockados do docente
const teacherData = {
  id: 1,
  numeroFuncionario: 'DOC-2024001',
  nome: 'Dr. João Mendes',
  tituloProfissional: 'Dr.',
  email: 'joao.mendes@ispeka.edu.ao',
  telefone: '+244 923 456 789',
  telefoneAlternativo: '+244 923 456 780',
  dataNascimento: '1975-08-22',
  genero: 'M',
  estadoCivil: 'Casado',
  nacionalidade: 'Angolana',
  naturalidade: 'Luanda',
  numeroBI: '123456789LA123',
  nuit: '123456789',
  endereco: 'Av. 4 de Fevereiro, 123',
  bairro: 'Alvalade',
  municipio: 'Luanda',
  provincia: 'Luanda',
  
  // Dados profissionais
  categoria: 'Professor Associado',
  regimeContratacao: 'Tempo Integral',
  dataAdmissao: '2015-09-01',
  tipoContrato: 'Efetivo',
  salarioBase: 350000,
  estado: 'ativo',
  
  // Formação académica
  grauAcademico: 'Doutoramento',
  instituicaoFormacao: 'Universidade de Lisboa',
  anoConclusao: '2014',
  areaEspecializacao: 'Direito Constitucional',
  
  // Departamentos e cursos
  departamento: {
    id: '1',
    nome: 'Ciências Sociais e Humanas',
    sigla: 'CSH'
  },
  cursos: [
    { id: '1', nome: 'Direito' },
    { id: '5', nome: 'Psicologia' }
  ],
  
  // Informações adicionais
  experienciaAnos: 15,
  idiomas: ['Português', 'Inglês', 'Francês'],
  avaliacaoMedia: 4.5,
  cargaHorariaSemanal: 40,
  necessidadesEspeciais: 'Nenhuma',
  observacoes: 'Coordenador do curso de Direito. Publicou 3 livros e 12 artigos científicos.',
  
  // Dados bancários
  banco: 'BFA',
  numeroConta: '123456789012',
  nib: '000123456789012345678',
  
  // Histórico
  dataCriacao: '2015-08-15',
  ultimaAtividade: '2024-01-15',
  createdAt: '2015-08-15',
  updatedAt: '2024-01-15'
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Eye },
  { id: 'professional', label: 'Profissional', icon: Briefcase },
  { id: 'academic', label: 'Académico', icon: GraduationCap },
  { id: 'courses', label: 'Cursos', icon: Book },
  { id: 'evaluation', label: 'Avaliações', icon: Star },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'financial', label: 'Financeiro', icon: CreditCard },
]

const recentEvaluations = [
  { semestre: '2023/2', disciplina: 'Direito Civil', media: 4.7, alunos: 45, data: '2024-01-10' },
  { semestre: '2023/2', disciplina: 'Direito Penal', media: 4.3, alunos: 42, data: '2024-01-08' },
  { semestre: '2023/1', disciplina: 'Direito Constitucional', media: 4.8, alunos: 38, data: '2023-07-15' },
  { semestre: '2023/1', disciplina: 'Filosofia do Direito', media: 4.5, alunos: 40, data: '2023-07-10' },
]

const financialTransactions = [
  { id: 1, descricao: 'Salário Jan/2024', valor: 350000, data: '2024-01-31', tipo: 'saída' },
  { id: 2, descricao: 'Subsídio de Natal', valor: 350000, data: '2023-12-15', tipo: 'saída' },
  { id: 3, descricao: 'Salário Dez/2023', valor: 350000, data: '2023-12-31', tipo: 'saída' },
]

const documents = [
  { nome: 'Cópia do BI', tipo: 'Identificação', dataUpload: '2015-09-01', tamanho: '2.1 MB' },
  { nome: 'Curriculum Vitae', tipo: 'Profissional', dataUpload: '2023-08-15', tamanho: '3.5 MB' },
  { nome: 'Certificado de Doutoramento', tipo: 'Académico', dataUpload: '2015-09-01', tamanho: '4.2 MB' },
  { nome: 'Contrato de Trabalho', tipo: 'Contratual', dataUpload: '2023-09-01', tamanho: '2.8 MB' },
  { nome: 'Comprovativo Bancário', tipo: 'Financeiro', dataUpload: '2023-09-01', tamanho: '1.2 MB' },
]

const weeklySchedule = [
  { dia: 'Segunda', horarios: '08:00 - 12:00', disciplina: 'Direito Civil', sala: 'S201' },
  { dia: 'Terça', horarios: '14:00 - 18:00', disciplina: 'Direito Penal', sala: 'S205' },
  { dia: 'Quarta', horarios: '10:00 - 12:00', disciplina: 'Orientação TCC', sala: 'Gabinete 3' },
  { dia: 'Quinta', horarios: '08:00 - 12:00', disciplina: 'Direito Constitucional', sala: 'S201' },
  { dia: 'Sexta', horarios: '14:00 - 16:00', disciplina: 'Reunião Departamental', sala: 'Sala Reuniões' },
]

export default function TeacherDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState(false)
  const [photoUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80')

  const teacher = teacherData

  const getGenderText = (genero: string) => {
    return genero === 'M' ? 'Masculino' : genero === 'F' ? 'Feminino' : 'Outro'
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    })
  }

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{teacher.nome}</h1>
            <p className="text-gray-600">Número: {teacher.numeroFuncionario}</p>
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
            href={`/docentes/${params.id}/editar`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Docente
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
                    <Mail className="w-4 h-4 mr-3" />
                    Enviar Email
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <Edit className="w-4 h-4 mr-3" />
                    Desativar Docente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl p-4 ${
        teacher.estado === 'ativo' 
          ? 'bg-emerald-50 border border-emerald-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${
              teacher.estado === 'ativo' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Docente {teacher.estado === 'ativo' ? 'Ativo' : 'Inativo'}
              </h3>
              <p className="text-sm text-gray-600">
                {teacher.estado === 'ativo' 
                  ? 'Atualmente em funções ativas.' 
                  : 'Não está atualmente em funções activas.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              teacher.estado === 'ativo' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {teacher.estado}
            </span>
            
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {teacher.categoria}
            </span>
            
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
              {teacher.grauAcademico}
            </span>
            
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              {teacher.regimeContratacao}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da Esquerda - Perfil */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card Perfil */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={photoUrl}
                  alt={teacher.nome}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{teacher.nome}</h2>
              <p className="text-gray-600 mb-2">{teacher.numeroFuncionario}</p>
              <p className="text-sm text-gray-500">{teacher.categoria}</p>
              
              <div className="mt-4 flex items-center justify-center space-x-4">
                <a
                  href={`mailto:${teacher.email}`}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Enviar email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={`tel:${teacher.telefone}`}
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  title="Ligar"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href={`/docentes/${params.id}/editar`}
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Informação de Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:text-blue-800">
                    {teacher.email}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{teacher.telefone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{teacher.endereco}, {teacher.bairro}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Departamentos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 text-gray-400 mr-2" />
              Departamento
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{teacher.departamento.nome}</p>
                    <p className="text-sm text-gray-600">{teacher.departamento.sigla}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cursos Lecionados</p>
                <div className="space-y-2">
                  {teacher.cursos.map(curso => (
                    <div key={curso.id} className="flex items-center p-2 bg-gray-50 rounded">
                      <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{curso.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card Estatísticas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-gray-400 mr-2" />
              Estatísticas
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Avaliação Média</span>
                  <span className="text-sm font-bold text-gray-900">{teacher.avaliacaoMedia}/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${(teacher.avaliacaoMedia / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{teacher.experienciaAnos}</p>
                  <p className="text-xs text-gray-600">Anos de Experiência</p>
                </div>
                
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{teacher.cargaHorariaSemanal}</p>
                  <p className="text-xs text-gray-600">Horas/Semana</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Idiomas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 text-gray-400 mr-2" />
              Idiomas
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {teacher.idiomas.map(idioma => (
                <span key={idioma} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {idioma}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna da Direita - Conteúdo Principal */}
        <div className="lg:col-span-3 space-y-6">
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
              {/* Visão Geral */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <IdCard className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Documentação</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">BI:</span>{' '}
                          <span className="font-medium">{teacher.numeroBI}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">NUIT:</span>{' '}
                          <span className="font-medium">{teacher.nuit}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Dados Pessoais</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Data Nasc.:</span>{' '}
                          <span className="font-medium">
                            {new Date(teacher.dataNascimento).toLocaleDateString('pt-AO')}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Idade:</span>{' '}
                          <span className="font-medium">
                            {new Date().getFullYear() - new Date(teacher.dataNascimento).getFullYear()} anos
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Género:</span>{' '}
                          <span className="font-medium">{getGenderText(teacher.genero)}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Estado Civil:</span>{' '}
                          <span className="font-medium">{teacher.estadoCivil}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Localização</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Província:</span>{' '}
                          <span className="font-medium">{teacher.provincia}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Município:</span>{' '}
                          <span className="font-medium">{teacher.municipio}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Bairro:</span>{' '}
                          <span className="font-medium">{teacher.bairro}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Horário Semanal */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Horário Semanal</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dia
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Horário
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Disciplina
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sala
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {weeklySchedule.map((schedule, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-medium">{schedule.dia}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {schedule.horarios}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="font-medium">{schedule.disciplina}</span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {schedule.sala}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Informações Profissionais */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Profissionais</h3>
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Data de Admissão</span>
                          <p className="font-medium">
                            {new Date(teacher.dataAdmissao).toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Tempo de Serviço</span>
                          <p className="font-medium">
                            {new Date().getFullYear() - new Date(teacher.dataAdmissao).getFullYear()} anos
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Salário Base</span>
                          <p className="font-medium">{formatCurrency(teacher.salarioBase)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Necessidades Especiais</h4>
                        <p className="text-gray-600">{teacher.necessidadesEspeciais}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                        <p className="text-gray-600">{teacher.observacoes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profissional */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações Contratuais */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Contratuais</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Categoria</span>
                            <Award className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{teacher.categoria}</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Regime de Contratação</span>
                            <Clock className="w-5 h-5 text-emerald-500" />
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{teacher.regimeContratacao}</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Tipo de Contrato</span>
                            <FileText className="w-5 h-5 text-violet-500" />
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{teacher.tipoContrato}</p>
                        </div>
                      </div>
                    </div>

                    {/* Estatísticas Profissionais */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Profissionais</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Experiência</span>
                              <Calendar className="w-5 h-5 text-amber-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{teacher.experienciaAnos} anos</p>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Carga Horária</span>
                              <Clock4 className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{teacher.cargaHorariaSemanal}h/semana</p>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Número de Cursos</span>
                            <Book className="w-5 h-5 text-emerald-500" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{teacher.cursos.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Histórico Profissional */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Profissional</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="border-l-4 border-blue-500 pl-4 py-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {i === 1 && 'Professor Auxiliar - ISPEKA (2015-2018)'}
                                {i === 2 && 'Professor Assistente - ISPEKA (2018-2021)'}
                                {i === 3 && 'Professor Associado - ISPEKA (2021-Presente)'}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {i === 1 && 'Início da carreira docente na instituição.'}
                                {i === 2 && 'Promovido a Professor Assistente após três anos de serviço.'}
                                {i === 3 && 'Promovido a Professor Associado após obtenção de doutoramento.'}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {i === 1 && '3 anos'}
                              {i === 2 && '3 anos'}
                              {i === 3 && '3+ anos'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Acadêmico */}
              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Formação Acadêmica */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Formação Acadêmica</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                            <div>
                              <p className="font-medium text-gray-900">{teacher.grauAcademico}</p>
                              <p className="text-sm text-gray-600">{teacher.instituicaoFormacao}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Ano:</span>
                              <p className="font-medium">{teacher.anoConclusao}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Área:</span>
                              <p className="font-medium">{teacher.areaEspecializacao}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Formações Adicionais */}
                        {[1, 2].map(i => (
                          <div key={i} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {i === 1 ? 'Mestrado em Direito' : 'Licenciatura em Direito'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {i === 1 ? 'Universidade Agostinho Neto' : 'Universidade Católica de Angola'}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="text-gray-500">Concluído em:</span>{' '}
                              <span className="font-medium">{i === 1 ? '2010' : '2007'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Publicações e Produção Científica */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Produção Científica</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Livros Publicados</span>
                            <Book className="w-5 h-5 text-emerald-500" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Artigos Científicos</span>
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Orientações de TCC</span>
                            <UsersIcon className="w-5 h-5 text-violet-500" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">24</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Idiomas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Idiomas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {teacher.idiomas.map((idioma, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                          <div className="flex justify-center mb-2">
                            <Globe className="w-8 h-8 text-blue-500" />
                          </div>
                          <p className="font-medium text-gray-900">{idioma}</p>
                          <p className="text-sm text-gray-600 mt-1">Nível: Fluente</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cursos */}
              {activeTab === 'courses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Cursos Lecionados</h3>
                    <button className="btn-primary">
                      <Book className="w-4 h-4 mr-2" />
                      Atribuir Novo Curso
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teacher.cursos.map((curso, index) => (
                      <div key={curso.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{curso.nome}</h4>
                              <p className="text-sm text-gray-600">{teacher.departamento.nome}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Ativo
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600">Disciplinas</span>
                            <p className="font-medium">4</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Turmas</span>
                            <p className="font-medium">3</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Alunos</span>
                            <p className="font-medium">125</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Horas/Semana</span>
                            <p className="font-medium">12</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Disciplinas Ministradas</h5>
                          <div className="space-y-2">
                            {[
                              { nome: 'Direito Civil I', semestre: '1º Semestre' },
                              { nome: 'Direito Penal I', semestre: '1º Semestre' },
                              { nome: 'Direito Constitucional', semestre: '2º Semestre' },
                              { nome: 'Filosofia do Direito', semestre: '2º Semestre' },
                            ].slice(0, index + 2).map((disciplina, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span>{disciplina.nome}</span>
                                <span className="text-gray-500">{disciplina.semestre}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Ver Detalhes
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                              Horário
                            </a>
                          </div>
                          <button className="text-gray-600 hover:text-gray-800">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Cursos Anteriores */}
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Cursos Anteriores</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Curso
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Período
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Disciplinas
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[
                            { curso: 'Direito', periodo: '2022/2023', disciplinas: 4, estado: 'Concluído' },
                            { curso: 'Economia', periodo: '2021/2022', disciplinas: 2, estado: 'Concluído' },
                          ].map((curso, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-medium">{curso.curso}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {curso.periodo}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                  {curso.disciplinas} disciplinas
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                                  {curso.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Avaliações */}
              {activeTab === 'evaluation' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Avaliações dos Estudantes</h3>
                    <button className="btn-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Relatório
                    </button>
                  </div>
                  
                  {/* Estatísticas de Avaliação */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Avaliação Média</span>
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex items-end">
                        <p className="text-3xl font-bold text-gray-900">{teacher.avaliacaoMedia}</p>
                        <span className="text-sm text-gray-600 ml-2 mb-1">/5.0</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-medium mt-2">+0.2 desde o último semestre</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Taxa de Resposta</span>
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">78%</p>
                      <p className="text-xs text-gray-600 mt-2">145/186 estudantes</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Recomendariam</span>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">92%</p>
                      <p className="text-xs text-gray-600 mt-2">134/145 respostas</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Melhoria Necessária</span>
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">8%</p>
                      <p className="text-xs text-gray-600 mt-2">11/145 respostas</p>
                    </div>
                  </div>

                  {/* Avaliações Recentes */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Avaliações Recentes por Disciplina</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Semestre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Disciplina
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Avaliação Média
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nº de Alunos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Detalhes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentEvaluations.map((evaluation, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {evaluation.semestre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {evaluation.disciplina}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className={`text-lg font-bold ${
                                    evaluation.media >= 4.5 ? 'text-emerald-600' :
                                    evaluation.media >= 4.0 ? 'text-amber-600' : 'text-red-600'
                                  }`}>
                                    {evaluation.media}
                                  </span>
                                  <span className="text-sm text-gray-600 ml-1">/5.0</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {evaluation.alunos}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {new Date(evaluation.data).toLocaleDateString('pt-AO')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900">
                                  Ver Relatório
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Comentários dos Estudantes */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Comentários dos Estudantes</h4>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {i === 1 && '"Excelente professor, muito claro nas explicações."'}
                                {i === 2 && '"Domina muito bem o conteúdo da disciplina."'}
                                {i === 3 && '"Disponível para tirar dúvidas fora da aula."'}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {i === 1 && 'Estudante de Direito, 2023/2'}
                                {i === 2 && 'Estudante de Psicologia, 2023/2'}
                                {i === 3 && 'Estudante de Direito, 2023/1'}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="ml-1 font-medium">{i === 1 ? '5.0' : i === 2 ? '4.5' : '4.8'}</span>
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
                    <h3 className="text-lg font-semibold text-gray-900">Documentos do Docente</h3>
                    <button className="btn-primary">
                      <Upload className="w-4 h-4 mr-2" />
                      Carregar Documento
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">{doc.nome}</h4>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{doc.tipo}</span>
                          <span>{doc.tamanho}</span>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(doc.dataUpload).toLocaleDateString('pt-AO')}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Documentos Pendentes</h4>
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                          <div>
                            <p className="font-medium text-amber-900">Atualização do CV</p>
                            <p className="text-sm text-amber-700">Prazo: 28 Fev 2024</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <p className="font-medium text-blue-900">Relatório de Atividades 2023</p>
                            <p className="text-sm text-blue-700">Prazo: 15 Mar 2024</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financeiro */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Salário Base</span>
                        <DollarSign className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(teacher.salarioBase)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Bruto mensal</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Próximo Pagamento</span>
                        <Calendar className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date().toLocaleDateString('pt-AO', { 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Salário de Janeiro</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Dias de Férias</span>
                        <Clock className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">22</p>
                      <p className="text-sm text-gray-600 mt-1">Disponíveis</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Bancários</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Banco</span>
                          <p className="font-medium">{teacher.banco}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Número da Conta</span>
                          <p className="font-medium">{teacher.numeroConta}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">NIB</span>
                          <p className="font-medium">{teacher.nib}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Pagamentos</h3>
                    <div className="space-y-4">
                      {financialTransactions.map(transaction => (
                        <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{transaction.descricao}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.data).toLocaleDateString('pt-AO')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${
                                transaction.tipo === 'entrada'
                                  ? 'text-emerald-600'
                                  : 'text-red-600'
                              }`}>
                                {formatCurrency(transaction.valor)}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                transaction.tipo === 'entrada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.tipo === 'entrada' ? 'Crédito' : 'Débito'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefícios e Subsídios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Subsídio de Transporte</span>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600">Ativo - 15.000 AOA/mês</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Seguro de Saúde</span>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600">Ativo - UNICARE</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Formação Contínua</span>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600">Orçamento anual: 50.000 AOA</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Apoio à Investigação</span>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600">100.000 AOA/ano</p>
                      </div>
                    </div>
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