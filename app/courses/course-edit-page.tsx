'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Check,
  GraduationCap,
  Building2,
  Clock,
  Award,
  Calendar,
  FileText,
  Users
} from 'lucide-react'

import { coordinators, regimes, degrees, modalities, shifts, states, departmentsD, initialCourseData  } from "./courses-utilities"
// Dados mockados do curso para edição

export default function CourseEditPage() {
  const router = useRouter()
  const [course, setCourse] = useState(initialCourseData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newSpecialization, setNewSpecialization] = useState({ nome: '', descricao: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }))
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!course.codigo.trim()) newErrors.codigo = 'Código é obrigatório'
    if (!course.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!course.departamentoId) newErrors.departamentoId = 'Departamento é obrigatório'
    if (!course.duracao || course.duracao < 1) newErrors.duracao = 'Duração inválida'
    if (!course.regime) newErrors.regime = 'Regime é obrigatório'
    if (!course.grau) newErrors.grau = 'Grau é obrigatório'

    // Validar código único (simulação)
    if (course.codigo !== initialCourseData.codigo && course.codigo === 'COD-EXISTENTE') {
      newErrors.codigo = 'Este código já está em uso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Curso atualizado:', course)
      
      // Redirecionar para a página de detalhes
      router.push(`/courses/edit/${1}`)
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao atualizar curso:', error)
      setErrors({ submit: 'Erro ao salvar as alterações. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSpecialization = () => {
    if (!newSpecialization.nome.trim()) {
      setErrors(prev => ({ ...prev, especializacao: 'Nome da especialização é obrigatório' }))
      return
    }

    const newSpecializationData = {
      id: Date.now(), // ID temporário
      nome: newSpecialization.nome,
      descricao: newSpecialization.descricao
    }

    setCourse(prev => ({
      ...prev,
      especializacoes: [...prev.especializacoes, newSpecializationData]
    }))

    setNewSpecialization({ nome: '', descricao: '' })
    if (errors.especializacao) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.especializacao
        return newErrors
      })
    }
  }

  const handleRemoveSpecialization = (id: number) => {
    setCourse(prev => ({
      ...prev,
      especializacoes: prev.especializacoes.filter(esp => esp.id !== id)
    }))
  }

  const handleDeleteCourse = async () => {
    try {
      // Simulação de API call para deletar
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/cursos')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
            <p className="text-gray-600">Atualize as informações do curso</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="btn-secondary"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
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

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Informações Básicas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Informações Gerais */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Informações Gerais
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código do Curso *
                    </label>
                    <input
                      type="text"
                      value={course.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      className={`w-full input-field ${errors.codigo ? 'border-red-300' : ''}`}
                      placeholder="Ex: DIR-001"
                    />
                    {errors.codigo && (
                      <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Curso *
                    </label>
                    <input
                      type="text"
                      value={course.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className={`w-full input-field ${errors.nome ? 'border-red-300' : ''}`}
                      placeholder="Ex: Direito"
                    />
                    {errors.nome && (
                      <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={course.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={4}
                    className="w-full input-field"
                    placeholder="Descreva o curso, objetivos, perfil do egresso..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento *
                    </label>
                    <select
                      value={course.departamentoId}
                      onChange={(e) => handleInputChange('departamentoId', e.target.value)}
                      className={`w-full input-field ${errors.departamentoId ? 'border-red-300' : ''}`}
                    >
                      <option value="">Selecione um departamento</option>
                      {departmentsD.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.nome}
                        </option>
                      ))}
                    </select>
                    {errors.departamentoId && (
                      <p className="mt-1 text-sm text-red-600">{errors.departamentoId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coordenador
                    </label>
                    <select
                      value={course.coordenadorId}
                      onChange={(e) => handleInputChange('coordenadorId', e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="">Selecione um coordenador</option>
                      {coordinators.map(coord => (
                        <option key={coord.id} value={coord.id}>
                          {coord.nome} ({coord.departamento})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Especializações */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Especializações
              </h2>
              
              <div className="space-y-4">
                {course.especializacoes.map(especializacao => (
                  <div key={especializacao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{especializacao.nome}</p>
                      {especializacao.descricao && (
                        <p className="text-sm text-gray-600">{especializacao.descricao}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(especializacao.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Especialização</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newSpecialization.nome}
                      onChange={(e) => setNewSpecialization(prev => ({ ...prev, nome: e.target.value }))}
                      className={`w-full input-field ${errors.especializacao ? 'border-red-300' : ''}`}
                      placeholder="Nome da especialização"
                    />
                    <textarea
                      value={newSpecialization.descricao}
                      onChange={(e) => setNewSpecialization(prev => ({ ...prev, descricao: e.target.value }))}
                      rows={2}
                      className="w-full input-field"
                      placeholder="Descrição (opcional)"
                    />
                    {errors.especializacao && (
                      <p className="text-sm text-red-600">{errors.especializacao}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleAddSpecialization}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Especialização
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Configurações */}
          <div className="space-y-6">
            {/* Card Configurações Acadêmicas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Configurações Acadêmicas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração (anos) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={course.duracao}
                    onChange={(e) => handleInputChange('duracao', parseInt(e.target.value))}
                    className={`w-full input-field ${errors.duracao ? 'border-red-300' : ''}`}
                  />
                  {errors.duracao && (
                    <p className="mt-1 text-sm text-red-600">{errors.duracao}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regime *
                  </label>
                  <select
                    value={course.regime}
                    onChange={(e) => handleInputChange('regime', e.target.value)}
                    className={`w-full input-field ${errors.regime ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione o regime</option>
                    {regimes.map(regime => (
                      <option key={regime} value={regime}>{regime}</option>
                    ))}
                  </select>
                  {errors.regime && (
                    <p className="mt-1 text-sm text-red-600">{errors.regime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grau *
                  </label>
                  <select
                    value={course.grau}
                    onChange={(e) => handleInputChange('grau', e.target.value)}
                    className={`w-full input-field ${errors.grau ? 'border-red-300' : ''}`}
                  >
                    <option value="">Selecione o grau</option>
                    {degrees.map(grau => (
                      <option key={grau} value={grau}>{grau}</option>
                    ))}
                  </select>
                  {errors.grau && (
                    <p className="mt-1 text-sm text-red-600">{errors.grau}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turno
                  </label>
                  <select
                    value={course.turno}
                    onChange={(e) => handleInputChange('turno', e.target.value)}
                    className="w-full input-field"
                  >
                    {shifts.map(turno => (
                      <option key={turno} value={turno}>{turno}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidade
                  </label>
                  <select
                    value={course.modalidade}
                    onChange={(e) => handleInputChange('modalidade', e.target.value)}
                    className="w-full input-field"
                  >
                    {modalities.map(modalidade => (
                      <option key={modalidade} value={modalidade}>{modalidade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Card Configurações Numéricas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Configurações Numéricas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carga Horária Total (horas)
                  </label>
                  <input
                    type="number"
                    value={course.cargaHorariaTotal}
                    onChange={(e) => handleInputChange('cargaHorariaTotal', parseInt(e.target.value))}
                    className="w-full input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Créditos Totais
                  </label>
                  <input
                    type="number"
                    value={course.creditosTotais}
                    onChange={(e) => handleInputChange('creditosTotais', parseInt(e.target.value))}
                    className="w-full input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vagas Anuais
                  </label>
                  <input
                    type="number"
                    value={course.vagasAnuais}
                    onChange={(e) => handleInputChange('vagasAnuais', parseInt(e.target.value))}
                    className="w-full input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano de Criação
                  </label>
                  <input
                    type="number"
                    value={course.anoCriacao}
                    onChange={(e) => handleInputChange('anoCriacao', e.target.value)}
                    className="w-full input-field"
                    placeholder="Ex: 2015"
                  />
                </div>
              </div>
            </div>

            {/* Card Estado do Curso */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Estado do Curso
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status Atual
                </label>
                <div className="space-y-2">
                  {states.map(estado => (
                    <label key={estado} className="flex items-center">
                      <input
                        type="radio"
                        name="estado"
                        value={estado}
                        checked={course.estado === estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">
                        {estado.replace('_', ' ')}
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
                  Excluir Curso
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Última atualização: 10 Jan 2024
              </p>
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
                <h3 className="text-lg font-semibold text-gray-900">Excluir Curso</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir o curso <span className="font-semibold">{course.nome}</span>? 
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
                onClick={handleDeleteCourse}
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