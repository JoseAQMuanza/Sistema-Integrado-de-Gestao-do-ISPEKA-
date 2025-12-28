// app/estudantes/[id]/editar/page.tsx
'use client'

import { useState, useEffect } from 'react'
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
  Trash2,
  Eye
} from 'lucide-react'

// Dados mockados do estudante para edição
const initialStudentData = {
  // Dados pessoais
  id: 1,
  nome: 'Maria Silva',
  genero: 'F',
  dataNascimento: '2000-05-15',
  nacionalidade: 'Angolana',
  naturalidade: 'Luanda',
  estadoCivil: 'Solteira',
  numeroBI: '123456789LA123',
  dataEmissaoBI: '2018-06-20',
  localEmissaoBI: 'Luanda',
  validadeBI: '2028-06-20',
  nuit: '123456789',
  
  // Contactos
  email: 'maria.silva@ispeka.edu.ao',
  telefone: '+244 923 456 789',
  telefoneAlternativo: '+244 923 456 780',
  endereco: 'Rua das Flores, 123',
  bairro: 'Maianga',
  municipio: 'Luanda',
  provincia: 'Luanda',
  
  // Dados académicos
  numeroEstudante: '20230001',
  cursoId: '1',
  anoIngresso: '2021',
  regime: 'Presencial',
  turno: 'Diurno',
  estado: 'ativo',
  
  // Dados da escola anterior
  escolaAnterior: 'Colégio São José',
  anoConclusao: '2020',
  mediaFinal: '17.2',
  
  // Contacto de emergência
  nomeEmergencia: 'João Silva',
  parentescoEmergencia: 'Pai',
  telefoneEmergencia: '+244 912 345 678',
  
  // Informações adicionais
  necessidadesEspeciais: 'Nenhuma',
  observacoes: 'Estudante dedicada, participa em atividades extracurriculares.',
  
  // Foto (URL mockada)
  fotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
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
const estados = ['ativo', 'trancado', 'formado', 'cancelado']

export default function EditStudentPage() {
  const router = useRouter()
  const [student, setStudent] = useState(initialStudentData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')

  // Simulação de carregamento de dados
  useEffect(() => {
    const loadStudentData = async () => {
      setIsLoading(true)
      try {
        // Em produção, aqui faríamos a API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setStudent(initialStudentData)
        setPhotoPreview(initialStudentData.fotoUrl)
      } catch (error) {
        console.error('Erro ao carregar dados do estudante:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStudentData()
  }, [1])

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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

    if (!student.email.trim()) newErrors.email = 'Email é obrigatório'
    if (student.email && !/\S+@\S+\.\S+/.test(student.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!student.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!student.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório'
    if (!student.provincia) newErrors.provincia = 'Província é obrigatória'

    if (!student.cursoId) newErrors.cursoId = 'Curso é obrigatório'
    if (!student.anoIngresso) newErrors.anoIngresso = 'Ano de ingresso é obrigatório'
    
    const currentYear = new Date().getFullYear()
    const year = parseInt(student.anoIngresso)
    if (year < 2000 || year > currentYear + 1) {
      newErrors.anoIngresso = `Ano inválido. Deve estar entre 2000 e ${currentYear + 1}`
    }
    
    if (!student.escolaAnterior.trim()) newErrors.escolaAnterior = 'Escola anterior é obrigatória'

    if (!student.nomeEmergencia.trim()) newErrors.nomeEmergencia = 'Nome do contacto é obrigatório'
    if (!student.telefoneEmergencia.trim()) newErrors.telefoneEmergencia = 'Telefone de emergência é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Estudante atualizado:', student)
      
      // Redirecionar para a página de detalhes
      router.push(`/students/${1}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao atualizar estudante:', error)
      setErrors({ submit: 'Erro ao salvar as alterações. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStudent = async () => {
    try {
      // Simulação de API call para deletar
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/estudantes')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir estudante:', error)
    }
  }

  const handleResetForm = () => {
    if (window.confirm('Tem certeza que deseja descartar todas as alterações?')) {
      setStudent(initialStudentData)
      setPhotoPreview(initialStudentData.fotoUrl)
      setErrors({})
    }
  }

  const sections = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'contact', label: 'Contactos', icon: Mail },
    { id: 'academic', label: 'Académicos', icon: GraduationCap },
    { id: 'emergency', label: 'Emergência', icon: Shield },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do estudante...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Editar Estudante</h1>
            <p className="text-gray-600">{student.nome} • {student.numeroEstudante}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={`/students/${1}/details`}
            className="btn-secondary"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </a>
          <button
            onClick={handleResetForm}
            className="btn-secondary"
          >
            <X className="w-4 h-4 mr-2" />
            Descartar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
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

      {/* Sections Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex overflow-x-auto space-x-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção de Navegação Lateral para Desktop */}
        <div className="lg:hidden">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full input-field"
          >
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coluna da Esquerda - Navegação (Desktop) e Foto */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navegação Lateral (Desktop) */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-4">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {section.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Card Foto */}
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
                    Alterar Foto
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

            {/* Card Estado */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Estado do Estudante
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status Académico
                </label>
                <div className="space-y-2">
                  {estados.map(estado => (
                    <label key={estado} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="estado"
                        value={estado}
                        checked={student.estado === estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">
                        {estado}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full btn-secondary text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Estudante
                </button>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Conteúdo do Formulário */}
          <div className="lg:col-span-3 space-y-6">
            {/* Dados Pessoais */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Dados Pessoais
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        id="nome"
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
                        id="dataNascimento"
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

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <IdCard className="w-5 h-5 mr-2" />
                    Documentação
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do BI *
                      </label>
                      <input
                        id="numeroBI"
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NUIT *
                      </label>
                      <input
                        id="nuit"
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
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contactos */}
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contactos Pessoais
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
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
                        id="telefone"
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
                        id="endereco"
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Província *
                        </label>
                        <select
                          id="provincia"
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

            {/* Dados Académicos */}
            {activeSection === 'academic' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Dados do ISPEKA
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Estudante
                      </label>
                      <input
                        type="text"
                        value={student.numeroEstudante}
                        disabled
                        className="w-full input-field bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Número gerado automaticamente
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curso *
                      </label>
                      <select
                        id="cursoId"
                        value={student.cursoId}
                        onChange={(e) => handleInputChange('cursoId', e.target.value)}
                        className={`w-full input-field ${errors.cursoId ? 'border-red-300' : ''}`}
                      >
                        <option value="">Selecione o curso</option>
                        {cursos.map(curso => (
                          <option key={curso.id} value={curso.id}>
                            {curso.nome} ({curso.codigo})
                          </option>
                        ))}
                      </select>
                      {errors.cursoId && (
                        <p className="mt-1 text-sm text-red-600">{errors.cursoId}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano de Ingresso *
                      </label>
                      <input
                        id="anoIngresso"
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

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Formação Anterior
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Escola/Instituição Anterior *
                      </label>
                      <input
                        id="escolaAnterior"
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

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Adicionais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            )}

            {/* Contacto de Emergência */}
            {activeSection === 'emergency' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Contacto de Emergência
                  </h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Contacto *
                      </label>
                      <input
                        id="nomeEmergencia"
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
                        id="telefoneEmergencia"
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
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo das Alterações</h3>
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
                        <p className="font-semibold text-gray-900">{student.nome}</p>
                        <p className="text-sm text-gray-600">
                          {student.email} • {student.telefone}
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
                        <p className="font-medium">{student.anoIngresso}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estado:</span>
                        <p className="font-medium capitalize">{student.estado}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contacto de Emergência:</span>
                        <p className="font-medium">{student.telefoneEmergencia}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Última atualização</p>
              <p>{new Date().toLocaleDateString('pt-AO')} às {new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="btn-secondary"
              >
                Descartar Alterações
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir Estudante</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir o estudante <span className="font-semibold">{student.nome}</span>? 
              Todos os dados relacionados serão perdidos permanentemente.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Excluir Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}