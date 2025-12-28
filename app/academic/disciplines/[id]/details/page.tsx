'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, Clock, Users, GraduationCap,
  FileText, Calendar, BarChart3, Eye, Edit
} from 'lucide-react'

const disciplineData = {
  id: 1,
  codigo: 'DIR-101',
  nome: 'Direito Civil I',
  descricao: 'Introdução aos conceitos fundamentais do Direito Civil.',
  curso: 'Direito',
  departamento: 'Ciências Sociais e Humanas',
  creditos: 6,
  cargaHoraria: 60,
  semestre: 1,
  tipo: 'Obrigatória',
  professor: 'Dr. João Silva',
  status: 'ativa',
  
  ementa: 'Conceitos básicos de Direito Civil...',
  bibliografia: '1. Manual de Direito Civil...',
  metodologia: 'Aulas teóricas e práticas...',
  avaliacao: '2 testes e 1 trabalho final',
  
  preRequisitos: [],
  estudantesMatriculados: 85,
  taxaAprovacao: 78,
  
  criadoEm: '2023-08-15',
  atualizadoEm: '2024-01-10'
}

export default function DisciplinaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [discipline] = useState(disciplineData)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{discipline.nome}</h1>
            <p className="text-gray-600">{discipline.codigo} • {discipline.curso}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={`/academico/disciplinas?edit=${discipline.id}`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Disciplina
          </a>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Disciplina Ativa</h3>
              <p className="text-sm text-gray-600">
                {discipline.creditos} créditos • {discipline.cargaHoraria} horas
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
              {discipline.status}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {discipline.tipo}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Código</label>
                  <p className="font-medium">{discipline.codigo}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Curso</label>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{discipline.curso}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Departamento</label>
                  <p className="font-medium">{discipline.departamento}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Professor</label>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{discipline.professor}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Semestre</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{discipline.semestre}º Semestre</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Carga Horária</label>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{discipline.cargaHoraria}h ({discipline.creditos} créditos)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm text-gray-600 mb-2">Descrição</label>
              <p className="text-gray-700">{discipline.descricao}</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conteúdo Programático</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ementa</label>
                <p className="text-gray-700">{discipline.ementa}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metodologia</label>
                <p className="text-gray-700">{discipline.metodologia}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
                <p className="text-gray-700">{discipline.avaliacao}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bibliografia</label>
                <p className="text-gray-700 whitespace-pre-line">{discipline.bibliografia}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Estatísticas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estudantes Matriculados</span>
                <span className="font-bold text-gray-900">{discipline.estudantesMatriculados}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Taxa de Aprovação</span>
                <span className="font-bold text-gray-900">{discipline.taxaAprovacao}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Turmas Ativas</span>
                <span className="font-bold text-gray-900">4</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <Link
                href={`/academico/turmas?disciplina=${discipline.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Turmas</p>
                  <p className="text-sm text-gray-600">Ver turmas desta disciplina</p>
                </div>
              </Link>
              
              <Link
                href={`/academico/horarios?disciplina=${discipline.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-emerald-500 hover:bg-emerald-50"
              >
                <Calendar className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Horários</p>
                  <p className="text-sm text-gray-600">Ver horários das aulas</p>
                </div>
              </Link>
              
              <Link
                href={`/academico/relatorios?disciplina=${discipline.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-violet-500 hover:bg-violet-50"
              >
                <BarChart3 className="w-5 h-5 text-violet-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600">Estatísticas da disciplina</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}