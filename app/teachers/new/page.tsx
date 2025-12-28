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
  Camera,
  UserPlus,
  Briefcase,
  Award,
  Book,
  Clock,
  DollarSign,
  Globe,
  Users,
  FileText
} from 'lucide-react'

// Dados iniciais para novo docente
const initialTeacherData = {
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
  
  // Informações profissionais
  numeroFuncionario: '',
  categoria: '',
  regimeContratacao: 'Tempo Integral',
  dataAdmissao: '',
  tipoContrato: '',
  salarioBase: '',
  banco: '',
  numeroConta: '',
  nib: '',
  
  // Formação acadêmica
  grauAcademico: '',
  instituicaoFormacao: '',
  anoConclusao: '',
  areaEspecializacao: '',
  
  // Departamentos e Cursos
  departamentoId: '',
  cursos: [] as string[],
  
  // Informações adicionais
  tituloProfissional: '',
  experienciaAnos: '',
  idiomas: [] as string[],
  observacoes: ''
}

const generos = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
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

const categorias = [
  'Professor Auxiliar',
  'Professor Associado',
  'Professor Catedrático',
  'Professor Assistente',
  'Professor Convidado',
  'Monitor'
]

const regimesContratacao = [
  'Tempo Integral',
  'Tempo Parcial',
  'Horista',
  'Contrato Determinado',
  'Contrato Indeterminado'
]

const tiposContrato = [
  'Efetivo',
  'Contratado',
  'Visitante',
  'Colaborador'
]

const grausAcademicos = [
  'Doutoramento',
  'Mestrado',
  'Licenciatura',
  'Bacharelato',
  'Pós-Graduação',
  'Especialização'
]

const idiomas = [
  'Português',
  'Inglês',
  'Francês',
  'Espanhol',
  'Mandarin',
  'Outro'
]

const departamentos = [
  { id: '1', nome: 'Ciências Sociais e Humanas', sigla: 'CSH' },
  { id: '2', nome: 'Engenharia', sigla: 'ENG' },
  { id: '3', nome: 'Saúde', sigla: 'SAU' }
]

const cursos = [
  { id: '1', nome: 'Direito', departamentoId: '1' },
  { id: '2', nome: 'Economia', departamentoId: '1' },
  { id: '3', nome: 'Engenharia Informática', departamentoId: '2' },
  { id: '4', nome: 'Enfermagem', departamentoId: '3' },
  { id: '5', nome: 'Psicologia', departamentoId: '1' },
  { id: '6', nome: 'Engenharia Civil', departamentoId: '2' }
]

const bancos = [
  'BFA',
  'BAI',
  'BIC',
  'BNI',
  'Standard Bank',
  'ATLÂNTICO',
  'SOL',
  'Outro'
]

export default function NewTeacherPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState(initialTeacherData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const totalSteps = 4

  const handleInputChange = (field: string, value: any) => {
    setTeacher(prev => ({ ...prev, [field]: value }))
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setTeacher(prev => {
      const currentArray = Array.isArray(prev[field as keyof typeof prev]) 
        ? [...(prev[field as keyof typeof prev] as string[])] 
        : []
      
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      }
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
      if (!teacher.nome.trim()) newErrors.nome = 'Nome completo é obrigatório'
      if (!teacher.genero) newErrors.genero = 'Género é obrigatório'
      if (!teacher.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'
      
      const birthDate = new Date(teacher.dataNascimento)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        newErrors.dataNascimento = 'O docente deve ter pelo menos 18 anos'
      }
      
      if (!teacher.numeroBI.trim()) newErrors.numeroBI = 'Número do BI é obrigatório'
      if (teacher.numeroBI && !/^\d{9}[A-Z]{2}\d{3}$/.test(teacher.numeroBI)) {
        newErrors.numeroBI = 'Formato inválido. Use: 123456789LA123'
      }
      
      if (!teacher.nuit.trim()) newErrors.nuit = 'NUIT é obrigatório'
      if (teacher.nuit && !/^\d{9}$/.test(teacher.nuit)) {
        newErrors.nuit = 'NUIT deve conter 9 dígitos'
      }
    }

    if (step === 2) {
      if (!teacher.email.trim()) newErrors.email = 'Email é obrigatório'
      if (teacher.email && !/\S+@\S+\.\S+/.test(teacher.email)) {
        newErrors.email = 'Email inválido'
      }
      
      if (!teacher.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
      if (!teacher.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório'
      if (!teacher.provincia) newErrors.provincia = 'Província é obrigatória'
    }

    if (step === 3) {
      if (!teacher.categoria) newErrors.categoria = 'Categoria é obrigatória'
      if (!teacher.regimeContratacao) newErrors.regimeContratacao = 'Regime de contratação é obrigatório'
      if (!teacher.dataAdmissao) newErrors.dataAdmissao = 'Data de admissão é obrigatória'
      if (!teacher.departamentoId) newErrors.departamentoId = 'Departamento é obrigatório'
      
      if (!teacher.grauAcademico) newErrors.grauAcademico = 'Grau acadêmico é obrigatório'
      if (!teacher.instituicaoFormacao.trim()) newErrors.instituicaoFormacao = 'Instituição de formação é obrigatória'
    }

    if (step === 4) {
      if (!teacher.banco.trim()) newErrors.banco = 'Banco é obrigatório'
      if (!teacher.numeroConta.trim()) newErrors.numeroConta = 'Número da conta é obrigatório'
      if (teacher.nib && teacher.nib.length !== 21) {
        newErrors.nib = 'NIB deve ter 21 dígitos'
      }
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
      // Gerar número de funcionário automático
      const anoAtual = new Date().getFullYear().toString().slice(-2)
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const numeroFuncionario = `DOC-${anoAtual}${randomNum}`
      
      const teacherData = {
        ...teacher,
        numeroFuncionario,
        estado: 'ativo',
        dataCriacao: new Date().toISOString(),
        cursos: cursos.filter(c => teacher.cursos.includes(c.id))
      }
      
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Novo docente criado:', teacherData)
      
      const newTeacherId = Math.floor(Math.random() * 1000)
      
      router.push(`/docentes/${newTeacherId}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao criar docente:', error)
      setErrors({ submit: 'Erro ao criar o docente. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    if (window.confirm('Tem certeza que deseja limpar o formulário? Todos os dados serão perdidos.')) {
      setTeacher(initialTeacherData)
      setErrors({})
      setPhotoPreview(null)
      setActiveStep(1)
    }
  }

  const progressPercentage = (activeStep / totalSteps) * 100

  const getCursosByDepartamento = (departamentoId: string) => {
    return cursos.filter(curso => curso.departamentoId === departamentoId)
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Novo Docente</h1>
            <p className="text-gray-600">Cadastre um novo docente no sistema</p>
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
                Criar Docente
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
                {step === 3 && 'Profissional'}
                {step === 4 && 'Financeiro'}
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
                  Foto do Docente
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
                      value={teacher.nome}
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
                            teacher.genero === genero.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="genero"
                            value={genero.value}
                            checked={teacher.genero === genero.value}
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
                      value={teacher.dataNascimento}
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
                      value={teacher.estadoCivil}
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

            {/* Coluna 2 e 3: Documentação */}
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
                        value={teacher.numeroBI}
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
                        value={teacher.dataEmissaoBI}
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
                        value={teacher.localEmissaoBI}
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
                        value={teacher.validadeBI}
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
                        value={teacher.nuit}
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
                        value={teacher.nacionalidade}
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
                        value={teacher.naturalidade}
                        onChange={(e) => handleInputChange('naturalidade', e.target.value)}
                        className="w-full input-field"
                        placeholder="Cidade/Província de nascimento"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título Profissional
                      </label>
                      <input
                        type="text"
                        value={teacher.tituloProfissional}
                        onChange={(e) => handleInputChange('tituloProfissional', e.target.value)}
                        className="w-full input-field"
                        placeholder="Ex: Dr., Eng., Prof., etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Formação e Idiomas
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idiomas Falados
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {idiomas.map(idioma => (
                        <label key={idioma} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={teacher.idiomas.includes(idioma)}
                            onChange={(e) => handleArrayChange('idiomas', idioma, e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{idioma}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      value={teacher.observacoes}
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
                      value={teacher.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full input-field ${errors.email ? 'border-red-300' : ''}`}
                      placeholder="docente@ispeka.edu.ao"
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
                      value={teacher.telefone}
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
                      value={teacher.telefoneAlternativo}
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
                      value={teacher.endereco}
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
                        value={teacher.bairro}
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
                        value={teacher.municipio}
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
                      value={teacher.provincia}
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

        {/* Step 3: Dados Profissionais */}
        {activeStep === 3 && (
          <div className="space-y-6">
            {/* Informações Profissionais */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Informações Profissionais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={teacher.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className={`w-full input-field ${errors.categoria ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione a categoria</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                  {errors.categoria && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regime de Contratação *
                  </label>
                  <select
                    value={teacher.regimeContratacao}
                    onChange={(e) => handleInputChange('regimeContratacao', e.target.value)}
                    className={`w-full input-field ${errors.regimeContratacao ? 'border-red-300' : ''}`}
                  >
                    {regimesContratacao.map(regime => (
                      <option key={regime} value={regime}>{regime}</option>
                    ))}
                  </select>
                  {errors.regimeContratacao && (
                    <p className="mt-1 text-sm text-red-600">{errors.regimeContratacao}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Contrato
                  </label>
                  <select
                    value={teacher.tipoContrato}
                    onChange={(e) => handleInputChange('tipoContrato', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Selecione</option>
                    {tiposContrato.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Admissão *
                  </label>
                  <input
                    type="date"
                    value={teacher.dataAdmissao}
                    onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
                    className={`w-full input-field ${errors.dataAdmissao ? 'border-red-300' : ''}`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dataAdmissao && (
                    <p className="mt-1 text-sm text-red-600">{errors.dataAdmissao}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência (anos)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={teacher.experienciaAnos}
                    onChange={(e) => handleInputChange('experienciaAnos', e.target.value)}
                    className="w-full input-field"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salário Base
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={teacher.salarioBase}
                      onChange={(e) => handleInputChange('salarioBase', e.target.value)}
                      className="pl-10 w-full input-field"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Formação Acadêmica */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Formação Acadêmica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grau Acadêmico *
                  </label>
                  <select
                    value={teacher.grauAcademico}
                    onChange={(e) => handleInputChange('grauAcademico', e.target.value)}
                    className={`w-full input-field ${errors.grauAcademico ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione o grau</option>
                    {grausAcademicos.map(grau => (
                      <option key={grau} value={grau}>{grau}</option>
                    ))}
                  </select>
                  {errors.grauAcademico && (
                    <p className="mt-1 text-sm text-red-600">{errors.grauAcademico}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instituição de Formação *
                  </label>
                  <input
                    type="text"
                    value={teacher.instituicaoFormacao}
                    onChange={(e) => handleInputChange('instituicaoFormacao', e.target.value)}
                    className={`w-full input-field ${errors.instituicaoFormacao ? 'border-red-300' : ''}`}
                    placeholder="Nome da instituição"
                  />
                  {errors.instituicaoFormacao && (
                    <p className="mt-1 text-sm text-red-600">{errors.instituicaoFormacao}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano de Conclusão
                  </label>
                  <input
                    type="number"
                    min="1970"
                    max={new Date().getFullYear()}
                    value={teacher.anoConclusao}
                    onChange={(e) => handleInputChange('anoConclusao', e.target.value)}
                    className="w-full input-field"
                    placeholder="2020"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área de Especialização
                  </label>
                  <input
                    type="text"
                    value={teacher.areaEspecializacao}
                    onChange={(e) => handleInputChange('areaEspecializacao', e.target.value)}
                    className="w-full input-field"
                    placeholder="Ex: Direito Civil, Engenharia de Software, etc."
                  />
                </div>
              </div>
            </div>

            {/* Departamentos e Cursos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Departamentos e Cursos
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <select
                    value={teacher.departamentoId}
                    onChange={(e) => handleInputChange('departamentoId', e.target.value)}
                    className={`w-full input-field ${errors.departamentoId ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione o departamento</option>
                    {departamentos.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nome} ({dept.sigla})
                      </option>
                    ))}
                  </select>
                  {errors.departamentoId && (
                    <p className="mt-1 text-sm text-red-600">{errors.departamentoId}</p>
                  )}
                </div>
                
                {teacher.departamentoId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cursos Lecionados
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getCursosByDepartamento(teacher.departamentoId).map(curso => (
                        <label key={curso.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={teacher.cursos.includes(curso.id)}
                            onChange={(e) => handleArrayChange('cursos', curso.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{curso.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Dados Financeiros */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Dados Bancários
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-blue-900">Informação confidencial</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Estes dados são utilizados apenas para processamento de salários e são mantidos em sigilo.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banco *
                  </label>
                  <select
                    value={teacher.banco}
                    onChange={(e) => handleInputChange('banco', e.target.value)}
                    className={`w-full input-field ${errors.banco ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione o banco</option>
                    {bancos.map(banco => (
                      <option key={banco} value={banco}>{banco}</option>
                    ))}
                  </select>
                  {errors.banco && (
                    <p className="mt-1 text-sm text-red-600">{errors.banco}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número da Conta *
                  </label>
                  <input
                    type="text"
                    value={teacher.numeroConta}
                    onChange={(e) => handleInputChange('numeroConta', e.target.value)}
                    className={`w-full input-field ${errors.numeroConta ? 'border-red-300' : ''}`}
                    placeholder="123456789012"
                  />
                  {errors.numeroConta && (
                    <p className="mt-1 text-sm text-red-600">{errors.numeroConta}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIB (21 dígitos)
                  </label>
                  <input
                    type="text"
                    value={teacher.nib}
                    onChange={(e) => handleInputChange('nib', e.target.value.replace(/\D/g, ''))}
                    className={`w-full input-field ${errors.nib ? 'border-red-300' : ''}`}
                    placeholder="000000000000000000000"
                    maxLength={21}
                  />
                  {errors.nib && (
                    <p className="mt-1 text-sm text-red-600">{errors.nib}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">21 dígitos</p>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
                    <p className="font-semibold text-gray-900">
                      {teacher.tituloProfissional ? `${teacher.tituloProfissional} ` : ''}{teacher.nome || '[Nome do Docente]'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {teacher.email || '[email@exemplo.com]'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {teacher.categoria || '[Categoria]'} • {teacher.grauAcademico || '[Grau]'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Departamento:</span>
                    <p className="font-medium">
                      {departamentos.find(d => d.id === teacher.departamentoId)?.nome || '[Departamento]'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Regime:</span>
                    <p className="font-medium">{teacher.regimeContratacao || '[Regime]'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefone:</span>
                    <p className="font-medium">{teacher.telefone || '[Telefone]'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Banco:</span>
                    <p className="font-medium">{teacher.banco || '[Banco]'}</p>
                  </div>
                </div>
                
                {teacher.cursos.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-500">Cursos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.cursos.slice(0, 3).map(cursoId => {
                        const curso = cursos.find(c => c.id === cursoId)
                        return curso ? (
                          <span key={cursoId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {curso.nome}
                          </span>
                        ) : null
                      })}
                      {teacher.cursos.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          +{teacher.cursos.length - 3} mais
                        </span>
                      )}
                    </div>
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
                      Criar Docente
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