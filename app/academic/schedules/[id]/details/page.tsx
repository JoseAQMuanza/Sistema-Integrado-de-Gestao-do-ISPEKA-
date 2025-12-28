'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, Clock, Building, BookOpen,
  User, BarChart3, Eye, Edit, Download, Mail,
  Phone, GraduationCap, CheckCircle, AlertCircle, Users
} from 'lucide-react'

const horarioData = {
  id: 1,
  turma: {
    id: 1,
    codigo: 'TUR-DIR101-A',
    disciplina: 'Direito Civil I',
    curso: 'Direito'
  },
  professor: {
    id: 1,
    nome: 'Dr. João Silva',
    email: 'joao.silva@ispeka.edu.ao',
    telefone: '+244 923 456 789',
    departamento: 'Ciências Sociais'
  },
  dia: 'Segunda-feira',
  horario: '08:00 - 10:00',
  sala: 'Sala 101 - Bloco A',
  periodo: '2023/2024 - 1º Semestre',
  status: 'ativo',
  dataInicio: '2024-01-15',
  dataFim: '2024-06-30',
  observacoes: 'Aula teórica com apresentação de casos práticos.',
  
  estudantesMatriculados: 38,
  frequenciaMedia: 92,
  notas: {
    media: 14.5,
    aprovados: 30,
    reprovados: 8
  },
  
  historicoAlteracoes: [
    { data: '2024-01-10', alteracao: 'Horário criado', usuario: 'Admin' },
    { data: '2024-01-12', alteracao: 'Sala alterada para 101', usuario: 'Admin' }
  ]
}

export default function HorarioDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [horario] = useState(horarioData)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Horário {horario.turma.codigo}</h1>
            <p className="text-gray-600">{horario.turma.disciplina} • {horario.dia} {horario.horario}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={`/academico/horarios?edit=${horario.id}`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Horário
          </a>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 ${horario.status === 'ativo' ? 'bg-emerald-100' : horario.status === 'cancelado' ? 'bg-red-100' : 'bg-amber-100'} rounded-lg`}>
              {horario.status === 'ativo' ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : horario.status === 'cancelado' ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Horário {horario.status}</h3>
              <p className="text-sm text-gray-600">
                {horario.estudantesMatriculados} estudantes • {horario.frequenciaMedia}% frequência média
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${horario.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : horario.status === 'cancelado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
              {horario.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalhes do Horário</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Turma</label>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{horario.turma.codigo}</p>
                      <p className="text-sm text-gray-600">{horario.turma.disciplina}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Curso</label>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{horario.turma.curso}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Período</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{horario.periodo}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Dia e Horário</label>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{horario.dia}</p>
                      <p className="text-sm text-gray-600">{horario.horario}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Sala</label>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{horario.sala}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Período do Horário</label>
                  <p className="font-medium">
                    {horario.dataInicio} a {horario.dataFim}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professor */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Professor Responsável</h3>
            
            <div className="flex items-center p-4 border rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{horario.professor.nome}</h4>
                <p className="text-sm text-gray-600">{horario.professor.departamento}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <a href={`mailto:${horario.professor.email}`} className="flex items-center hover:text-blue-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {horario.professor.email}
                  </a>
                  <a href={`tel:${horario.professor.telefone}`} className="flex items-center hover:text-emerald-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {horario.professor.telefone}
                  </a>
                </div>
              </div>
              <Link
                href={`/docentes/${horario.professor.id}`}
                className="btn-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Perfil
              </Link>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
            <p className="text-gray-700">{horario.observacoes || 'Nenhuma observação registrada.'}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Estatísticas da Turma</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estudantes Matriculados</span>
                <span className="font-bold text-gray-900">{horario.estudantesMatriculados}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Frequência Média</span>
                <span className="font-bold text-gray-900">{horario.frequenciaMedia}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nota Média</span>
                <span className="font-bold text-gray-900">{horario.notas.media}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Taxa de Aprovação</span>
                <span className="font-bold text-gray-900">
                  {Math.round((horario.notas.aprovados / horario.estudantesMatriculados) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <Link
                href={`/academico/turmas/${horario.turma.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Ver Turma</p>
                  <p className="text-sm text-gray-600">Detalhes completos</p>
                </div>
              </Link>
              
              <Link
                href={`/academico/presencas?horario=${horario.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-emerald-500 hover:bg-emerald-50"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Registrar Presenças</p>
                  <p className="text-sm text-gray-600">Para esta aula</p>
                </div>
              </Link>
              
              <Link
                href={`/academico/notas?turma=${horario.turma.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-violet-500 hover:bg-violet-50"
              >
                <BarChart3 className="w-5 h-5 text-violet-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Lançar Notas</p>
                  <p className="text-sm text-gray-600">Avaliações</p>
                </div>
              </Link>
              
              <button className="flex items-center p-3 border rounded-lg hover:border-amber-500 hover:bg-amber-50 w-full">
                <Download className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Relatório</p>
                  <p className="text-sm text-gray-600">Exportar dados</p>
                </div>
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Histórico de Alterações</h3>
            
            <div className="space-y-3">
              {horario.historicoAlteracoes.map((alteracao, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alteracao.alteracao}</p>
                    <p className="text-xs text-gray-500">
                      {alteracao.data} • por {alteracao.usuario}
                    </p>
                  </div>
                </div>
              ))}
              
              {horario.historicoAlteracoes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma alteração registrada
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}