'use client'

import { useState, useEffect } from 'react'
import {
  X, Save, Calendar, Clock, Building, BookOpen,
  User, AlertCircle, Plus, Minus, CheckCircle
} from 'lucide-react'

const initialData = {
  turmaId: '',
  disciplina: '',
  professorId: '',
  dia: 'segunda',
  inicio: '08:00',
  fim: '10:00',
  sala: '',
  curso: '',
  periodoId: '',
  status: 'ativo',
  observacoes: '',
  dataInicio: '',
  dataFim: ''
}

const turmas = [
  { id: '1', codigo: 'TUR-DIR101-A', disciplina: 'Direito Civil I', curso: 'Direito' },
  { id: '2', codigo: 'TUR-INF201-B', disciplina: 'Programação Avançada', curso: 'Engenharia Informática' },
  { id: '3', codigo: 'TUR-ENF102-C', disciplina: 'Anatomia Humana', curso: 'Enfermagem' }
]

const professores = [
  { id: '1', nome: 'Dr. João Silva', departamento: 'Ciências Sociais' },
  { id: '2', nome: 'Dra. Maria Santos', departamento: 'Engenharia' },
  { id: '3', nome: 'Prof. Carlos Mendes', departamento: 'Saúde' }
]

const periodos = [
  { id: '1', nome: '2023/2024 - 1º Semestre' },
  { id: '2', nome: '2023/2024 - 2º Semestre' },
  { id: '3', nome: '2024/2025 - 1º Semestre' }
]

const diasSemana = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' }
]

const salas = [
  'Sala 101 - Bloco A',
  'Sala 102 - Bloco A',
  'Lab. Informática 1',
  'Lab. Informática 2',
  'Anfiteatro Anatomia',
  'Auditório Principal'
]

interface HorarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  horario?: any
}

export default function HorarioModal({ isOpen, onClose, onSave, horario }: HorarioModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (horario) {
      setFormData(horario)
    } else {
      setFormData(initialData)
    }
  }, [horario])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.turmaId) newErrors.turmaId = 'Turma é obrigatória'
    if (!formData.professorId) newErrors.professorId = 'Professor é obrigatório'
    if (!formData.periodoId) newErrors.periodoId = 'Período é obrigatório'
    if (!formData.dia) newErrors.dia = 'Dia é obrigatório'
    if (!formData.inicio) newErrors.inicio = 'Hora início é obrigatória'
    if (!formData.fim) newErrors.fim = 'Hora fim é obrigatória'
    
    if (formData.inicio && formData.fim) {
      const inicio = new Date(`2000/01/01 ${formData.inicio}`)
      const fim = new Date(`2000/01/01 ${formData.fim}`)
      if (inicio >= fim) {
        newErrors.fim = 'Hora fim deve ser posterior à hora início'
      }
      
      const diffMinutes = (fim.getTime() - inicio.getTime()) / (1000 * 60)
      if (diffMinutes < 60 || diffMinutes > 240) {
        newErrors.fim = 'Aula deve ter entre 1h e 4h'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    
    // Simular API call
    setTimeout(() => {
      const horarioData = {
        ...formData,
        dataCriacao: new Date().toISOString()
      }
      
      onSave(horarioData)
      setIsSubmitting(false)
    }, 500)
  }

  if (!isOpen) return null

  const turmaSelecionada = turmas.find(t => t.id === formData.turmaId)
  const professorSelecionado = professores.find(p => p.id === formData.professorId)
  const periodoSelecionado = periodos.find(p => p.id === formData.periodoId)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {horario ? 'Editar Horário' : 'Novo Horário'}
                </h2>
                <p className="text-gray-600">
                  {horario ? 'Atualize os dados do horário' : 'Preencha os dados do novo horário'}
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
                  Turma *
                </label>
                <select
                  value={formData.turmaId}
                  onChange={(e) => handleChange('turmaId', e.target.value)}
                  className={`w-full input-field ${errors.turmaId ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecione a turma</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>
                      {turma.codigo} - {turma.disciplina} ({turma.curso})
                    </option>
                  ))}
                </select>
                {errors.turmaId && <p className="mt-1 text-sm text-red-600">{errors.turmaId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professor *
                </label>
                <select
                  value={formData.professorId}
                  onChange={(e) => handleChange('professorId', e.target.value)}
                  className={`w-full input-field ${errors.professorId ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecione o professor</option>
                  {professores.map(professor => (
                    <option key={professor.id} value={professor.id}>
                      {professor.nome}
                    </option>
                  ))}
                </select>
                {errors.professorId && <p className="mt-1 text-sm text-red-600">{errors.professorId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período *
                </label>
                <select
                  value={formData.periodoId}
                  onChange={(e) => handleChange('periodoId', e.target.value)}
                  className={`w-full input-field ${errors.periodoId ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecione o período</option>
                  {periodos.map(periodo => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nome}
                    </option>
                  ))}
                </select>
                {errors.periodoId && <p className="mt-1 text-sm text-red-600">{errors.periodoId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sala
                </label>
                <select
                  value={formData.sala}
                  onChange={(e) => handleChange('sala', e.target.value)}
                  className="w-full input-field"
                >
                  <option value="">Selecione a sala</option>
                  {salas.map(sala => (
                    <option key={sala} value={sala}>
                      {sala}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Horário */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Horário da Aula</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dia da Semana *
                  </label>
                  <select
                    value={formData.dia}
                    onChange={(e) => handleChange('dia', e.target.value)}
                    className={`w-full input-field ${errors.dia ? 'border-red-300' : ''}`}
                  >
                    {diasSemana.map(dia => (
                      <option key={dia.value} value={dia.value}>
                        {dia.label}
                      </option>
                    ))}
                  </select>
                  {errors.dia && <p className="mt-1 text-sm text-red-600">{errors.dia}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Início *
                  </label>
                  <input
                    type="time"
                    value={formData.inicio}
                    onChange={(e) => handleChange('inicio', e.target.value)}
                    className={`w-full input-field ${errors.inicio ? 'border-red-300' : ''}`}
                  />
                  {errors.inicio && <p className="mt-1 text-sm text-red-600">{errors.inicio}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Término *
                  </label>
                  <input
                    type="time"
                    value={formData.fim}
                    onChange={(e) => handleChange('fim', e.target.value)}
                    className={`w-full input-field ${errors.fim ? 'border-red-300' : ''}`}
                  />
                  {errors.fim && <p className="mt-1 text-sm text-red-600">{errors.fim}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => handleChange('dataInicio', e.target.value)}
                    className="w-full input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => handleChange('dataFim', e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                rows={3}
                className="w-full input-field"
                placeholder="Observações sobre o horário..."
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="ativo"
                    checked={formData.status === 'ativo'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Ativo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="cancelado"
                    checked={formData.status === 'cancelado'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Cancelado</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="substituto"
                    checked={formData.status === 'substituto'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Substituto</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Pré-visualização</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {turmaSelecionada?.disciplina || '[Disciplina]'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {turmaSelecionada?.codigo || '[Código]'} • {turmaSelecionada?.curso || '[Curso]'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Professor:</span>
                    <p className="font-medium">{professorSelecionado?.nome || '[Professor]'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Período:</span>
                    <p className="font-medium">{periodoSelecionado?.nome || '[Período]'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Dia:</span>
                    <p className="font-medium">
                      {diasSemana.find(d => d.value === formData.dia)?.label || '[Dia]'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Horário:</span>
                    <p className="font-medium">
                      {formData.inicio || '--:--'} - {formData.fim || '--:--'}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">Sala:</span>
                  <p className="font-medium">{formData.sala || '[Sala não definida]'}</p>
                </div>
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
                  {horario ? 'Atualizar' : 'Criar'} Horário
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}