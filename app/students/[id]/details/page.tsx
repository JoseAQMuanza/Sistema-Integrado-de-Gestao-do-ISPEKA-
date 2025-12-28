// app/estudantes/[id]/page.tsx
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
  Upload
} from 'lucide-react'

// Dados mockados do estudante
const studentData = {
  id: 1,
  numero: '20230001',
  nome: 'Maria Silva',
  email: 'maria.silva@ispeka.edu.ao',
  telefone: '+244 923 456 789',
  telefoneAlternativo: '+244 923 456 780',
  dataNascimento: '2000-05-15',
  genero: 'F',
  estadoCivil: 'Solteira',
  nacionalidade: 'Angolana',
  naturalidade: 'Luanda',
  numeroBI: '123456789LA123',
  nuit: '123456789',
  endereco: 'Rua das Flores, 123',
  bairro: 'Maianga',
  municipio: 'Luanda',
  provincia: 'Luanda',
  
  // Dados académicos
  curso: 'Direito',
  cursoCodigo: 'DIR-001',
  anoIngresso: '2021',
  anoAtual: '3º',
  regime: 'Presencial',
  turno: 'Diurno',
  estado: 'ativo',
  mediaGeral: 15.8,
  creditosConcluidos: 120,
  creditosTotais: 240,
  
  // Escola anterior
  escolaAnterior: 'Colégio São José',
  anoConclusao: '2020',
  mediaFinal: 17.2,
  
  // Contacto de emergência
  nomeEmergencia: 'João Silva',
  parentescoEmergencia: 'Pai',
  telefoneEmergencia: '+244 912 345 678',
  
  // Situação financeira
  propinas: 'em dia',
  ultimoPagamento: '2024-01-10',
  proximoVencimento: '2024-02-10',
  totalDevido: 0,
  totalPago: 75000,
  
  // Informações adicionais
  necessidadesEspeciais: 'Nenhuma',
  observacoes: 'Estudante dedicada, participa em atividades extracurriculares.',
  
  // Histórico
  dataMatricula: '2021-09-01',
  ultimaAtividade: '2024-01-15',
  createdAt: '2021-08-20',
  updatedAt: '2024-01-15'
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Eye },
  { id: 'academic', label: 'Académico', icon: GraduationCap },
  { id: 'grades', label: 'Notas', icon: BarChart3 },
  { id: 'financial', label: 'Financeiro', icon: CreditCard },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'history', label: 'Histórico', icon: Clock },
]

const recentGrades = [
  { disciplina: 'Direito Civil', avaliacao: 'Teste 1', nota: 16, data: '2024-01-10' },
  { disciplina: 'Direito Penal', avaliacao: 'Exame Final', nota: 15, data: '2024-01-05' },
  { disciplina: 'Direito Constitucional', avaliacao: 'Trabalho', nota: 18, data: '2024-01-03' },
  { disciplina: 'Filosofia do Direito', avaliacao: 'Teste 2', nota: 14, data: '2023-12-20' },
]

const financialTransactions = [
  { id: 1, descricao: 'Propina Jan/2024', valor: 25000, data: '2024-01-10', tipo: 'entrada' },
  { id: 2, descricao: 'Taxa de Matrícula', valor: 50000, data: '2023-09-01', tipo: 'entrada' },
  { id: 3, descricao: 'Propina Dez/2023', valor: 25000, data: '2023-12-05', tipo: 'entrada' },
]

const documents = [
  { nome: 'Cópia do BI', tipo: 'Identificação', dataUpload: '2023-09-01', tamanho: '2.1 MB' },
  { nome: 'Certificado de Habilitações', tipo: 'Académico', dataUpload: '2023-09-01', tamanho: '1.5 MB' },
  { nome: 'Comprovativo de Pagamento', tipo: 'Financeiro', dataUpload: '2024-01-10', tamanho: '0.8 MB' },
  { nome: 'Declaração de Matrícula', tipo: 'Académico', dataUpload: '2024-01-15', tamanho: '0.5 MB' },
]

export default function StudentDetailPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState(false)
  const [photoUrl] = useState('https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80')

  const student = studentData // Em produção, buscaria pelo ID dos params

  const getProgressPercentage = () => {
    return Math.round((student.creditosConcluidos / student.creditosTotais) * 100)
  }

  const getGenderText = (genero: string) => {
    return genero === 'M' ? 'Masculino' : genero === 'F' ? 'Feminino' : 'Outro'
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
            <h1 className="text-2xl font-bold text-gray-900">{student.nome}</h1>
            <p className="text-gray-600">Número: {student.numero}</p>
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
            href={`/students/${1}/edit`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Estudante
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
                    Arquivar Estudante
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl p-4 ${
        student.estado === 'ativo' 
          ? 'bg-emerald-50 border border-emerald-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${
              student.estado === 'ativo' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Estudante {student.estado === 'ativo' ? 'Ativo' : 'Inativo'}
              </h3>
              <p className="text-sm text-gray-600">
                {student.estado === 'ativo' 
                  ? 'Matriculado e em atividades regulares.' 
                  : 'Não está atualmente em atividades académicas.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.estado === 'ativo' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {student.estado}
            </span>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.propinas === 'em dia'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}>
              Propinas {student.propinas}
            </span>
            
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {student.anoAtual} Ano
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
                  alt={student.nome}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{student.nome}</h2>
              <p className="text-gray-600 mb-2">{student.numero}</p>
              <p className="text-sm text-gray-500">{student.curso}</p>
              
              <div className="mt-4 flex items-center justify-center space-x-4">
                <a
                  href={`mailto:${student.email}`}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Enviar email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={`tel:${student.telefone}`}
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  title="Ligar"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href={`/students/${1}/edit`}
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
                  <a href={`mailto:${student.email}`} className="text-blue-600 hover:text-blue-800">
                    {student.email}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{student.telefone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{student.endereco}, {student.bairro}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Progresso */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Progresso do Curso</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Créditos Concluídos</span>
                  <span className="text-sm font-bold text-gray-900">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{student.creditosConcluidos} créditos</span>
                  <span>{student.creditosTotais} créditos</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Média Geral</span>
                  <p className="font-medium text-gray-900">{student.mediaGeral}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ano Actual</span>
                  <p className="font-medium text-gray-900">{student.anoAtual}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ano de Ingresso</span>
                  <p className="font-medium text-gray-900">{student.anoIngresso}</p>
                </div>
                <div>
                  <span className="text-gray-500">Regime</span>
                  <p className="font-medium text-gray-900">{student.regime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Contacto de Emergência */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              Contacto de Emergência
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{student.nomeEmergencia}</p>
                  <p className="text-sm text-gray-600">{student.parentescoEmergencia}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <a 
                  href={`tel:${student.telefoneEmergencia}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {student.telefoneEmergencia}
                </a>
              </div>
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
                          <span className="font-medium">{student.numeroBI}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">NUIT:</span>{' '}
                          <span className="font-medium">{student.nuit}</span>
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
                            {new Date(student.dataNascimento).toLocaleDateString('pt-AO')}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Idade:</span>{' '}
                          <span className="font-medium">
                            {new Date().getFullYear() - new Date(student.dataNascimento).getFullYear()} anos
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Género:</span>{' '}
                          <span className="font-medium">{getGenderText(student.genero)}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Localização</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Província:</span>{' '}
                          <span className="font-medium">{student.provincia}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Município:</span>{' '}
                          <span className="font-medium">{student.municipio}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Bairro:</span>{' '}
                          <span className="font-medium">{student.bairro}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações Académicas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Académicas</h3>
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Curso</span>
                          <p className="font-medium">{student.curso} ({student.cursoCodigo})</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Ano Actual</span>
                          <p className="font-medium">{student.anoAtual}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Regime</span>
                          <p className="font-medium">{student.regime} - {student.turno}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Data de Matrícula</span>
                          <p className="font-medium">
                            {new Date(student.dataMatricula).toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formação Anterior */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Formação Anterior</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Instituição</span>
                          <p className="font-medium">{student.escolaAnterior}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Ano de Conclusão</span>
                          <p className="font-medium">{student.anoConclusao}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Média Final</span>
                          <p className="font-medium">{student.mediaFinal}</p>
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
                        <p className="text-gray-600">{student.necessidadesEspeciais}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                        <p className="text-gray-600">{student.observacoes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Acadêmico */}
              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Disciplinas do Semestre</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Disciplina {i}</h4>
                              <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                                <span>6 créditos</span>
                                <span>Professor: Dr. Silva</span>
                                <span>2º Semestre</span>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              Cursando
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Taxa de Aprovação</span>
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mt-2">85%</p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Frequência Média</span>
                            <Calendar className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mt-2">92%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Avaliações</h3>
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">Teste {i}</p>
                                <p className="text-sm text-gray-600">Direito Civil</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">25 Jan 2024</p>
                                <p className="text-xs text-gray-500">14:00 - 16:00</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notas */}
              {activeTab === 'grades' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Notas Recentes</h3>
                    <button className="btn-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Boletim
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Disciplina
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avaliação
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nota
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentGrades.map((grade, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {grade.disciplina}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {grade.avaliacao}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                grade.nota >= 10
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {grade.nota}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(grade.data).toLocaleDateString('pt-AO')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {grade.nota >= 10 ? 'Aprovado' : 'Reprovado'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Desempenho</h4>
                    <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Gráfico de desempenho disponível em breve</p>
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
                        <span className="text-sm font-medium text-gray-700">Total Pago</span>
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {student.totalPago.toLocaleString('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        })}
                      </p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Total Devido</span>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {student.totalDevido.toLocaleString('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        })}
                      </p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Próximo Vencimento</span>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date(student.proximoVencimento).toLocaleDateString('pt-AO')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
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
                                {transaction.valor.toLocaleString('pt-AO', {
                                  style: 'currency',
                                  currency: 'AOA'
                                })}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                transaction.tipo === 'entrada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.tipo === 'entrada' ? 'Recebido' : 'Pago'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário de Pagamentos</h3>
                    <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Calendário de pagamentos disponível em breve</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documentos */}
              {activeTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Documentos do Estudante</h3>
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
                  
                  <div className="mt-6 border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Documentos Pendentes</h4>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                        <div>
                          <p className="font-medium text-amber-900">Comprovativo de Residência</p>
                          <p className="text-sm text-amber-700">Prazo: 31 Jan 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Histórico */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                Atividade {i} realizada no sistema
              </p>
                              <p className="text-sm text-gray-600">
                                Descrição detalhada da atividade realizada pelo estudante.
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {i} dias atrás
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Académico</h3>
                    <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Histórico académico completo disponível em breve</p>
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