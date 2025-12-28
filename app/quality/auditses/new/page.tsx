'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, X, FileText, Calendar, Users,
  Building2, AlertCircle, CheckCircle, Upload,
  Plus, Trash2, Search
} from 'lucide-react'

// Dados iniciais
const initialAuditData = {
  // Informações básicas
  titulo: '',
  tipo: 'Interna',
  descricao: '',
  departamentoId: '',
  dataProgramada: '',
  horaInicio: '09:00',
  horaFim: '17:00',
  
  // Âmbito
  ambito: '',
  normas: ['ISO 9001:2015', 'Normas Internas ISPEKA'],
  criterios: '',
  
  // Equipe de auditoria
  auditores: [] as string[],
  liderAuditoria: '',
  observadores: [] as string[],
  
  // Recursos
  documentosNecessarios: [] as string[],
  salasEquipamentos: '',
  
  // Comunicação
  contatoDepartamento: '',
  emailContato: '',
  
  // Status
  status: 'planejada',
  prioridade: 'media',
  observacoes: ''
}

const auditTypes = [
  { value: 'Interna', label: 'Auditoria Interna' },
  { value: 'Externa', label: 'Auditoria Externa' },
  { value: 'Recertificacao', label: 'Recertificação' },
  { value: 'Especial', label: 'Auditoria Especial' }
]

const departments = [
  { id: '1', nome: 'Ciências Sociais e Humanas', codigo: 'CSH' },
  { id: '2', nome: 'Engenharia', codigo: 'ENG' },
  { id: '3', nome: 'Saúde', codigo: 'SAU' },
  { id: '4', nome: 'Gestão e Contabilidade', codigo: 'GES' }
]

const priorities = [
  { value: 'alta', label: 'Alta', color: 'red' },
  { value: 'media', label: 'Média', color: 'amber' },
  { value: 'baixa', label: 'Baixa', color: 'blue' }
]

const auditoresDisponiveis = [
  { id: 'A1', nome: 'Dr. João Silva', departamento: 'CSH', especialidade: 'Qualidade' },
  { id: 'A2', nome: 'Dra. Maria Santos', departamento: 'ENG', especialidade: 'Processos' },
  { id: 'A3', nome: 'Prof. Carlos Mendes', departamento: 'SAU', especialidade: 'Acadêmico' },
  { id: 'A4', nome: 'Eng. Ana Pereira', departamento: 'GES', especialidade: 'Administrativo' }
]

const normasOptions = [
  'ISO 9001:2015',
  'Normas Internas ISPEKA',
  'Diretrizes Ministeriais',
  'Regulamento Acadêmico',
  'Manual de Qualidade'
]

export default function NovaAuditoriaPage() {
  const router = useRouter()
  const [audit, setAudit] = useState<typeof initialAuditData>(initialAuditData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [searchAuditor, setSearchAuditor] = useState('')
  const [selectedAuditors, setSelectedAuditors] = useState<string[]>([])
  const [selectedNorms, setSelectedNorms] = useState<string[]>(audit.normas)
  const [newDocument, setNewDocument] = useState('')

  const totalSteps = 4

  const handleInputChange = (field: string, value: any) => {
    setAudit(prev => ({ ...prev, [field]: value }))
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
      if (!audit.titulo.trim()) newErrors.titulo = 'Título é obrigatório'
      if (!audit.departamentoId) newErrors.departamentoId = 'Departamento é obrigatório'
      if (!audit.dataProgramada) newErrors.dataProgramada = 'Data programada é obrigatória'
      
      const selectedDate = new Date(audit.dataProgramada)
      const today = new Date()
      if (selectedDate < today) {
        newErrors.dataProgramada = 'A data não pode ser no passado'
      }
    }

    if (step === 2) {
      if (!audit.ambito.trim()) newErrors.ambito = 'Âmbito é obrigatório'
      if (selectedNorms.length === 0) newErrors.normas = 'Selecione pelo menos uma norma'
    }

    if (step === 3) {
      if (selectedAuditors.length === 0) newErrors.auditores = 'Selecione pelo menos um auditor'
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

  const handleAddAuditor = (auditorId: string) => {
    if (!selectedAuditors.includes(auditorId)) {
      setSelectedAuditors(prev => [...prev, auditorId])
    }
  }

  const handleRemoveAuditor = (auditorId: string) => {
    setSelectedAuditors(prev => prev.filter(id => id !== auditorId))
  }

  const handleToggleNorm = (norm: string) => {
    setSelectedNorms(prev => 
      prev.includes(norm) 
        ? prev.filter(n => n !== norm)
        : [...prev, norm]
    )
  }

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setAudit(prev => ({
        ...prev,
        documentosNecessarios: [...prev.documentosNecessarios, newDocument.trim()]
      }))
      setNewDocument('')
    }
  }

  const handleRemoveDocument = (index: number) => {
    setAudit(prev => ({
      ...prev,
      documentosNecessarios: prev.documentosNecessarios.filter((_, i) => i !== index)
    }))
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

    // Todas etapas validadas, submeter
    setIsSubmitting(true)
    
    try {
      // Gerar código da auditoria (exemplo)
      const codigo = `AUD-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      
      const auditData = {
        ...audit,
        codigo,
        auditores: selectedAuditors,
        normas: selectedNorms,
        dataCriacao: new Date().toISOString()
      }
      
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Nova auditoria criada:', auditData)
      
      // Redirecionar para a página de detalhes
      const newAuditId = Math.floor(Math.random() * 1000)
      router.push(`/qualidade/auditorias/${newAuditId}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao criar auditoria:', error)
      setErrors({ submit: 'Erro ao criar a auditoria. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = (activeStep / totalSteps) * 100

  const filteredAuditors = auditoresDisponiveis.filter(auditor =>
    auditor.nome.toLowerCase().includes(searchAuditor.toLowerCase()) ||
    auditor.departamento.toLowerCase().includes(searchAuditor.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold text-gray-900">Nova Auditoria</h1>
            <p className="text-gray-600">Planeje uma nova auditoria interna</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAudit(initialAuditData)}
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
                Criar Auditoria
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
                {step === 1 && 'Planejamento'}
                {step === 2 && 'Âmbito'}
                {step === 3 && 'Equipe'}
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
        {/* Step 1: Planejamento */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Informações Básicas
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Auditoria *
                    </label>
                    <input
                      type="text"
                      value={audit.titulo}
                      onChange={(e) => handleInputChange('titulo', e.target.value)}
                      className={`w-full input-field ${errors.titulo ? 'border-red-300' : ''}`}
                      placeholder="Ex: Auditoria Interna - Departamento de Engenharia"
                    />
                    {errors.titulo && (
                      <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Auditoria
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {auditTypes.map(type => (
                        <label
                          key={type.value}
                          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                            audit.tipo === type.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tipo"
                            value={type.value}
                            checked={audit.tipo === type.value}
                            onChange={(e) => handleInputChange('tipo', e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={audit.descricao}
                      onChange={(e) => handleInputChange('descricao', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                      placeholder="Descreva os objetivos e foco da auditoria..."
                    />
                  </div>
                </div>
              </div>

              {/* Prioridade */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Prioridade</h2>
                
                <div className="space-y-2">
                  {priorities.map(priority => (
                    <label
                      key={priority.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        audit.prioridade === priority.value
                          ? `border-${priority.color}-500 bg-${priority.color}-50`
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="prioridade"
                        value={priority.value}
                        checked={audit.prioridade === priority.value}
                        onChange={(e) => handleInputChange('prioridade', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full bg-${priority.color}-500 mr-3`}></div>
                      <span className="text-sm">{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Agendamento e Local */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendamento
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Programada *
                    </label>
                    <input
                      type="date"
                      value={audit.dataProgramada}
                      onChange={(e) => handleInputChange('dataProgramada', e.target.value)}
                      className={`w-full input-field ${errors.dataProgramada ? 'border-red-300' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dataProgramada && (
                      <p className="mt-1 text-sm text-red-600">{errors.dataProgramada}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Início
                      </label>
                      <input
                        type="time"
                        value={audit.horaInicio}
                        onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Término
                      </label>
                      <input
                        type="time"
                        value={audit.horaFim}
                        onChange={(e) => handleInputChange('horaFim', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento *
                    </label>
                    <select
                      value={audit.departamentoId}
                      onChange={(e) => handleInputChange('departamentoId', e.target.value)}
                      className={`w-full input-field ${errors.departamentoId ? 'border-red-300' : ''}`}
                    >
                      <option value="">Selecione o departamento</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.nome} ({dept.codigo})
                        </option>
                      ))}
                    </select>
                    {errors.departamentoId && (
                      <p className="mt-1 text-sm text-red-600">{errors.departamentoId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Local e Equipamentos */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Local e Equipamentos</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salas/Equipamentos Necessários
                  </label>
                  <input
                    type="text"
                    value={audit.salasEquipamentos}
                    onChange={(e) => handleInputChange('salasEquipamentos', e.target.value)}
                    className="w-full input-field"
                    placeholder="Ex: Sala de reuniões, projetor, internet..."
                  />
                </div>
              </div>

              {/* Contato */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contato do Departamento</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Contato
                    </label>
                    <input
                      type="text"
                      value={audit.contatoDepartamento}
                      onChange={(e) => handleInputChange('contatoDepartamento', e.target.value)}
                      className="w-full input-field"
                      placeholder="Nome da pessoa de contato"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={audit.emailContato}
                      onChange={(e) => handleInputChange('emailContato', e.target.value)}
                      className="w-full input-field"
                      placeholder="contato@ispeka.edu.ao"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Âmbito */}
        {activeStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Âmbito e Critérios */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Âmbito da Auditoria</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Âmbito *
                    </label>
                    <textarea
                      value={audit.ambito}
                      onChange={(e) => handleInputChange('ambito', e.target.value)}
                      className={`w-full input-field ${errors.ambito ? 'border-red-300' : ''}`}
                      rows={3}
                      placeholder="Descreva o escopo e limites da auditoria..."
                    />
                    {errors.ambito && (
                      <p className="mt-1 text-sm text-red-600">{errors.ambito}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Critérios de Auditoria
                    </label>
                    <textarea
                      value={audit.criterios}
                      onChange={(e) => handleInputChange('criterios', e.target.value)}
                      className="w-full input-field"
                      rows={3}
                      placeholder="Liste os critérios e referências para a auditoria..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Normas Aplicáveis */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Normas Aplicáveis</h2>
                
                <div className="space-y-3 mb-4">
                  {errors.normas && (
                    <p className="text-sm text-red-600">{errors.normas}</p>
                  )}
                  
                  {normasOptions.map(norm => (
                    <label
                      key={norm}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedNorms.includes(norm)}
                        onChange={() => handleToggleNorm(norm)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{norm}</span>
                    </label>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Outra Norma
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite uma nova norma..."
                      className="flex-1 input-field"
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Equipe */}
        {activeStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seleção de Auditores */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Equipe de Auditoria
                </h2>
                
                <div className="mb-6">
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchAuditor}
                      onChange={(e) => setSearchAuditor(e.target.value)}
                      placeholder="Pesquisar auditores..."
                      className="pl-10 w-full input-field"
                    />
                  </div>
                  
                  {errors.auditores && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.auditores}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {filteredAuditors.map(auditor => (
                      <div
                        key={auditor.id}
                        className={`p-4 border rounded-lg flex items-center justify-between ${
                          selectedAuditors.includes(auditor.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{auditor.nome}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <Building2 className="w-3 h-3 mr-1" />
                              {auditor.departamento}
                              <span className="mx-2">•</span>
                              {auditor.especialidade}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => 
                            selectedAuditors.includes(auditor.id)
                              ? handleRemoveAuditor(auditor.id)
                              : handleAddAuditor(auditor.id)
                          }
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            selectedAuditors.includes(auditor.id)
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {selectedAuditors.includes(auditor.id) ? 'Remover' : 'Adicionar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipe Selecionada e Líder */}
            <div className="space-y-6">
              {/* Equipe Selecionada */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipe Selecionada</h2>
                
                {selectedAuditors.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum auditor selecionado</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Selecione auditores da lista ao lado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedAuditors.map(auditorId => {
                      const auditor = auditoresDisponiveis.find(a => a.id === auditorId)
                      return (
                        <div key={auditorId} className="p-3 border rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium text-sm">
                                {auditor?.nome.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{auditor?.nome}</p>
                              <p className="text-sm text-gray-600">{auditor?.departamento}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAuditor(auditorId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Líder da Auditoria */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Líder da Auditoria</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Líder
                  </label>
                  <select
                    value={audit.liderAuditoria}
                    onChange={(e) => handleInputChange('liderAuditoria', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Selecione o líder</option>
                    {selectedAuditors.map(auditorId => {
                      const auditor = auditoresDisponiveis.find(a => a.id === auditorId)
                      return (
                        <option key={auditorId} value={auditorId}>
                          {auditor?.nome}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Recursos */}
        {activeStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Documentos Necessários */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Documentos Necessários</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Documento
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      placeholder="Ex: Manual de Procedimentos"
                      className="flex-1 input-field"
                    />
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {audit.documentosNecessarios.map((documento, index) => (
                    <div key={index} className="p-3 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{documento}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {audit.documentosNecessarios.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum documento adicionado</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Adicione os documentos necessários para a auditoria
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Observações e Finalização */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Observações Finais</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={audit.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={6}
                    className="w-full input-field"
                    placeholder="Adicione quaisquer observações adicionais..."
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Auditoria</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{audit.titulo || '[Título da Auditoria]'}</p>
                      <p className="text-sm text-gray-600">
                        {auditTypes.find(t => t.value === audit.tipo)?.label || 'Tipo não selecionado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Departamento:</span>
                      <p className="font-medium">
                        {departments.find(d => d.id === audit.departamentoId)?.nome || '[Não selecionado]'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">
                        {audit.dataProgramada || '[Não definida]'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Equipe:</span>
                      <p className="font-medium">{selectedAuditors.length} auditores</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-medium capitalize">Planejada</p>
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
                onClick={() => setAudit(initialAuditData)}
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
                      Criar Auditoria
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