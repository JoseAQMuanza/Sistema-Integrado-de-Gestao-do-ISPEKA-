import {
  ArrowLeft,
  Edit,
  Download,
  Printer,
  Share2,
  MoreVertical,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Building2,
  Calendar,
  Award,
  FileText,
  BarChart3,
  BookMarked,
  UserCheck
} from 'lucide-react'

// Data
export const courses = [
  {
    id: 0,
    codigo: 'DIR-001',
    nome: 'Direito',
    departamento: 'Ciências Sociais e Humanas',
    duracao: 5,
    regime: 'Presencial',
    grau: 'Licenciatura',
    estado: 'ativo',
    estudantes: 245,
    createdAt: '2023-01-15'
  },
  {
    id: 1,
    codigo: 'ECO-001',
    nome: 'Economia',
    departamento: 'Ciências Sociais e Humanas',
    duracao: 4,
    regime: 'Presencial',
    grau: 'Licenciatura',
    estado: 'ativo',
    estudantes: 180,
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    codigo: 'ENF-001',
    nome: 'Enfermagem',
    departamento: 'Saúde',
    duracao: 4,
    regime: 'Presencial',
    grau: 'Licenciatura',
    estado: 'ativo',
    estudantes: 150,
    createdAt: '2023-01-15'
  },
  {
    id: 3,
    codigo: 'INF-001',
    nome: 'Engenharia Informática',
    departamento: 'Engenharia',
    duracao: 5,
    regime: 'Presencial',
    grau: 'Licenciatura',
    estado: 'ativo',
    estudantes: 120,
    createdAt: '2023-01-15'
  },
  {
    id: 4,
    codigo: 'MEC-001',
    nome: 'Engenharia Mecânica',
    departamento: 'Engenharia',
    duracao: 5,
    regime: 'Presencial',
    grau: 'Licenciatura',
    estado: 'inativo',
    estudantes: 85,
    createdAt: '2022-08-20'
  },
  {
    id: 5,
    codigo: 'PSI-001',
    nome: 'Psicologia',
    departamento: 'Ciências Sociais e Humanas',
    duracao: 5,
    regime: 'Presencial',
    grau: 'Licenciatura',
    estado: 'ativo',
    estudantes: 95,
    createdAt: '2023-03-10'
  }
]

export const departments = [
  'Todos os departamentos',
  'Ciências Sociais e Humanas',
  'Engenharia',
  'Saúde'
]

export const statusOptions = [
  'Todos os estados',
  'ativo',
  'inativo',
  'suspenso'
]
export const courseData = [
  {
  id: 1,
  codigo: 'DIR-001',
  nome: 'Direito',
  descricao: 'Curso de Direito com foco na formação de profissionais qualificados para atuar nas diversas áreas do Direito, com ênfase na realidade jurídica angolana.',
  departamento: 'Ciências Sociais e Humanas',
  duracao: 5,
  regime: 'Presencial',
  grau: 'Licenciatura',
  estado: 'ativo',
  coordenador: 'Dr. João Manuel',
  emailCoordenador: 'joao.manuel@ispeka.edu.ao',
  totalEstudantes: 245,
  estudantesAtivos: 230,
  anoCriacao: 2015,
  createdAt: '2023-01-15',
  updatedAt: '2024-01-10'
},{
  id: 2,
  codigo: 'DIR-002',
  nome: 'Informatica',
  descricao: 'Curso de Informatica com foco na formação de profissionais qualificados para atuar nas diversas áreas do Direito, com ênfase na realidade jurídica angolana.',
  departamento: 'TI',
  duracao: 5,
  regime: 'Presencial',
  grau: 'Licenciatura',
  estado: 'ativo',
  coordenador: 'Dr. João Manuel',
  emailCoordenador: 'joao.manuel@ispeka.edu.ao',
  totalEstudantes: 245,
  estudantesAtivos: 230,
  anoCriacao: 2015,
  createdAt: '2023-01-15',
  updatedAt: '2024-01-10'
}]

export const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: BookOpen },
  { id: 'curriculum', label: 'Plano Curricular', icon: BookMarked },
  { id: 'students', label: 'Estudantes', icon: Users },
  { id: 'teachers', label: 'Docentes', icon: UserCheck },
  { id: 'grades', label: 'Notas', icon: BarChart3 },
  { id: 'reports', label: 'Relatórios', icon: FileText },
]

export const curriculum = [
  { ano: 1, semestre: 1, disciplina: 'Introdução ao Direito', creditos: 6, tipo: 'Obrigatória' },
  { ano: 1, semestre: 1, disciplina: 'História do Direito', creditos: 4, tipo: 'Obrigatória' },
  { ano: 1, semestre: 2, disciplina: 'Direito Constitucional I', creditos: 6, tipo: 'Obrigatória' },
  { ano: 2, semestre: 1, disciplina: 'Direito Civil I', creditos: 6, tipo: 'Obrigatória' },
  { ano: 2, semestre: 1, disciplina: 'Direito Penal I', creditos: 6, tipo: 'Obrigatória' },
] 

export const initialCourseData = {
  id: 1,
  codigo: 'DIR-001',
  nome: 'Direito',
  descricao: 'Curso de Direito com foco na formação de profissionais qualificados para atuar nas diversas áreas do Direito, com ênfase na realidade jurídica angolana.',
  departamentoId: '1',
  duracao: 5,
  regime: 'Presencial',
  grau: 'Licenciatura',
  estado: 'ativo',
  coordenadorId: '101',
  anoCriacao: '2015',
  cargaHorariaTotal: 3600,
  creditosTotais: 240,
  vagasAnuais: 60,
  turno: 'Diurno',
  modalidade: 'Presencial',
  especializacoes: [
    { id: 1, nome: 'Direito Civil', descricao: 'Especialização em Direito Civil' },
    { id: 2, nome: 'Direito Penal', descricao: 'Especialização em Direito Penal' },
  ]
}

export const departmentsD = [
  { id: '1', nome: 'Ciências Sociais e Humanas' },
  { id: '2', nome: 'Engenharia' },
  { id: '3', nome: 'Saúde' }
]

export const coordinators = [
  { id: '101', nome: 'Dr. João Manuel', departamento: 'Ciências Sociais e Humanas' },
  { id: '102', nome: 'Dra. Maria Santos', departamento: 'Ciências Sociais e Humanas' },
  { id: '103', nome: 'Prof. Carlos Silva', departamento: 'Engenharia' },
]

export const regimes = ['Presencial', 'Semi-presencial', 'Distância']
export const degrees = ['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Graduação']
export const states = ['ativo', 'inativo', 'suspenso', 'em_planejamento']
export const shifts = ['Diurno', 'Noturno', 'Integral', 'Misto']
export const modalities = ['Presencial', 'EaD', 'Híbrido']