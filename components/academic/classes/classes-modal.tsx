'use client'

import { useState, useEffect } from 'react'
import {
  X, Save, Users, Calendar, Clock, Building,
  BookOpen, User, AlertCircle, Plus, Minus
} from 'lucide-react'

const initialData = {
  codigo: '',
  disciplinaId: '',
  professorId: '',
  periodoId: '',
  vagas: 30,
  sala: '',
  horarios: [
    { dia: 'segunda', inicio: '08:00', fim: '10:00', sala: '' }
  ],
  status: 'ativa',
  observacoes: ''
}

const disciplinas = [
  { id: '1', nome: 'Direito Civil I', codigo: 'DIR-101', curso: 'Direito' },
  { id: '2', nome: 'Programação Avançada', codigo: 'INF-201', curso: 'Engenharia Informática' },
  { id: '3', nome: 'Anatomia Humana', codigo: 'ENF-102', curso: 'Enfermagem' }
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

interface TurmaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  turma?: any
}

export default function TurmaModal({ isOpen, onClose, onSave, turma }: TurmaModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (turma) {
      setFormData(turma)
    } else {
      // Gerar código automático
      const codigo = `TUR-${new Date().getFullYear().toString().slice(-2)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
      setFormData({ ...initialData, codigo })
    }
  }, [turma])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleHorarioChange = (index: number, field: string, value: string) => {
    const updatedHorarios = [...formData.horarios]
    updatedHorarios[index] = { ...updatedHorarios[index], [field]: value }
    setFormData(prev => ({ ...prev, horarios: updatedHorarios }))
  }

  const addHorario = () => {
    if (formData.horarios.length < 5) {
      setFormData(prev => ({
        ...prev,
        horarios: [
          ...prev.horarios,
          { dia: 'segunda', inicio: '08:00', fim: '10:00', sala: '' }
        ]
      }))
    }
  }

  const removeHorario = (index: number) => {
    if (formData.horarios.length > 1) {
      const updatedHorarios = formData.horarios.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, horarios: updatedHorarios }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.disciplinaId) newErrors.disciplinaId = 'Disciplina é obrigatória'
    if (!formData.professorId) newErrors.professorId = 'Professor é obrigatório'
    if (!formData.periodoId) newErrors.periodoId = 'Período é obrigatório'
    if (!formData.vagas || formData.vagas <= 0) newErrors.vagas = 'Número de vagas inválido'
    if (formData.vagas > 100) newErrors.vagas = 'Máximo de 100 vagas por turma'
    
    // Validar horários
    formData.horarios.forEach((horario, index) => {
      if (!horario.dia) newErrors[`horario${index}_dia`] = 'Dia é obrigatório'
      if (!horario.inicio) newErrors[`horario${index}_inicio`] = 'Hora início é obrigatória'
      if (!horario.fim) newErrors[`horario${index}_fim`] = 'Hora fim é obrigatória'
      
      if (horario.inicio && horario.fim) {
        const inicio = new Date(`2000/01/01 ${horario.inicio}`)
        const fim = new Date(`2000/01/01 ${horario.fim}`)
        if (inicio >= fim) {
          newErrors[`horario${index}_fim`] = 'Hora fim deve ser posterior à hora início'
        }
        
        const diffMinutes = (fim.getTime() - inicio.getTime()) / (1000 * 60)
        if (diffMinutes < 60 || diffMinutes > 240) {
          newErrors[`horario${index}_fim`] = 'Aula deve ter entre 1h e 4h'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    
    // Simular API call
    setTimeout(() => {
      const turmaData = {
        ...formData,
        status: 'ativa',
        dataCriacao: new Date().toISOString()
      }
      
      onSave(turmaData)
      setIsSubmitting(false)
    }, 500)
  }

  if (!isOpen) return null

  const disciplinaSelecionada = disciplinas.find(d => d.id === formData.disciplinaId)
  const professorSelecionado = professores.find(p => p.id === formData.professorId)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {turma ? 'Editar Turma' : 'Nova Turma'}
                </h2>
                <p className="text-gray-600">
                  {turma ? 'Atualize os dados da turma' : 'Preencha os dados da nova turma'}
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
                  Código
                </label>
                <input
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
                  className="w-full input-field bg-gray-50"
                  placeholder="Gerado automaticamente"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vagas *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.vagas}
                  onChange={(e) => handleChange('vagas', parseInt(e.target.value))}
                  className={`w-full input-field ${errors.vagas ? 'border-red-300' : ''}`}
                />
                {errors.vagas && <p className="mt-1 text-sm text-red-600">{errors.vagas}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplina *
                </label>
                <select
                  value={formData.disciplinaId}
                  onChange={(e) => handleChange('disciplinaId', e.target.value)}
                  className={`w-full input-field ${errors.disciplinaId ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecione a disciplina</option>
                  {disciplinas.map(disciplina => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome} ({disciplina.codigo}) - {disciplina.curso}
                    </option>
                  ))}
                </select>
                {errors.disciplinaId && <p className="mt-1 text-sm text-red-600">{errors.disciplinaId}</p>}
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

            {/* Horários */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Horários das Aulas</h3>
                {formData.horarios.length < 5 && (
                  <button
                    type="button"
                    onClick={addHorario}
                    className="btn-secondary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Horário
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.horarios.map((horario, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                        <h4 className="font-medium text-gray-900">Horário {index + 1}</h4>
                      </div>
                      
                      {formData.horarios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHorario(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dia da Semana
                        </label>
                        <select
                          value={horario.dia}
                          onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
                          className={`w-full input-field ${errors[`horario${index}_dia`] ? 'border-red-300' : ''}`}
                        >
                          {diasSemana.map(dia => (
                            <option key={dia.value} value={dia.value}>
                              {dia.label}
                            </option>
                          ))}
                        </select>
                        {errors[`horario${index}_dia`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`horario${index}_dia`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora de Início
                        </label>
                        <input
                          type="time"
                          value={horario.inicio}
                          onChange={(e) => handleHorarioChange(index, 'inicio', e.target.value)}
                          className={`w-full input-field ${errors[`horario${index}_inicio`] ? 'border-red-300' : ''}`}
                        />
                        {errors[`horario${index}_inicio`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`horario${index}_inicio`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora de Término
                        </label>
                        <input
                          type="time"
                          value={horario.fim}
                          onChange={(e) => handleHorarioChange(index, 'fim', e.target.value)}
                          className={`w-full input-field ${errors[`horario${index}_fim`] ? 'border-red-300' : ''}`}
                        />
                        {errors[`horario${index}_fim`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`horario${index}_fim`]}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sala (opcional)
                      </label>
                      <select
                        value={horario.sala}
                        onChange={(e) => handleHorarioChange(index, 'sala', e.target.value)}
                        className="w-full input-field"
                      >
                        <option value="">Usar sala padrão da turma</option>
                        {salas.map(sala => (
                          <option key={sala} value={sala}>
                            {sala}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
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
                placeholder="Observações sobre a turma..."
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
                    value="planejada"
                    checked={formData.status === 'planejada'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Planejada</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="encerrada"
                    checked={formData.status === 'encerrada'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Encerrada</span>
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
                      {disciplinaSelecionada?.nome || '[Disciplina]'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {disciplinaSelecionada?.curso || '[Curso]'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Código:</span>
                    <p className="font-medium">{formData.codigo}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Professor:</span>
                    <p className="font-medium">{professorSelecionado?.nome || '[Professor]'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Vagas:</span>
                    <p className="font-medium">{formData.vagas}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium capitalize">{formData.status}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">Horários:</span>
                  <p className="font-medium">
                    {formData.horarios.length} horário(s) configurado(s)
                  </p>
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
                  {turma ? 'Atualizar' : 'Criar'} Turma
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}