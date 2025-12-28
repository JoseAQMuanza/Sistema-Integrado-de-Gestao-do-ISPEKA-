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
  Eye,
  Briefcase,
  DollarSign,
  Globe,
  Book,
  Brain,
  Award,
  Clock,
  Users,
  Building2,
  FileText
} from 'lucide-react'

// Dados mockados do docente para edição
const initialTeacherData = {
  id: 1,
  nome: 'Dr. João Mendes',
  tituloProfissional: 'Dr.',
  genero: 'M',
  dataNascimento: '1975-08-22',
  estadoCivil: 'Casado',
  nacionalidade: 'Angolana',
  naturalidade: 'Luanda',
  numeroBI: '123456789LA123',
  dataEmissaoBI: '2015-06-20',
  localEmissaoBI: 'Luanda',
  validadeBI: '2025-06-20',
  nuit: '123456789',
  
  // Contactos
  email: 'joao.mendes@ispeka.edu.ao',
  telefone: '+244 923 456 789',
  telefoneAlternativo: '+244 923 456 780',
  endereco: 'Av. 4 de Fevereiro, 123',
  bairro: 'Alvalade',
  municipio: 'Luanda',
  provincia: 'Luanda',
  
  // Dados profissionais
  numeroFuncionario: 'DOC-2024001',
  categoria: 'Professor Associado',
  regimeContratacao: 'Tempo Integral',
  dataAdmissao: '2015-09-01',
  tipoContrato: 'Efetivo',
  salarioBase: '350000',
  estado: 'ativo',
  experienciaAnos: '15',
  cargaHorariaSemanal: '40',
  
  // Formação acadêmica
  grauAcademico: 'Doutoramento',
  instituicaoFormacao: 'Universidade de Lisboa',
  anoConclusao: '2014',
  areaEspecializacao: 'Direito Constitucional',
  
  // Departamentos e cursos
  departamentoId: '1',
  cursos: ['1', '5'],
  
  // Idiomas
  idiomas: ['Português', 'Inglês', 'Francês'],
  
  // Dados bancários
  banco: 'BFA',
  numeroConta: '123456789012',
  nib: '000123456789012345678',
  
  // Informações adicionais
  avaliacaoMedia: '4.5',
  necessidadesEspeciais: 'Nenhuma',
  observacoes: 'Coordenador do curso de Direito. Publicou 3 livros e 12 artigos científicos.',
  
  // Foto (URL mockada)
  fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
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
  'Professor Assistente',
  'Professor Associado',
  'Professor Catedrático',
  'Professor Convidado',
  'Monitor',
  'Investigador'
]

const regimesContratacao = [
  'Tempo Integral',
  'Tempo Parcial',
  'Horista',
  'Contrato Determinado',
  'Contrato Indeterminado',
  'Colaborador'
]

const tiposContrato = [
  'Efetivo',
  'Contratado',
  'Visitante',
  'Colaborador',
  'Bolsista'
]

const grausAcademicos = [
  'Doutoramento',
  'Mestrado',
  'Licenciatura',
  'Bacharelato',
  'Pós-Graduação',
  'Especialização',
  'MBA'
]

const idiomas = [
  'Português',
  'Inglês',
  'Francês',
  'Espanhol',
  'Mandarin',
  'Alemão',
  'Italiano',
  'Russo',
  'Outro'
]

const departamentos = [
  { id: '1', nome: 'Ciências Sociais e Humanas', sigla: 'CSH' },
  { id: '2', nome: 'Engenharia', sigla: 'ENG' },
  { id: '3', nome: 'Saúde', sigla: 'SAU' },
  { id: '4', nome: 'Gestão e Economia', sigla: 'GES' },
  { id: '5', nome: 'Artes e Design', sigla: 'ART' }
]

const cursos = [
  { id: '1', nome: 'Direito', departamentoId: '1', codigo: 'DIR-001' },
  { id: '2', nome: 'Economia', departamentoId: '4', codigo: 'ECO-001' },
  { id: '3', nome: 'Engenharia Informática', departamentoId: '2', codigo: 'INF-001' },
  { id: '4', nome: 'Enfermagem', departamentoId: '3', codigo: 'ENF-001' },
  { id: '5', nome: 'Psicologia', departamentoId: '1', codigo: 'PSI-001' },
  { id: '6', nome: 'Engenharia Civil', departamentoId: '2', codigo: 'CIV-001' },
  { id: '7', nome: 'Arquitetura', departamentoId: '5', codigo: 'ARQ-001' },
  { id: '8', nome: 'Medicina Dentária', departamentoId: '3', codigo: 'MED-001' }
]

const bancos = [
  'BFA',
  'BAI',
  'BIC',
  'BNI',
  'Standard Bank',
  'ATLÂNTICO',
  'SOL',
  'Caixa Geral de Depósitos',
  'Outro'
]

const estados = ['ativo', 'inativo', 'licença', 'aposentado', 'suspenso']

export default function EditTeacherPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [teacher, setTeacher] = useState(initialTeacherData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')

  // Simulação de carregamento de dados
  useEffect(() => {
    const loadTeacherData = async () => {
      setIsLoading(true)
      try {
        // Em produção, aqui faríamos a API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setTeacher(initialTeacherData)
        setPhotoPreview(initialTeacherData.fotoUrl)
      } catch (error) {
        console.error('Erro ao carregar dados do docente:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeacherData()
  }, [params.id])

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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

    if (!teacher.email.trim()) newErrors.email = 'Email é obrigatório'
    if (teacher.email && !/\S+@\S+\.\S+/.test(teacher.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!teacher.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!teacher.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório'
    if (!teacher.provincia) newErrors.provincia = 'Província é obrigatória'

    if (!teacher.categoria) newErrors.categoria = 'Categoria é obrigatória'
    if (!teacher.regimeContratacao) newErrors.regimeContratacao = 'Regime de contratação é obrigatório'
    if (!teacher.dataAdmissao) newErrors.dataAdmissao = 'Data de admissão é obrigatória'
    if (!teacher.departamentoId) newErrors.departamentoId = 'Departamento é obrigatório'
    
    if (!teacher.grauAcademico) newErrors.grauAcademico = 'Grau acadêmico é obrigatório'
    if (!teacher.instituicaoFormacao.trim()) newErrors.instituicaoFormacao = 'Instituição de formação é obrigatória'

    if (!teacher.banco.trim()) newErrors.banco = 'Banco é obrigatório'
    if (!teacher.numeroConta.trim()) newErrors.numeroConta = 'Número da conta é obrigatório'
    if (teacher.nib && teacher.nib.length !== 21) {
      newErrors.nib = 'NIB deve ter 21 dígitos'
    }

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
      
      console.log('Docente atualizado:', teacher)
      
      // Redirecionar para a página de detalhes
      router.push(`/docentes/${params.id}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao atualizar docente:', error)
      setErrors({ submit: 'Erro ao salvar as alterações. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTeacher = async () => {
    try {
      // Simulação de API call para deletar
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/docentes')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir docente:', error)
    }
  }

  const handleResetForm = () => {
    if (window.confirm('Tem certeza que deseja descartar todas as alterações?')) {
      setTeacher(initialTeacherData)
      setPhotoPreview(initialTeacherData.fotoUrl)
      setErrors({})
    }
  }

  const getCursosByDepartamento = (departamentoId: string) => {
    return cursos.filter(curso => curso.departamentoId === departamentoId)
  }

  const sections = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'contact', label: 'Contactos', icon: Mail },
    { id: 'professional', label: 'Profissional', icon: Briefcase },
    { id: 'academic', label: 'Académico', icon: GraduationCap },
    { id: 'courses', label: 'Cursos', icon: Book },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'additional', label: 'Adicional', icon: FileText },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do docente...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Editar Docente</h1>
            <p className="text-gray-600">{teacher.nome} • {teacher.numeroFuncionario}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={`/docentes/${params.id}`}
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
                Estado do Docente
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status Profissional
                </label>
                <div className="space-y-2">
                  {estados.map(estado => (
                    <label key={estado} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="estado"
                        value={estado}
                        checked={teacher.estado === estado}
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
                  Excluir Docente
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
                        Título Profissional
                      </label>
                      <input
                        type="text"
                        value={teacher.tituloProfissional}
                        onChange={(e) => handleInputChange('tituloProfissional', e.target.value)}
                        className="w-full input-field"
                        placeholder="Ex: Dr., Prof., Eng., etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        id="nome"
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
                        id="dataNascimento"
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
                        value={teacher.numeroBI}
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NUIT *
                      </label>
                      <input
                        id="nuit"
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
                        id="telefone"
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Província *
                        </label>
                        <select
                          id="provincia"
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

            {/* Dados Profissionais */}
            {activeSection === 'professional' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Informações Profissionais
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Funcionário
                      </label>
                      <input
                        type="text"
                        value={teacher.numeroFuncionario}
                        disabled
                        className="w-full input-field bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <select
                        id="categoria"
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
                        id="regimeContratacao"
                        value={teacher.regimeContratacao}
                        onChange={(e) => handleInputChange('regimeContratacao', e.target.value)}
                        className={`w-full input-field ${errors.regimeContratacao ? 'border-red-300' : ''}`}
                      >
                        <option value="">Selecione</option>
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
                        id="dataAdmissao"
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
                        Carga Horária Semanal
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={teacher.cargaHorariaSemanal}
                        onChange={(e) => handleInputChange('cargaHorariaSemanal', e.target.value)}
                        className="w-full input-field"
                        placeholder="40"
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
              </div>
            )}

            {/* Dados Acadêmicos */}
            {activeSection === 'academic' && (
              <div className="space-y-6">
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
                        id="grauAcademico"
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
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instituição de Formação *
                      </label>
                      <input
                        id="instituicaoFormacao"
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

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Idiomas
                  </h2>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idiomas Falados
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {idiomas.map(idioma => (
                        <label key={idioma} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={teacher.idiomas.includes(idioma)}
                            onChange={(e) => handleArrayChange('idiomas', idioma, e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">{idioma}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cursos */}
            {activeSection === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Departamento
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento *
                      </label>
                      <select
                        id="departamentoId"
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
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Cursos Lecionados
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getCursosByDepartamento(teacher.departamentoId).map(curso => (
                            <label key={curso.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={teacher.cursos.includes(curso.id)}
                                onChange={(e) => handleArrayChange('cursos', curso.id, e.target.checked)}
                                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">{curso.nome}</p>
                                <p className="text-sm text-gray-600">{curso.codigo}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                        {teacher.cursos.length === 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            Selecione pelo menos um curso para atribuir ao docente.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cursos de Outros Departamentos */}
                {teacher.cursos.some(cursoId => {
                  const curso = cursos.find(c => c.id === cursoId)
                  return curso && curso.departamentoId !== teacher.departamentoId
                }) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-amber-900">Aviso</h3>
                        <p className="text-sm text-amber-700 mt-1">
                          Alguns cursos selecionados pertencem a outros departamentos. 
                          Certifique-se que é intencional.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dados Financeiros */}
            {activeSection === 'financial' && (
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
                        id="banco"
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
                        id="numeroConta"
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
              </div>
            )}

            {/* Informações Adicionais */}
            {activeSection === 'additional' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Adicionais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avaliação Média
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={teacher.avaliacaoMedia}
                          onChange={(e) => handleInputChange('avaliacaoMedia', e.target.value)}
                          className="w-full input-field"
                          placeholder="4.5"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">/5.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Necessidades Especiais
                      </label>
                      <textarea
                        value={teacher.necessidadesEspeciais}
                        onChange={(e) => handleInputChange('necessidadesEspeciais', e.target.value)}
                        rows={3}
                        className="w-full input-field"
                        placeholder="Descreva se houver necessidades especiais de saúde ou trabalho..."
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações
                      </label>
                      <textarea
                        value={teacher.observacoes}
                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                        rows={4}
                        className="w-full input-field"
                        placeholder="Outras informações relevantes..."
                      />
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
                        <p className="font-semibold text-gray-900">
                          {teacher.tituloProfissional ? `${teacher.tituloProfissional} ` : ''}{teacher.nome}
                        </p>
                        <p className="text-sm text-gray-600">
                          {teacher.email} • {teacher.telefone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {teacher.categoria} • {teacher.grauAcademico}
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
                        <p className="font-medium">{teacher.regimeContratacao}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estado:</span>
                        <p className="font-medium capitalize">{teacher.estado}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cursos:</span>
                        <p className="font-medium">{teacher.cursos.length}</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Excluir Docente</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir o docente <span className="font-semibold">{teacher.nome}</span>? 
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
                onClick={handleDeleteTeacher}
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