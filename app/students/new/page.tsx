// app/estudantes/novo/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  IdCard,
  GraduationCap,
  Shield,
  BookOpen,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Camera
} from 'lucide-react'

// Dados iniciais para novo estudante
const initialStudentData = {
  // Dados pessoais
  nome: '',
  genero: '',
  dataNascimento: '',
  nacionalidade: 'Angolana',
  naturalidade: '',
  estadoCivil: '',
  numeroBI: '',
  dataEmissaoBI: '',
  localEmissaoBI: '',
  validadeBI: '',
  nuit: '',
  
  // Contactos
  email: '',
  telefone: '',
  telefoneAlternativo: '',
  endereco: '',
  bairro: '',
  municipio: '',
  provincia: '',
  
  // Dados académicos
  numeroEstudante: '',
  cursoId: '',
  anoIngresso: new Date().getFullYear().toString(),
  regime: 'Presencial',
  turno: 'Diurno',
  
  // Dados da escola anterior
  escolaAnterior: '',
  anoConclusao: '',
  mediaFinal: '',
  
  // Contacto de emergência
  nomeEmergencia: '',
  parentescoEmergencia: '',
  telefoneEmergencia: '',
  
  // Informações adicionais
  necessidadesEspeciais: '',
  observacoes: ''
}

const generos = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },  
]

const estadosCivis = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)'
]

const provincias = [
  'Luanda',
  'Benguela',
  'Huíla',
  'Huambo',
  'Cabinda',
  'Cunene',
  'Kwanza Sul',
  'Kwanza Norte',
  'Malanje',
  'Uíge',
  'Zaire',
  'Lunda Norte',
  'Lunda Sul',
  'Moxico',
  'Cuando Cubango',
  'Namibe',
  'Bengo',
  'Cuanza Sul'
]

const cursos = [
  { id: '1', nome: 'Direito', codigo: 'DIR-001', departamento: 'Ciências Sociais e Humanas' },
  { id: '2', nome: 'Economia', codigo: 'ECO-001', departamento: 'Ciências Sociais e Humanas' },
  { id: '3', nome: 'Engenharia Informática', codigo: 'INF-001', departamento: 'Engenharia' },
  { id: '4', nome: 'Enfermagem', codigo: 'ENF-001', departamento: 'Saúde' },
  { id: '5', nome: 'Psicologia', codigo: 'PSI-001', departamento: 'Ciências Sociais e Humanas' },
  { id: '6', nome: 'Engenharia Civil', codigo: 'CIV-001', departamento: 'Engenharia' }
]

const regimes = ['Presencial', 'Semi-presencial', 'Distância']
const turnos = ['Diurno', 'Noturno', 'Integral']

export default function NewStudentPage() {
  const router = useRouter()
  const [student, setStudent] = useState(initialStudentData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const totalSteps = 4

  const handleInputChange = (field: string, value: any) => {
    setStudent(prev => ({ ...prev, [field]: value }))
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({ ...prev, foto: 'A foto deve ter no máximo 5MB' }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, foto: 'O arquivo deve ser uma imagem' }))
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!student.nome.trim()) newErrors.nome = 'Nome completo é obrigatório'
      if (!student.genero) newErrors.genero = 'Género é obrigatório'
      if (!student.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'
      
      const birthDate = new Date(student.dataNascimento)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 16) {
        newErrors.dataNascimento = 'O estudante deve ter pelo menos 16 anos'
      }
      
      if (!student.numeroBI.trim()) newErrors.numeroBI = 'Número do BI é obrigatório'
      if (student.numeroBI && !/^\d{9}[A-Z]{2}\d{3}$/.test(student.numeroBI)) {
        newErrors.numeroBI = 'Formato inválido. Use: 123456789LA123'
      }
      
      if (!student.nuit.trim()) newErrors.nuit = 'NUIT é obrigatório'
      if (student.nuit && !/^\d{9}$/.test(student.nuit)) {
        newErrors.nuit = 'NUIT deve conter 9 dígitos'
      }
    }

    if (step === 2) {
      if (!student.email.trim()) newErrors.email = 'Email é obrigatório'
      if (student.email && !/\S+@\S+\.\S+/.test(student.email)) {
        newErrors.email = 'Email inválido'
      }
      
      if (!student.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
      if (!student.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório'
      if (!student.provincia) newErrors.provincia = 'Província é obrigatória'
    }

    if (step === 3) {
      if (!student.cursoId) newErrors.cursoId = 'Curso é obrigatório'
      if (!student.anoIngresso) newErrors.anoIngresso = 'Ano de ingresso é obrigatório'
      
      const currentYear = new Date().getFullYear()
      const year = parseInt(student.anoIngresso)
      if (year < 2000 || year > currentYear + 1) {
        newErrors.anoIngresso = `Ano inválido. Deve estar entre 2000 e ${currentYear + 1}`
      }
      
      if (!student.escolaAnterior.trim()) newErrors.escolaAnterior = 'Escola anterior é obrigatória'
    }

    if (step === 4) {
      if (!student.nomeEmergencia.trim()) newErrors.nomeEmergencia = 'Nome do contacto é obrigatório'
      if (!student.telefoneEmergencia.trim()) newErrors.telefoneEmergencia = 'Telefone de emergência é obrigatório'
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

    // All steps validated, submit form
    setIsSubmitting(true)
    
    try {
      // Gerar número de estudante automático (exemplo)
      const anoAtual = new Date().getFullYear().toString().slice(-2)
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const numeroEstudante = `${anoAtual}${randomNum}`
      
      const studentData = {
        ...student,
        numeroEstudante,
        estado: 'ativo',
        dataMatricula: new Date().toISOString().split('T')[0]
      }
      
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Novo estudante criado:', studentData)
      
      // Em produção, aqui pegaríamos o ID retornado pela API
      const newStudentId = Math.floor(Math.random() * 1000)
      
      // Redirecionar para a página de detalhes do novo estudante
      router.push(`/estudantes/${newStudentId}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao criar estudante:', error)
      setErrors({ submit: 'Erro ao criar o estudante. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    if (window.confirm('Tem certeza que deseja limpar o formulário? Todos os dados serão perdidos.')) {
      setStudent(initialStudentData)
      setErrors({})
      setPhotoPreview(null)
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
            <h1 className="text-2xl font-bold text-gray-900">Novo Estudante</h1>
            <p className="text-gray-600">Cadastre um novo estudante no sistema</p>
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
                Criar Estudante
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
                {step === 1 && 'Dados Pessoais'}
                {step === 2 && 'Contactos'}
                {step === 3 && 'Académicos'}
                {step === 4 && 'Emergência'}
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
        {/* Step 1: Dados Pessoais */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Foto e Dados Básicos */}
            <div className="space-y-6">
              {/* Foto */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Foto do Estudante
                </h2>
                
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <label className="block mb-2">
                    <div className="btn-secondary cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Carregar Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                  
                  {errors.foto && (
                    <p className="mt-2 text-sm text-red-600">{errors.foto}</p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    JPG ou PNG, máximo 5MB
                  </p>
                </div>
              </div>

              {/* Dados Básicos */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados Básicos
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={student.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className={`w-full input-field ${errors.nome ? 'border-red-300' : ''}`}
                      placeholder="Nome e sobrenome"
                    />
                    {errors.nome && (
                      <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {generos.map(genero => (
                        <label
                          key={genero.value}
                          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                            student.genero === genero.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="genero"
                            value={genero.value}
                            checked={student.genero === genero.value}
                            onChange={(e) => handleInputChange('genero', e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm">{genero.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.genero && (
                      <p className="mt-1 text-sm text-red-600">{errors.genero}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      value={student.dataNascimento}
                      onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                      className={`w-full input-field ${errors.dataNascimento ? 'border-red-300' : ''}`}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dataNascimento && (
                      <p className="mt-1 text-sm text-red-600">{errors.dataNascimento}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado Civil
                    </label>
                    <select
                      value={student.estadoCivil}
                      onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="">Selecione</option>
                      {estadosCivis.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 2: Documentação */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <IdCard className="w-5 h-5 mr-2" />
                  Documentação
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bilhete de Identidade */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Bilhete de Identidade</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do BI *
                      </label>
                      <input
                        type="text"
                        value={student.numeroBI}
                        onChange={(e) => handleInputChange('numeroBI', e.target.value.toUpperCase())}
                        className={`w-full input-field ${errors.numeroBI ? 'border-red-300' : ''}`}
                        placeholder="123456789LA123"
                        maxLength={14}
                      />
                      {errors.numeroBI && (
                        <p className="mt-1 text-sm text-red-600">{errors.numeroBI}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Formato: 9 dígitos + 2 letras + 3 dígitos
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Emissão
                      </label>
                      <input
                        type="date"
                        value={student.dataEmissaoBI}
                        onChange={(e) => handleInputChange('dataEmissaoBI', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Local de Emissão
                      </label>
                      <input
                        type="text"
                        value={student.localEmissaoBI}
                        onChange={(e) => handleInputChange('localEmissaoBI', e.target.value)}
                        className="w-full input-field"
                        placeholder="Ex: Luanda"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Validade
                      </label>
                      <input
                        type="date"
                        value={student.validadeBI}
                        onChange={(e) => handleInputChange('validadeBI', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                  </div>

                  {/* Outros Documentos */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Outros Documentos</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NUIT *
                      </label>
                      <input
                        type="text"
                        value={student.nuit}
                        onChange={(e) => handleInputChange('nuit', e.target.value.replace(/\D/g, ''))}
                        className={`w-full input-field ${errors.nuit ? 'border-red-300' : ''}`}
                        placeholder="123456789"
                        maxLength={9}
                      />
                      {errors.nuit && (
                        <p className="mt-1 text-sm text-red-600">{errors.nuit}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">9 dígitos</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nacionalidade
                      </label>
                      <input
                        type="text"
                        value={student.nacionalidade}
                        onChange={(e) => handleInputChange('nacionalidade', e.target.value)}
                        className="w-full input-field"
                        placeholder="Angolana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Naturalidade
                      </label>
                      <input
                        type="text"
                        value={student.naturalidade}
                        onChange={(e) => handleInputChange('naturalidade', e.target.value)}
                        className="w-full input-field"
                        placeholder="Cidade/Província de nascimento"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Informações Adicionais
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Necessidades Especiais
                    </label>
                    <textarea
                      value={student.necessidadesEspeciais}
                      onChange={(e) => handleInputChange('necessidadesEspeciais', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                      placeholder="Descreva se houver necessidades especiais de saúde ou aprendizagem..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      value={student.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                      placeholder="Outras informações relevantes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contactos */}
        {activeStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contactos Pessoais */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contactos Pessoais
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={student.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full input-field ${errors.email ? 'border-red-300' : ''}`}
                      placeholder="estudante@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone Principal *
                    </label>
                    <input
                      type="tel"
                      value={student.telefone}
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
                      Telefone Alternativo
                    </label>
                    <input
                      type="tel"
                      value={student.telefoneAlternativo}
                      onChange={(e) => handleInputChange('telefoneAlternativo', e.target.value)}
                      className="w-full input-field"
                      placeholder="+244 900 000 000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço *
                    </label>
                    <textarea
                      value={student.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      className={`w-full input-field ${errors.endereco ? 'border-red-300' : ''}`}
                      rows={2}
                      placeholder="Rua, número, quarteirão..."
                    />
                    {errors.endereco && (
                      <p className="mt-1 text-sm text-red-600">{errors.endereco}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={student.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        className="w-full input-field"
                        placeholder="Bairro"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Município
                      </label>
                      <input
                        type="text"
                        value={student.municipio}
                        onChange={(e) => handleInputChange('municipio', e.target.value)}
                        className="w-full input-field"
                        placeholder="Município"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Província *
                    </label>
                    <select
                      value={student.provincia}
                      onChange={(e) => handleInputChange('provincia', e.target.value)}
                      className={`w-full input-field ${errors.provincia ? 'border-red-300' : ''}`}
                    >
                      <option value="">Selecione a província</option>
                      {provincias.map(provincia => (
                        <option key={provincia} value={provincia}>{provincia}</option>
                      ))}
                    </select>
                    {errors.provincia && (
                      <p className="mt-1 text-sm text-red-600">{errors.provincia}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Dados Académicos */}
        {activeStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados do ISPEKA */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Dados do ISPEKA
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curso *
                    </label>
                    <select
                      value={student.cursoId}
                      onChange={(e) => handleInputChange('cursoId', e.target.value)}
                      className={`w-full input-field ${errors.cursoId ? 'border-red-300' : ''}`}
                    >
                      <option value="">Selecione o curso</option>
                      {cursos.map(curso => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nome} ({curso.codigo}) - {curso.departamento}
                        </option>
                      ))}
                    </select>
                    {errors.cursoId && (
                      <p className="mt-1 text-sm text-red-600">{errors.cursoId}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano de Ingresso *
                      </label>
                      <input
                        type="number"
                        min="2000"
                        max={new Date().getFullYear() + 1}
                        value={student.anoIngresso}
                        onChange={(e) => handleInputChange('anoIngresso', e.target.value)}
                        className={`w-full input-field ${errors.anoIngresso ? 'border-red-300' : ''}`}
                        placeholder="2024"
                      />
                      {errors.anoIngresso && (
                        <p className="mt-1 text-sm text-red-600">{errors.anoIngresso}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regime
                      </label>
                      <select
                        value={student.regime}
                        onChange={(e) => handleInputChange('regime', e.target.value)}
                        className="w-full input-field"
                      >
                        {regimes.map(regime => (
                          <option key={regime} value={regime}>{regime}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turno
                    </label>
                    <select
                      value={student.turno}
                      onChange={(e) => handleInputChange('turno', e.target.value)}
                      className="w-full input-field"
                    >
                      {turnos.map(turno => (
                        <option key={turno} value={turno}>{turno}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Formação Anterior */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Formação Anterior
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escola/Instituição Anterior *
                    </label>
                    <input
                      type="text"
                      value={student.escolaAnterior}
                      onChange={(e) => handleInputChange('escolaAnterior', e.target.value)}
                      className={`w-full input-field ${errors.escolaAnterior ? 'border-red-300' : ''}`}
                      placeholder="Nome da escola ou universidade"
                    />
                    {errors.escolaAnterior && (
                      <p className="mt-1 text-sm text-red-600">{errors.escolaAnterior}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano de Conclusão
                      </label>
                      <input
                        type="number"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={student.anoConclusao}
                        onChange={(e) => handleInputChange('anoConclusao', e.target.value)}
                        className="w-full input-field"
                        placeholder="2023"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Média Final
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                        value={student.mediaFinal}
                        onChange={(e) => handleInputChange('mediaFinal', e.target.value)}
                        className="w-full input-field"
                        placeholder="14.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contacto de Emergência */}
        {activeStep === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Contacto de Emergência
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-900">Informação importante</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Estes contactos serão utilizados apenas em situações de emergência.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Contacto *
                    </label>
                    <input
                      type="text"
                      value={student.nomeEmergencia}
                      onChange={(e) => handleInputChange('nomeEmergencia', e.target.value)}
                      className={`w-full input-field ${errors.nomeEmergencia ? 'border-red-300' : ''}`}
                      placeholder="Nome completo"
                    />
                    {errors.nomeEmergencia && (
                      <p className="mt-1 text-sm text-red-600">{errors.nomeEmergencia}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parentesco
                      </label>
                      <input
                        type="text"
                        value={student.parentescoEmergencia}
                        onChange={(e) => handleInputChange('parentescoEmergencia', e.target.value)}
                        className="w-full input-field"
                        placeholder="Ex: Pai, Mãe, Irmão, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone de Emergência *
                      </label>
                      <input
                        type="tel"
                        value={student.telefoneEmergencia}
                        onChange={(e) => handleInputChange('telefoneEmergencia', e.target.value)}
                        className={`w-full input-field ${errors.telefoneEmergencia ? 'border-red-300' : ''}`}
                        placeholder="+244 900 000 000"
                      />
                      {errors.telefoneEmergencia && (
                        <p className="mt-1 text-sm text-red-600">{errors.telefoneEmergencia}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Preview Card */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Cadastro</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.nome || '[Nome do Estudante]'}</p>
                        <p className="text-sm text-gray-600">
                          {student.email || '[email@exemplo.com]'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Curso:</span>
                        <p className="font-medium">
                          {cursos.find(c => c.id === student.cursoId)?.nome || '[Curso não selecionado]'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ano de Ingresso:</span>
                        <p className="font-medium">{student.anoIngresso || '[Ano]'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Telefone:</span>
                        <p className="font-medium">{student.telefone || '[Telefone]'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contacto de Emergência:</span>
                        <p className="font-medium">{student.telefoneEmergencia || '[Telefone]'}</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                      Criar Estudante
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