'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, X, Building2, Users, Mail, Phone,
  MapPin, Calendar, DollarSign, Target, AlertCircle,
  Eye, FileText, CheckCircle
} from 'lucide-react'

// Dados iniciais
const initialDepartmentData = {
  id: 1,
  codigo: 'CSH',
  nome: 'Ciências Sociais e Humanas',
  areaCientifica: 'Humanidades',
  descricao: 'Departamento dedicado às ciências humanas.',
  telefone: '+244 923 456 789',
  email: 'csh@ispeka.edu.ao',
  endereco: 'Edifício Central, 2º Andar',
  sala: 'Sala 201',
  chefeId: '1',
  viceChefeId: '2',
  dataCriacao: '2010-03-15',
  orcamentoAnual: '12500000',
  areaFisica: '450',
  numeroSalas: '12',
  missao: 'Formar profissionais em ciências humanas.',
  visao: 'Ser referência nacional.',
  objetivos: 'Excelência no ensino; Pesquisa de qualidade',
  estado: 'ativo',
  dataAtivacao: '2010-04-01',
  observacoes: ''
}

const areasCientificas = ['Humanidades', 'Engenharias', 'Ciências da Saúde', 'Ciências Sociais']
const estados = ['ativo', 'inativo', 'em_reestruturacao', 'em_implementacao']
const docentes = [
  { id: '1', nome: 'Dr. João Silva' },
  { id: '2', nome: 'Prof. Maria Santos' },
  { id: '3', nome: 'Dra. Ana Oliveira' }
]

export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [department, setDepartment] = useState(initialDepartmentData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('basic')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setDepartment(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!department.codigo.trim()) newErrors.codigo = 'Código é obrigatório'
    if (!department.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!department.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!department.chefeId) newErrors.chefeId = 'Chefe é obrigatório'
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/departamentos/${params.id}`)
    setIsSubmitting(false)
  }

  const handleReset = () => {
    if (window.confirm('Descartar alterações?')) {
      setDepartment(initialDepartmentData)
      setErrors({})
    }
  }

  const sections = [
    { id: 'basic', label: 'Básico', icon: Building2 },
    { id: 'structure', label: 'Estrutura', icon: Users },
    { id: 'mission', label: 'Missão', icon: Target },
    { id: 'resources', label: 'Recursos', icon: DollarSign }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Departamento</h1>
            <p className="text-gray-600">{department.nome} • {department.codigo}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a href={`/departamentos/${params.id}`} className="btn-secondary">
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </a>
          <button onClick={handleReset} className="btn-secondary">
            <X className="w-4 h-4 mr-2" />
            Descartar
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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
      <div className="bg-white rounded-xl border p-4">
        <div className="flex overflow-x-auto space-x-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2.5 rounded-lg whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Estado</h3>
              <div className="space-y-2">
                {estados.map(estado => (
                  <label key={estado} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="estado"
                      value={estado}
                      checked={department.estado === estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm capitalize">{estado}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Básico */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                      <input
                        value={department.codigo}
                        onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                        className={`w-full input-field ${errors.codigo ? 'border-red-300' : ''}`}
                        maxLength={5}
                      />
                      {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Área Científica</label>
                      <select
                        value={department.areaCientifica}
                        onChange={(e) => handleInputChange('areaCientifica', e.target.value)}
                        className="w-full input-field"
                      >
                        {areasCientificas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                      <input
                        value={department.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        className={`w-full input-field ${errors.nome ? 'border-red-300' : ''}`}
                      />
                      {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                      <textarea
                        value={department.descricao}
                        onChange={(e) => handleInputChange('descricao', e.target.value)}
                        rows={3}
                        className="w-full input-field"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Contactos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                      <input
                        value={department.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        value={department.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full input-field ${errors.email ? 'border-red-300' : ''}`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                      <input
                        value={department.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sala</label>
                      <input
                        value={department.sala}
                        onChange={(e) => handleInputChange('sala', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estrutura */}
            {activeSection === 'structure' && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Estrutura Organizacional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chefe *</label>
                    <select
                      value={department.chefeId}
                      onChange={(e) => handleInputChange('chefeId', e.target.value)}
                      className={`w-full input-field ${errors.chefeId ? 'border-red-300' : ''}`}
                    >
                      <option value="">Selecione</option>
                      {docentes.map(docente => (
                        <option key={docente.id} value={docente.id}>{docente.nome}</option>
                      ))}
                    </select>
                    {errors.chefeId && <p className="mt-1 text-sm text-red-600">{errors.chefeId}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vice-Chefe</label>
                    <select
                      value={department.viceChefeId}
                      onChange={(e) => handleInputChange('viceChefeId', e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="">Selecione</option>
                      {docentes.map(docente => (
                        <option key={docente.id} value={docente.id}>{docente.nome}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Criação</label>
                    <input
                      type="date"
                      value={department.dataCriacao}
                      onChange={(e) => handleInputChange('dataCriacao', e.target.value)}
                      className="w-full input-field"
                    />
                  </div>
                  
                  {department.estado === 'ativo' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data de Ativação</label>
                      <input
                        type="date"
                        value={department.dataAtivacao}
                        onChange={(e) => handleInputChange('dataAtivacao', e.target.value)}
                        className="w-full input-field"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Missão */}
            {activeSection === 'mission' && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Missão, Visão e Objetivos</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Missão</label>
                    <textarea
                      value={department.missao}
                      onChange={(e) => handleInputChange('missao', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visão</label>
                    <textarea
                      value={department.visao}
                      onChange={(e) => handleInputChange('visao', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
                    <textarea
                      value={department.objetivos}
                      onChange={(e) => handleInputChange('objetivos', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                      placeholder="Separe cada objetivo com ponto e vírgula (;)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Recursos */}
            {activeSection === 'resources' && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recursos e Infraestrutura</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orçamento Anual (AOA)</label>
                    <input
                      value={department.orcamentoAnual}
                      onChange={(e) => handleInputChange('orcamentoAnual', e.target.value)}
                      className="w-full input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Área Física (m²)</label>
                    <input
                      type="number"
                      value={department.areaFisica}
                      onChange={(e) => handleInputChange('areaFisica', e.target.value)}
                      className="w-full input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Salas</label>
                    <input
                      type="number"
                      value={department.numeroSalas}
                      onChange={(e) => handleInputChange('numeroSalas', e.target.value)}
                      className="w-full input-field"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                    <textarea
                      value={department.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Última atualização: {new Date().toLocaleDateString('pt-AO')}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button type="button" onClick={() => router.back()} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
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
    </div>
  )
}