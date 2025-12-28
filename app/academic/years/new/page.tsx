'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, X, Calendar, Plus, Minus,
  AlertCircle, CheckCircle
} from 'lucide-react'

const initialData = {
  ano: '',
  dataInicio: '',
  dataFim: '',
  descricao: '',
  semestres: [
    { numero: 1, nome: 'Primeiro Semestre', dataInicio: '', dataFim: '' },
    { numero: 2, nome: 'Segundo Semestre', dataInicio: '', dataFim: '' }
  ],
  feriados: [],
  observacoes: ''
}

export default function NovoAnoAcademicoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      const { [field]: _, ...rest } = errors
      setErrors(rest)
    }
  }

  const handleSemesterChange = (index: number, field: string, value: string) => {
    const updatedSemesters = [...formData.semestres]
    updatedSemesters[index] = { ...updatedSemesters[index], [field]: value }
    setFormData(prev => ({ ...prev, semestres: updatedSemesters }))
  }

  const addSemester = () => {
    if (formData.semestres.length < 4) {
      const newNumero = formData.semestres.length + 1
      setFormData(prev => ({
        ...prev,
        semestres: [
          ...prev.semestres,
          { numero: newNumero, nome: `Semestre ${newNumero}`, dataInicio: '', dataFim: '' }
        ]
      }))
    }
  }

  const removeSemester = (index: number) => {
    if (formData.semestres.length > 1) {
      const updatedSemesters = formData.semestres.filter((_, i) => i !== index)
      // Reorganizar números
      const renumbered = updatedSemesters.map((sem, idx) => ({
        ...sem,
        numero: idx + 1,
        nome: `Semestre ${idx + 1}`
      }))
      setFormData(prev => ({ ...prev, semestres: renumbered }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.ano.trim()) newErrors.ano = 'Ano académico é obrigatório'
    if (!formData.dataInicio) newErrors.dataInicio = 'Data de início é obrigatória'
    if (!formData.dataFim) newErrors.dataFim = 'Data de fim é obrigatória'
    
    if (formData.dataInicio && formData.dataFim) {
      const inicio = new Date(formData.dataInicio)
      const fim = new Date(formData.dataFim)
      if (inicio >= fim) {
        newErrors.dataFim = 'Data de fim deve ser posterior à data de início'
      }
      
      const diffMonths = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth())
      if (diffMonths < 9 || diffMonths > 12) {
        newErrors.dataFim = 'Período deve ter entre 9 e 12 meses'
      }
    }

    // Validar semestres
    formData.semestres.forEach((sem, index) => {
      if (!sem.dataInicio) newErrors[`semestre${index}_inicio`] = `Data início do ${sem.nome} é obrigatória`
      if (!sem.dataFim) newErrors[`semestre${index}_fim`] = `Data fim do ${sem.nome} é obrigatória`
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    setIsSubmitting(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Gerar código automático
      const codigo = `AA-${formData.ano.replace('/', '-')}`
      const anoData = {
        ...formData,
        codigo,
        status: 'planejado',
        dataCriacao: new Date().toISOString()
      }
      
      console.log('Novo ano académico:', anoData)
      router.push('/academico/anos')
      router.refresh()
      
    } catch (error) {
      console.error('Erro ao criar ano académico:', error)
      setErrors({ submit: 'Erro ao criar o ano académico' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateSemesterDates = () => {
    if (!formData.dataInicio || !formData.dataFim) return
    
    const inicio = new Date(formData.dataInicio)
    const fim = new Date(formData.dataFim)
    const totalDays = (fim.getTime() - inicio.getTime()) / (1000 * 3600 * 24)
    const daysPerSemester = totalDays / formData.semestres.length
    
    const updatedSemesters = formData.semestres.map((sem, index) => {
      const semInicio = new Date(inicio)
      semInicio.setDate(semInicio.getDate() + (index * daysPerSemester))
      
      const semFim = new Date(semInicio)
      semFim.setDate(semFim.getDate() + daysPerSemester - 1)
      
      return {
        ...sem,
        dataInicio: semInicio.toISOString().split('T')[0],
        dataFim: semFim.toISOString().split('T')[0]
      }
    })
    
    setFormData(prev => ({ ...prev, semestres: updatedSemesters }))
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
            <h1 className="text-2xl font-bold text-gray-900">Novo Ano Acadêmico</h1>
            <p className="text-gray-600">Crie um novo ano letivo</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => setFormData(initialData)} className="btn-secondary">
            <X className="w-4 h-4 mr-2" />
            Limpar
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Criando...' : 'Criar Ano Acadêmico'}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano Acadêmico *
              </label>
              <input
                value={formData.ano}
                onChange={(e) => handleChange('ano', e.target.value)}
                className={`w-full input-field ${errors.ano ? 'border-red-300' : ''}`}
                placeholder="Ex: 2024/2025"
              />
              {errors.ano && <p className="mt-1 text-sm text-red-600">{errors.ano}</p>}
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => handleChange('dataInicio', e.target.value)}
                  className={`w-full input-field ${errors.dataInicio ? 'border-red-300' : ''}`}
                />
                {errors.dataInicio && <p className="mt-1 text-sm text-red-600">{errors.dataInicio}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim *
                </label>
                <input
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => handleChange('dataFim', e.target.value)}
                  className={`w-full input-field ${errors.dataFim ? 'border-red-300' : ''}`}
                />
                {errors.dataFim && <p className="mt-1 text-sm text-red-600">{errors.dataFim}</p>}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={calculateSemesterDates}
                className="btn-secondary"
              >
                Calcular Datas dos Semestres
              </button>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                rows={3}
                className="w-full input-field"
                placeholder="Descrição do ano académico..."
              />
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Semestres</h3>
            {formData.semestres.length < 4 && (
              <button
                type="button"
                onClick={addSemester}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Semestre
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {formData.semestres.map((semester, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-blue-600">{semester.numero}</span>
                    </div>
                    <h4 className="font-medium text-gray-900">{semester.nome}</h4>
                  </div>
                  
                  {formData.semestres.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSemester(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início *
                    </label>
                    <input
                      type="date"
                      value={semester.dataInicio}
                      onChange={(e) => handleSemesterChange(index, 'dataInicio', e.target.value)}
                      className={`w-full input-field ${errors[`semestre${index}_inicio`] ? 'border-red-300' : ''}`}
                    />
                    {errors[`semestre${index}_inicio`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`semestre${index}_inicio`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Fim *
                    </label>
                    <input
                      type="date"
                      value={semester.dataFim}
                      onChange={(e) => handleSemesterChange(index, 'dataFim', e.target.value)}
                      className={`w-full input-field ${errors[`semestre${index}_fim`] ? 'border-red-300' : ''}`}
                    />
                    {errors[`semestre${index}_fim`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`semestre${index}_fim`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Observações</h3>
          <textarea
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            rows={3}
            className="w-full input-field"
            placeholder="Observações adicionais..."
          />
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Pré-visualização</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{formData.ano || '[Ano Acadêmico]'}</p>
                <p className="text-sm text-gray-600">
                  {formData.dataInicio 
                    ? `${new Date(formData.dataInicio).toLocaleDateString('pt-AO')} - ${new Date(formData.dataFim).toLocaleDateString('pt-AO')}`
                    : '[Período]'
                  }
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Semestres:</span>
                <p className="font-medium">{formData.semestres.length}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium">Planejado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Criando...' : 'Criar Ano Acadêmico'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}