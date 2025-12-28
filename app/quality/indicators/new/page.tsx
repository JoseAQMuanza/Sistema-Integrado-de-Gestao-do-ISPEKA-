'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, X, Target, BarChart3, Calculator,
  Calendar, Users, Building2, AlertCircle
} from 'lucide-react'

const initialData = {
  nome: '',
  descricao: '',
  categoria: '',
  responsavel: '',
  departamento: '',
  formula: '',
  unidadeMedida: '',
  periodo: 'Semestral',
  meta: '',
  fonteDados: '',
  observacoes: ''
}

const categories = ['Ensino', 'Pesquisa', 'Extensão', 'Gestão', 'Infraestrutura']
const periods = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual']
const units = ['Percentagem (%)', 'Escala 1-5', 'Quantidade', 'Valor Monetário', 'Outro']

export default function NewIndicatorPage() {
  const router = useRouter()
  const [indicator, setIndicator] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: any) => {
    setIndicator(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  
    const validate = () => {
      const newErrors: Record<string, string> = {}
      if (!indicator.nome.trim()) newErrors.nome = 'Nome é obrigatório'
      if (!indicator.categoria) newErrors.categoria = 'Categoria é obrigatória'
      if (!indicator.meta) newErrors.meta = 'Meta é obrigatória'
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return

      setIsSubmitting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/qualidade/indicadores')
      setIsSubmitting(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Novo Indicador</h1>
              <p className="text-gray-600">Crie um novo indicador de qualidade</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setIndicator(initialData)} className="btn-secondary">
              <X className="w-4 h-4 mr-2" />
              Limpar
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Criando...' : 'Criar Indicador'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Informações Básicas
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Indicador *
                    </label>
                    <input
                      value={indicator.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      className={`w-full input-field ${errors.nome ? 'border-red-300' : ''}`}
                      placeholder="Ex: Satisfação dos Estudantes"
                    />
                    {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={indicator.descricao}
                      onChange={(e) => handleChange('descricao', e.target.value)}
                      rows={3}
                      className="w-full input-field"
                      placeholder="Descreva o objetivo e importância do indicador..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <select
                        value={indicator.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                        className={`w-full input-field ${errors.categoria ? 'border-red-300' : ''}`}
                      >
                        <option value="">Selecione</option>
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                      {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Período de Medição
                      </label>
                      <select
                        value={indicator.periodo}
                        onChange={(e) => handleChange('periodo', e.target.value)}
                        className="w-full input-field"
                      >
                        {periods.map(period => <option key={period}>{period}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Medição e Meta
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={indicator.meta}
                        onChange={(e) => handleChange('meta', e.target.value)}
                        className={`w-full input-field ${errors.meta ? 'border-red-300' : ''}`}
                        placeholder="Ex: 4.5"
                      />
                      {errors.meta && <p className="mt-1 text-sm text-red-600">{errors.meta}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidade de Medida
                      </label>
                      <select
                        value={indicator.unidadeMedida}
                        onChange={(e) => handleChange('unidadeMedida', e.target.value)}
                        className="w-full input-field"
                      >
                        <option value="">Selecione</option>
                        {units.map(unit => <option key={unit}>{unit}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fórmula/Fonte de Dados
                    </label>
                    <input
                      value={indicator.formula}
                      onChange={(e) => handleChange('formula', e.target.value)}
                      className="w-full input-field"
                      placeholder="Ex: Média das avaliações do questionário"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Responsible */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-900 mb-4">Responsabilidade</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável
                    </label>
                    <input
                      value={indicator.responsavel}
                      onChange={(e) => handleChange('responsavel', e.target.value)}
                      className="w-full input-field"
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento
                    </label>
                    <input
                      value={indicator.departamento}
                      onChange={(e) => handleChange('departamento', e.target.value)}
                      className="w-full input-field"
                      placeholder="Departamento responsável"
                    />
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-900 mb-4">Observações</h3>
                <textarea
                  value={indicator.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  rows={4}
                  className="w-full input-field"
                  placeholder="Quaisquer observações relevantes..."
                />
              </div>

              {/* Preview */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-900 mb-4">Pré-visualização</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{indicator.nome || '[Nome]'}</p>
                      <p className="text-sm text-gray-600">{indicator.categoria || '[Categoria]'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Meta:</span>
                      <p className="font-medium">{indicator.meta || '[Meta]'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Período:</span>
                      <p className="font-medium">{indicator.periodo}</p>
                    </div>
                  </div>
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
                {isSubmitting ? 'Criando...' : 'Criar Indicador'}
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }