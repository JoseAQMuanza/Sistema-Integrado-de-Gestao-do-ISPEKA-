'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  X,
  Building2,
  Users,
  BookOpen,
  DollarSign,
  Target,
  Star,
  FileText,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle,
  Upload,
  UserPlus,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

// Dados iniciais para novo departamento
const initialDepartmentData = {
  // Informações básicas
  codigo: '',
  nome: '',
  sigla: '',
  descricao: '',
  areaCientifica: '',
  missao: '',
  visao: '',
  objetivos: '',
  
  // Contactos
  telefone: '',
  email: '',
  endereco: '',
  sala: '',
  website: '',
  
  // Estrutura
  chefeId: '',
  viceChefeId: '',
  secretarioId: '',
  dataCriacao: new Date().toISOString().split('T')[0],
  
  // Recursos
  orcamentoAnual: '',
  areaFisica: '',
  numeroSalas: '',
  
  // Estado
  estado: 'em_implementacao',
  dataAtivacao: '',
  
  // Informações adicionais
  observacoes: ''
}

const areasCientificas = [
  'Humanidades',
  'Engenharias e Tecnologias',
  'Ciências da Saúde',
  'Ciências Sociais Aplicadas',
  'Artes e Humanidades',
  'Ciências Jurídicas',
  'Ciências Exatas',
  'Ciências Naturais',
  'Ciências da Terra',
  'Outra'
]

const estados = [
  { value: 'em_implementacao', label: 'Em Implementação', color: 'blue' },
  { value: 'ativo', label: 'Ativo', color: 'emerald' },
  { value: 'inativo', label: 'Inativo', color: 'red' },
  { value: 'em_reestruturacao', label: 'Em Reestruturação', color: 'amber' },
  { value: 'suspenso', label: 'Suspenso', color: 'violet' }
]

// Docentes mockados para seleção como chefes
const docentes = [
  { id: '1', nome: 'Dr. João Silva', categoria: 'Professor Catedrático', departamento: 'Ciências Sociais e Humanas' },
  { id: '2', nome: 'Prof. Maria Santos', categoria: 'Professor Associado', departamento: 'Engenharia' },
  { id: '3', nome: 'Dra. Ana Oliveira', categoria: 'Professor Auxiliar', departamento: 'Saúde' },
  { id: '4', nome: 'Prof. Carlos Mendes', categoria: 'Professor Associado', departamento: 'Gestão' },
  { id: '5', nome: 'Prof. Luísa Fernandes', categoria: 'Professor Assistente', departamento: 'Artes' },
]

export default function NewDepartmentPage() {
  const router = useRouter()
  const [department, setDepartment] = useState(initialDepartmentData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const totalSteps = 4

  const handleInputChange = (field: string, value: any) => {
    setDepartment(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!department.codigo.trim()) newErrors.codigo = 'Código é obrigatório'
      if (!department.nome.trim()) newErrors.nome = 'Nome é obrigatório'
      if (!department.areaCientifica) newErrors.areaCientifica = 'Área científica é obrigatória'
      
      // Validar formato do código (3-5 letras maiúsculas)
      if (department.codigo && !/^[A-Z]{3,5}$/.test(department.codigo)) {
        newErrors.codigo = 'Código deve ter 3-5 letras maiúsculas'
      }
    }

    if (step === 2) {
      if (!department.chefeId) newErrors.chefeId = 'Chefe do departamento é obrigatório'
      if (!department.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
      if (!department.email.trim()) newErrors.email = 'Email é obrigatório'
      if (department.email && !/\S+@\S+\.\S+/.test(department.email)) {
        newErrors.email = 'Email inválido'
      }
    }

    if (step === 3) {
      if (!department.missao.trim()) newErrors.missao = 'Missão é obrigatória'
      if (!department.visao.trim()) newErrors.visao = 'Visão é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      if (activeStep < totalSteps) {
        setActiveStep(activeStep + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(activeStep)) {
      return
    }

    if (activeStep < totalSteps) {
      handleNextStep()
      return
    }

    setIsSubmitting(true)
    
    try {
      const departmentData = {
        ...department,
        estado: department.estado || 'em_implementacao',
        dataCriacao: new Date().toISOString().split('T')[0]
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Novo departamento criado:', departmentData)
      
      const newDepartmentId = Math.floor(Math.random() * 1000)
      router.push(`/departamentos/${newDepartmentId}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao criar departamento:', error)
      setErrors({ submit: 'Erro ao criar o departamento. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    if (window.confirm('Tem certeza que deseja limpar o formulário?')) {
      setDepartment(initialDepartmentData)
      setErrors({})
      setActiveStep(1)
    }
  }

  const progressPercentage = (activeStep / totalSteps) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Departamento</h1>
            <p className="text-gray-600">Crie um novo departamento académico</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetForm}
            className="btn-secondary"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando...
              </>
            ) : activeStep === totalSteps ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Criar Departamento
              </>
            ) : (
              <>
                Salvar e Continuar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Passo {activeStep} de {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progressPercentage)}% completo
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Steps */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(step => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                activeStep === step
                  ? 'bg-blue-50 text-blue-700'
                  : step < activeStep
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                activeStep === step
                  ? 'bg-blue-100 text-blue-600'
                  : step < activeStep
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step < activeStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              <span className="text-sm font-medium">
                {step === 1 && 'Informações Básicas'}
                {step === 2 && 'Estrutura'}
                {step === 3 && 'Missão e Visão'}
                {step === 4 && 'Recursos'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informações Básicas */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={department.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                    className={`w-full input-field ${errors.codigo ? 'border-red-300' : ''}`}
                    placeholder="Ex: CSH, ENG, SAU"
                    maxLength={5}
                  />
                  {errors.codigo && (
                    <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    3-5 letras maiúsculas. Ex: CSH para Ciências Sociais e Humanas
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sigla
                  </label>
                  <input
                    type="text"
                    value={department.sigla}
                    onChange={(e) => handleInputChange('sigla', e.target.value.toUpperCase())}
                    className="w-full input-field"
                    placeholder="Ex: CSH"
                    maxLength={10}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Departamento *
                  </label>
                  <input
                    type="text"
                    value={department.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className={`w-full input-field ${errors.nome ? 'border-red-300' : ''}`}
                    placeholder="Ex: Departamento de Ciências Sociais e Humanas"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área Científica *
                  </label>
                  <select
                    value={department.areaCientifica}
                    onChange={(e) => handleInputChange('areaCientifica', e.target.value)}
                    className={`w-full input-field ${errors.areaCientifica ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione a área científica</option>
                    {areasCientificas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.areaCientifica && (
                    <p className="mt-1 text-sm text-red-600">{errors.areaCientifica}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={department.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={3}
                    className="w-full input-field"
                    placeholder="Descreva brevemente o departamento, suas áreas de atuação e importância..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Estrutura e Contactos */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Estrutura Organizacional
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chefe do Departamento *
                  </label>
                  <select
                    value={department.chefeId}
                    onChange={(e) => handleInputChange('chefeId', e.target.value)}
                    className={`w-full input-field ${errors.chefeId ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione o chefe</option>
                    {docentes.map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nome} - {docente.categoria}
                      </option>
                    ))}
                  </select>
                  {errors.chefeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.chefeId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vice-Chefe
                  </label>
                  <select
                    value={department.viceChefeId}
                    onChange={(e) => handleInputChange('viceChefeId', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Selecione o vice-chefe</option>
                    {docentes.map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secretário
                  </label>
                  <select
                    value={department.secretarioId}
                    onChange={(e) => handleInputChange('secretarioId', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Selecione o secretário</option>
                    {docentes.map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Criação
                  </label>
                  <input
                    type="date"
                    value={department.dataCriacao}
                    onChange={(e) => handleInputChange('dataCriacao', e.target.value)}
                    className="w-full input-field"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contactos do Departamento
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={department.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className={`w-full input-field ${errors.telefone ? 'border-red-300' : ''}`}
                    placeholder="+244 900 000 000"
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={department.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full input-field ${errors.email ? 'border-red-300' : ''}`}
                    placeholder="departamento@ispeka.edu.ao"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={department.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    className="w-full input-field"
                    placeholder="Edifício, andar, sala..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sala/Secretaria
                  </label>
                  <input
                    type="text"
                    value={department.sala}
                    onChange={(e) => handleInputChange('sala', e.target.value)}
                    className="w-full input-field"
                    placeholder="Ex: Sala 201, Bloco B"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={department.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full input-field"
                    placeholder="https://departamento.ispeka.edu.ao"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Missão e Visão */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Missão, Visão e Objetivos
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Missão *
                  </label>
                  <textarea
                    value={department.missao}
                    onChange={(e) => handleInputChange('missao', e.target.value)}
                    rows={3}
                    className={`w-full input-field ${errors.missao ? 'border-red-300' : ''}`}
                    placeholder="Descreva a missão do departamento..."
                  />
                  {errors.missao && (
                    <p className="mt-1 text-sm text-red-600">{errors.missao}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    A razão de existir do departamento
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visão *
                  </label>
                  <textarea
                    value={department.visao}
                    onChange={(e) => handleInputChange('visao', e.target.value)}
                    rows={3}
                    className={`w-full input-field ${errors.visao ? 'border-red-300' : ''}`}
                    placeholder="Descreva a visão futura do departamento..."
                  />
                  {errors.visao && (
                    <p className="mt-1 text-sm text-red-600">{errors.visao}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    O que o departamento pretende alcançar no futuro
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivos Estratégicos
                  </label>
                  <textarea
                    value={department.objetivos}
                    onChange={(e) => handleInputChange('objetivos', e.target.value)}
                    rows={4}
                    className="w-full input-field"
                    placeholder="Liste os principais objetivos estratégicos do departamento..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separe cada objetivo com ponto e vírgula (;)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Estado do Departamento
              </h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Atual
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {estados.map(estado => (
                    <label
                      key={estado.value}
                      className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer ${
                        department.estado === estado.value
                          ? `border-${estado.color}-500 bg-${estado.color}-50`
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value={estado.value}
                        checked={department.estado === estado.value}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm text-center">{estado.label}</span>
                    </label>
                  ))}
                </div>
                
                {department.estado === 'ativo' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Ativação
                    </label>
                    <input
                      type="date"
                      value={department.dataAtivacao}
                      onChange={(e) => handleInputChange('dataAtivacao', e.target.value)}
                      className="w-full input-field"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Recursos */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Recursos e Infraestrutura
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orçamento Anual (AOA)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">AOA</span>
                    </div>
                    <input
                      type="text"
                      value={department.orcamentoAnual}
                      onChange={(e) => handleInputChange('orcamentoAnual', e.target.value.replace(/\D/g, ''))}
                      className="pl-12 w-full input-field"
                      placeholder="0"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Orçamento anual estimado para o departamento
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área Física (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={department.areaFisica}
                    onChange={(e) => handleInputChange('areaFisica', e.target.value)}
                    className="w-full input-field"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Salas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={department.numeroSalas}
                    onChange={(e) => handleInputChange('numeroSalas', e.target.value)}
                    className="w-full input-field"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Observações</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informações Adicionais
                </label>
                <textarea
                  value={department.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                  className="w-full input-field"
                  placeholder="Quaisquer outras informações relevantes sobre o departamento..."
                />
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Departamento</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {department.nome || '[Nome do Departamento]'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {department.codigo ? `${department.codigo}` : '[Código]'} • {department.areaCientifica || '[Área]'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Chefe:</span>
                    <p className="font-medium">
                      {docentes.find(d => d.id === department.chefeId)?.nome || '[Não definido]'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <p className="font-medium">
                      {estados.find(e => e.value === department.estado)?.label || '[Estado]'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Contacto:</span>
                    <p className="font-medium">{department.telefone || '[Telefone]'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{department.email || '[Email]'}</p>
                  </div>
                </div>
                
                {department.descricao && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-500">Descrição:</span>
                    <p className="text-sm mt-1">{department.descricao}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="btn-secondary"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </button>
              
              {activeStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary"
                >
                  Próximo Passo
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Departamento
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}