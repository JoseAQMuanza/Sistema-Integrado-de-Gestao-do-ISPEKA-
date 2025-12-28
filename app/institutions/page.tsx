'use client'

import { useState } from 'react'
import {
  Building, Users, BookOpen, GraduationCap, Calendar,
  Settings, MapPin, Phone, Mail, Globe, Edit,
  Download, Eye, Filter, Search, ChevronDown,
  BarChart3, Clock, CheckCircle, AlertCircle
} from 'lucide-react'

// Dados mockados da instituição
const instituicaoInfo = {
  id: 1,
  nome: 'Instituto Superior Politécnico Kalandula de Angola',
  sigla: 'ISPEKA',
  missao: 'Formar profissionais competentes e éticos para o desenvolvimento de Angola.',
  visao: 'Ser referência em educação superior tecnológica em África até 2030.',
  fundacao: '2010',
  tipo: 'Ensino Superior Politécnico',
  endereco: {
    rua: 'Avenida 21 de Janeiro',
    bairro: 'Cazenga',
    cidade: 'Luanda',
    provincia: 'Luanda',
    pais: 'Angola',
    codigoPostal: '1234-567'
  },
  contatos: {
    telefone: '+244 222 123 456',
    email: 'geral@ispeka.edu.ao',
    website: 'www.ispeka.edu.ao'
  },
  estatisticas: {
    estudantes: 2500,
    professores: 150,
    cursos: 25,
    turmas: 120,
    salas: 45,
    laboratorios: 12
  }
}

const cursos = [
  { id: 1, nome: 'Engenharia Informática', duracao: '5 anos', vagas: 60, status: 'ativo' },
  { id: 2, nome: 'Direito', duracao: '5 anos', vagas: 80, status: 'ativo' },
  { id: 3, nome: 'Enfermagem', duracao: '4 anos', vagas: 50, status: 'ativo' },
  { id: 4, nome: 'Gestão de Empresas', duracao: '4 anos', vagas: 70, status: 'ativo' },
  { id: 5, nome: 'Arquitetura', duracao: '5 anos', vagas: 40, status: 'planejado' }
]

const departamentos = [
  { id: 1, nome: 'Ciências de Engenharia', sigla: 'DCE', chefe: 'Dr. António Silva', cursos: 8 },
  { id: 2, nome: 'Ciências Sociais e Humanas', sigla: 'DCSH', chefe: 'Dra. Maria Costa', cursos: 6 },
  { id: 3, nome: 'Ciências da Saúde', sigla: 'DCS', chefe: 'Prof. Carlos Mendes', cursos: 5 },
  { id: 4, nome: 'Gestão e Economia', sigla: 'DGE', chefe: 'Dr. Pedro Santos', cursos: 6 }
]

const calendarioEventos = [
  { id: 1, titulo: 'Início do Ano Letivo', data: '2024-02-05', tipo: 'academico' },
  { id: 2, titulo: 'Período de Matrículas', data: '2024-01-15', tipo: 'administrativo' },
  { id: 3, titulo: 'Feriado - Dia dos Heróis', data: '2024-09-17', tipo: 'feriado' },
  { id: 4, titulo: 'Exames Finais', data: '2024-06-10', tipo: 'academico' },
  { id: 5, titulo: 'Cerimónia de Colação', data: '2024-07-20', tipo: 'evento' }
]

export default function InstituicaoPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('informacoes')

  const handleEdit = (type: string, item: any) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setModalType('')
    setEditingItem(null)
  }

  const handleModalSave = (data: any) => {
    console.log('Salvar:', modalType, data)
    handleModalClose()
  }

  const getEventColor = (tipo: string) => {
    const colors = {
      academico: 'bg-blue-100 text-blue-800',
      administrativo: 'bg-emerald-100 text-emerald-800',
      feriado: 'bg-red-100 text-red-800',
      evento: 'bg-violet-100 text-violet-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{instituicaoInfo.nome}</h1>
              <p className="text-gray-600">{instituicaoInfo.sigla} • {instituicaoInfo.tipo}</p>
            </div>
          </div>
          <button
            onClick={() => handleEdit('instituicao', instituicaoInfo)}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Informações
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border">
        <div className="border-b">
          <nav className="flex -mb-px">
            {[
              { id: 'informacoes', label: 'Informações', icon: Building },
              { id: 'cursos', label: 'Cursos', icon: BookOpen },
              { id: 'departamentos', label: 'Departamentos', icon: Users },
              { id: 'calendario', label: 'Calendário', icon: Calendar },
              { id: 'parametros', label: 'Parâmetros', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Informações */}
          {activeTab === 'informacoes' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Estudantes', value: instituicaoInfo.estatisticas.estudantes, icon: Users, color: 'blue' },
                  { label: 'Professores', value: instituicaoInfo.estatisticas.professores, icon: GraduationCap, color: 'emerald' },
                  { label: 'Cursos Ativos', value: instituicaoInfo.estatisticas.cursos, icon: BookOpen, color: 'violet' },
                  { label: 'Turmas', value: instituicaoInfo.estatisticas.turmas, icon: Users, color: 'amber' }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Missão e Visão */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Missão</h3>
                  <p className="text-gray-700">{instituicaoInfo.missao}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Visão</h3>
                  <p className="text-gray-700">{instituicaoInfo.visao}</p>
                </div>
              </div>

              {/* Contatos e Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contatos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{instituicaoInfo.contatos.telefone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <a href={`mailto:${instituicaoInfo.contatos.email}`} className="text-blue-600 hover:underline">
                        {instituicaoInfo.contatos.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <a href={`https://${instituicaoInfo.contatos.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {instituicaoInfo.contatos.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-gray-700">{instituicaoInfo.endereco.rua}</p>
                        <p className="text-gray-700">{instituicaoInfo.endereco.bairro}</p>
                        <p className="text-gray-700">{instituicaoInfo.endereco.cidade}, {instituicaoInfo.endereco.provincia}</p>
                        <p className="text-gray-700">{instituicaoInfo.endereco.pais} - {instituicaoInfo.endereco.codigoPostal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Cursos */}
          {activeTab === 'cursos' && (
            <div className="space-y-6">
              {/* Filters and Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Pesquisar cursos..."
                      className="pl-10 w-full input-field"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleEdit('curso', null)}
                  className="btn-primary"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Novo Curso
                </button>
              </div>

              {/* Cursos Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Curso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Duração
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Vagas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cursos.map((curso) => (
                      <tr key={curso.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{curso.nome}</div>
                              <div className="text-sm text-gray-600">Código: CUR-{curso.id.toString().padStart(3, '0')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">{curso.duracao}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{curso.vagas} vagas/ano</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${curso.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {curso.status === 'ativo' ? (
                              <span className="flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ativo
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Planejado
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit('curso', curso)}
                              className="p-1 text-gray-600 hover:text-gray-900"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="Ver detalhes">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900" title="Excluir">
                              <Edit className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Departamentos */}
          {activeTab === 'departamentos' && (
            <div className="space-y-6">
              <button
                onClick={() => handleEdit('departamento', null)}
                className="btn-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Novo Departamento
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departamentos.map((depto) => (
                  <div key={depto.id} className="border rounded-lg p-6 hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{depto.nome}</h3>
                        <p className="text-gray-600">{depto.sigla}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {depto.cursos} cursos
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Chefe: <strong>{depto.chefe}</strong></span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <button
                        onClick={() => handleEdit('departamento', depto)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Ver cursos →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Calendário */}
          {activeTab === 'calendario' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Calendário Acadêmico 2024</h3>
                <button
                  onClick={() => handleEdit('evento', null)}
                  className="btn-primary"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Novo Evento
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3 font-semibold text-gray-700">Evento</div>
                    <div className="col-span-2 font-semibold text-gray-700">Data</div>
                    <div className="col-span-2 font-semibold text-gray-700">Tipo</div>
                    <div className="col-span-5 font-semibold text-gray-700">Descrição</div>
                  </div>
                </div>
                
                <div className="divide-y">
                  {calendarioEventos.map((evento) => (
                    <div key={evento.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="font-medium text-gray-900">{evento.titulo}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(evento.data).toLocaleDateString('pt-AO')}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventColor(evento.tipo)}`}>
                            {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                          </span>
                        </div>
                        <div className="col-span-5">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Evento do calendário acadêmico</span>
                            <button
                              onClick={() => handleEdit('evento', evento)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Parâmetros */}
          {activeTab === 'parametros' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Configurações do Sistema</h4>
                    <p className="text-sm text-blue-700">
                      Estas configurações afetam todo o sistema. Modifique com cuidado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parâmetros Acadêmicos */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros Acadêmicos</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano Letivo Atual
                      </label>
                      <select className="w-full input-field">
                        <option>2023/2024</option>
                        <option>2024/2025</option>
                        <option>2025/2026</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Período Letivo Atual
                      </label>
                      <select className="w-full input-field">
                        <option>1º Semestre</option>
                        <option>2º Semestre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nota Mínima para Aprovação
                      </label>
                      <input type="number" min="0" max="20" defaultValue={10} className="w-full input-field" />
                    </div>
                  </div>
                </div>

                {/* Parâmetros do Sistema */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Sistema de Notas (0-20)
                        </label>
                        <p className="text-sm text-gray-500">Usar escala de 0 a 20</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        <label className="toggle-label"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Período de Matrículas Aberto
                        </label>
                        <p className="text-sm text-gray-500">Permitir novas matrículas</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        <label className="toggle-label"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Notificações por Email
                        </label>
                        <p className="text-sm text-gray-500">Enviar notificações automáticas</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        <label className="toggle-label"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Períodos de Matrícula</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Início
                      </label>
                      <input type="date" className="w-full input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Término
                      </label>
                      <input type="date" className="w-full input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taxa de Matrícula (AKZ)
                      </label>
                      <input type="number" className="w-full input-field" defaultValue="25000" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button className="btn-secondary">Cancelar</button>
                <button className="btn-primary">Salvar Alterações</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => window.print()}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Relatório</span>
            <p className="text-sm text-gray-600 mt-1">Dados institucionais</p>
          </div>
        </button>

        <a
          href="/instituicao/cursos"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-100 rounded-lg mb-3">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">Cursos</span>
            <p className="text-sm text-gray-600 mt-1">Ver todos cursos</p>
          </div>
        </a>

        <a
          href="/instituicao/estatisticas"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-violet-100 rounded-lg mb-3">
              <BarChart3 className="w-6 h-6 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">Estatísticas</span>
            <p className="text-sm text-gray-600 mt-1">Relatórios detalhados</p>
          </div>
        </a>

        <button
          onClick={() => handleEdit('instituicao', instituicaoInfo)}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3">
              <Settings className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900">Configurações</span>
            <p className="text-sm text-gray-600 mt-1">Editar parâmetros</p>
          </div>
        </button>
      </div>
    </div>
  )
}