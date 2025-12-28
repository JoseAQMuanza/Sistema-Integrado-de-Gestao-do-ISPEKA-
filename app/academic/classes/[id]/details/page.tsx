'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Users, Calendar, Clock, Building,
  BookOpen, User, BarChart3, Eye, Edit, Download,
  Mail, Phone, GraduationCap, CheckCircle
} from 'lucide-react'

const turmaData = {
  id: 1,
  codigo: 'TUR-DIR101-A',
  disciplina: 'Direito Civil I',
  curso: 'Direito',
  professor: {
    id: 1,
    nome: 'Dr. João Silva',
    email: 'joao.silva@ispeka.edu.ao',
    telefone: '+244 923 456 789'
  },
  periodo: '2023/2024 - 1º Semestre',
  horarios: [
    { dia: 'Segunda-feira', inicio: '08:00', fim: '10:00', sala: 'Sala 101 - Bloco A' },
    { dia: 'Quarta-feira', inicio: '10:00', fim: '12:00', sala: 'Sala 101 - Bloco A' }
  ],
  vagas: 40,
  matriculados: 38,
  status: 'ativa',
  sala: 'Sala 101 - Bloco A',
  
  estudantes: [
    { id: 1, nome: 'Maria Silva', numero: '20230001', status: 'ativo' },
    { id: 2, nome: 'João Pereira', numero: '20230002', status: 'ativo' },
    { id: 3, nome: 'Ana Costa', numero: '20230003', status: 'ativo' }
  ],
  
  avaliacoes: [
    { tipo: 'Teste 1', data: '2024-03-15', peso: 30 },
    { tipo: 'Teste 2', data: '2024-04-20', peso: 30 },
    { tipo: 'Exame Final', data: '2024-06-10', peso: 40 }
  ],
  
  criadoEm: '2023-08-20',
  atualizadoEm: '2024-01-15'
}

export default function TurmaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [turma] = useState(turmaData)

  const ocupacaoPercentual = Math.round((turma.matriculados / turma.vagas) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Turma {turma.codigo}</h1>
            <p className="text-gray-600">{turma.disciplina} • {turma.curso}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={`/academico/turmas?edit=${turma.id}`}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Turma
          </a>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Turma Ativa</h3>
              <p className="text-sm text-gray-600">
                {turma.matriculados} estudantes matriculados de {turma.vagas} vagas
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-48">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Ocupação</span>
                <span className="text-sm font-medium">{ocupacaoPercentual}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${ocupacaoPercentual > 90 ? 'bg-red-600' : 'bg-emerald-600'}`}
                  style={{ width: `${ocupacaoPercentual}%` }}
                />
              </div>
            </div>
            
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
              {turma.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Turma</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Código</label>
                  <p className="font-medium">{turma.codigo}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Disciplina</label>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{turma.disciplina}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Curso</label>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{turma.curso}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Período</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{turma.periodo}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Sala</label>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-medium">{turma.sala}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Vagas</label>
                  <p className="font-medium">
                    {turma.matriculados}/{turma.vagas} ({turma.vagas - turma.matriculados} disponíveis)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Horários */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Horários das Aulas</h3>
            
            <div className="space-y-4">
              {turma.horarios.map((horario, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">{horario.dia}</h4>
                        <p className="text-sm text-gray-600">
                          {horario.inicio} - {horario.fim} ({horario.sala})
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {Math.round((new Date(`2000/01/01 ${horario.fim}`).getTime() - 
                         new Date(`2000/01/01 ${horario.inicio}`).getTime()) / (1000 * 60 * 60))}h
                    </span>
                  </div>
                </div>
              ))}
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
                <h4 className="font-medium text-gray-900">{turma.professor.nome}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <a href={`mailto:${turma.professor.email}`} className="flex items-center hover:text-blue-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {turma.professor.email}
                  </a>
                  <a href={`tel:${turma.professor.telefone}`} className="flex items-center hover:text-emerald-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {turma.professor.telefone}
                  </a>
                </div>
              </div>
              <Link
                href={`/docentes/${turma.professor.id}`}
                className="btn-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Estatísticas Rápidas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Taxa de Aprovação</span>
                <span className="font-bold text-gray-900">78%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Frequência Média</span>
                <span className="font-bold text-gray-900">92%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nota Média</span>
                <span className="font-bold text-gray-900">14.5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avaliações</span>
                <span className="font-bold text-gray-900">3</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <Link
                href={`/academico/matriculas?turma=${turma.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Matrículas</p>
                  <p className="text-sm text-gray-600">Gerir estudantes</p>
                </div>
              </Link>
              
              <Link
                href={`/academico/notas?turma=${turma.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-emerald-500 hover:bg-emerald-50"
              >
                <BarChart3 className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Notas</p>
                  <p className="text-sm text-gray-600">Lançar avaliações</p>
                </div>
              </Link>
              
              <button className="flex items-center p-3 border rounded-lg hover:border-violet-500 hover:bg-violet-50 w-full">
                <Download className="w-5 h-5 text-violet-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Relatório</p>
                  <p className="text-sm text-gray-600">Exportar dados</p>
                </div>
              </button>
              
              <Link
                href={`/academico/presencas?turma=${turma.id}`}
                className="flex items-center p-3 border rounded-lg hover:border-amber-500 hover:bg-amber-50"
              >
                <CheckCircle className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Presenças</p>
                  <p className="text-sm text-gray-600">Registrar frequência</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Estudantes Recentes</h3>
            
            <div className="space-y-3">
              {turma.estudantes.map(estudante => (
                <div key={estudante.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{estudante.nome}</p>
                      <p className="text-xs text-gray-600">{estudante.numero}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">
                    {estudante.status}
                  </span>
                </div>
              ))}
              
              <Link
                href={`/academico/matriculas?turma=${turma.id}`}
                className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
              >
                Ver todos os {turma.matriculados} estudantes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}