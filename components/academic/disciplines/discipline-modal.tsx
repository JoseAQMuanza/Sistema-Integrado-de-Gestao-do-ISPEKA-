'use client'

import { useState, useEffect } from 'react'
import {
  X, Save, BookOpen, Clock, Users, GraduationCap,
  FileText, AlertCircle, CheckCircle
} from 'lucide-react'

const initialData = {
  nome: '',
  codigo: '',
  descricao: '',
  cursoId: '',
  departamentoId: '',
  creditos: 6,
  cargaHoraria: 60,
  semestre: 1,
  tipo: 'obrigatoria',
  professorId: '',
  preRequisitos: [],
  ementa: '',
  bibliografia: '',
  metodologia: '',
  avaliacao: '',
  status: 'ativa'
}

const cursos = [
  { id: '1', nome: 'Direito', codigo: 'DIR' },
  { id: '2', nome: 'Engenharia Informática', codigo: 'INF' },
  { id: '3', nome: 'Enfermagem', codigo: 'ENF' }
]

const departamentos = [
  { id: '1', nome: 'Ciências Sociais e Humanas' },
  { id: '2', nome: 'Engenharia' },
  { id: '3', nome: 'Saúde' }
]

const professores = [
  { id: '1', nome: 'Dr. João Silva', departamento: 'Ciências Sociais' },
  { id: '2', nome: 'Dra. Maria Santos', departamento: 'Engenharia' },
  { id: '3', nome: 'Prof. Carlos Mendes', departamento: 'Saúde' }
]

const tipos = [
  { value: 'obrigatoria', label: 'Obrigatória' },
  { value: 'optativa', label: 'Optativa' },
  { value: 'livre', label: 'Livre' }
]

interface DisciplinaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  disciplina?: any
}

export default function DisciplinaModal({ isOpen, onClose, onSave, disciplina }: DisciplinaModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (disciplina) {
      setFormData(disciplina)
    } else {
      setFormData(initialData)
    }
  }, [disciplina])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.codigo.trim()) newErrors.codigo = 'Código é obrigatório'
    if (!formData.cursoId) newErrors.cursoId = 'Curso é obrigatório'
    if (!formData.creditos || formData.creditos <= 0) newErrors.creditos = 'Créditos inválidos'
    if (!formData.cargaHoraria || formData.cargaHoraria <= 0) newErrors.cargaHoraria = 'Carga horária inválida'
    if (!formData.semestre || formData.semestre < 1 || formData.semestre > 10) newErrors.semestre = 'Semestre inválido'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    
    // Simular API call
    setTimeout(() => {
      onSave(formData)
      setIsSubmitting(false)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {disciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
                </h2>
                <p className="text-gray-600">
                  {disciplina ? 'Atualize os dados da disciplina' : 'Preencha os dados da nova disciplina'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
                  className={`w-full input-field ${errors.codigo ? 'border-red-300' : ''}`}
                  placeholder="Ex: DIR-101"
                />
                {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className={`w-full input-field ${errors.nome ? 'border-red-300' : ''}`}
                  placeholder="Nome da disciplina"
                />
                {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso *
                </label>
                <select
                  value={formData.cursoId}
                  onChange={(e) => handleChange('cursoId', e.target.value)}
                  className={`w-full input-field ${errors.cursoId ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecione o curso</option>
                  {cursos.map(curso => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nome} ({curso.codigo})
                    </option>
                  ))}
                </select>
                {errors.cursoId && <p className="mt-1 text-sm text-red-600">{errors.cursoId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  value={formData.departamentoId}
                  onChange={(e) => handleChange('departamentoId', e.target.value)}
                  className="w-full input-field"
                >
                  <option value="">Selecione o departamento</option>
                  {departamentos.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Créditos *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.creditos}
                  onChange={(e) => handleChange('creditos', parseInt(e.target.value))}
                  className={`w-full input-field ${errors.creditos ? 'border-red-300' : ''}`}
                />
                {errors.creditos && <p className="mt-1 text-sm text-red-600">{errors.creditos}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carga Horária (h) *
                </label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={formData.cargaHoraria}
                  onChange={(e) => handleChange('cargaHoraria', parseInt(e.target.value))}
                  className={`w-full input-field ${errors.cargaHoraria ? 'border-red-300' : ''}`}
                />
                {errors.cargaHoraria && <p className="mt-1 text-sm text-red-600">{errors.cargaHoraria}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semestre *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.semestre}
                  onChange={(e) => handleChange('semestre', parseInt(e.target.value))}
                  className={`w-full input-field ${errors.semestre ? 'border-red-300' : ''}`}
                />
                {errors.semestre && <p className="mt-1 text-sm text-red-600">{errors.semestre}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {tipos.map(tipo => (
                    <label
                      key={tipo.value}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                        formData.tipo === tipo.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipo"
                        value={tipo.value}
                        checked={formData.tipo === tipo.value}
                        onChange={(e) => handleChange('tipo', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm">{tipo.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professor
                </label>
                <select
                  value={formData.professorId}
                  onChange={(e) => handleChange('professorId', e.target.value)}
                  className="w-full input-field"
                >
                  <option value="">Selecione o professor</option>
                  {professores.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                rows={3}
                className="w-full input-field"
                placeholder="Descrição da disciplina..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="ativa"
                    checked={formData.status === 'ativa'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Ativa</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inativa"
                    checked={formData.status === 'inativa'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Inativa</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {disciplina ? 'Atualizar' : 'Criar'} Disciplina
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}