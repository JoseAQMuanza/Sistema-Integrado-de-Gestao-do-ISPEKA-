// types/index.ts - COMPLETO
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  departmentId?: string
  courseId?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 
  | 'admin'           // Direção Geral
  | 'direcao'         // Direção Acadêmica
  | 'qualidade'       // Secção de Qualidade
  | 'chefe_departamento'
  | 'coordenador'     // Coordenador de Curso
  | 'docente'
  | 'estudante'
  | 'secretaria'      // Secretaria Acadêmica
  | 'rh'              // Recursos Humanos
  | 'financeiro'      // Administração/Financeiro
  | 'ti'              // Área de TI

export interface Department {
  id: string
  codigo: string
  nome: string
  areaCientifica: string
  chefeId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  codigo: string
  nome: string
  descricao?: string
  departamentoId: string
  duracao: number  // em anos
  regime: 'Presencial' | 'Semi-presencial' | 'Distância'
  grau: 'Licenciatura' | 'Mestrado' | 'Doutoramento'
  estado: 'ativo' | 'inativo' | 'suspenso'
  createdAt: Date
  updatedAt: Date
  especializacoes?: Specialization[]
}

export interface Specialization {
  id: string
  nome: string
  cursoId: string
  descricao?: string
}

export interface AcademicYear {
  id: string
  ano: string  // "2023/2024"
  semestre: '1' | '2'
  dataInicio: Date
  dataFim: Date
  estado: 'planejado' | 'ativo' | 'concluído'
}

export interface Discipline {
  id: string
  codigo: string
  nome: string
  cursoId: string
  ano: number  // 1º, 2º, 3º ano
  semestre: number  // 1 ou 2
  creditos: number
  cargaHoraria: number
  preRequisitos?: string[]  // IDs das disciplinas pré-requisito
  tipo: 'Obrigatória' | 'Optativa'
}

export interface Class {
  id: string
  codigo: string
  disciplinaId: string
  docenteId: string
  anoAcademicoId: string
  sala?: string
  capacidade: number
  horarios: ClassSchedule[]
}

export interface ClassSchedule {
  dia: 1 | 2 | 3 | 4 | 5 | 6  // 1=Segunda, 6=Sábado
  horaInicio: string  // "08:00"
  horaFim: string    // "10:00"
}

export interface Enrollment {
  id: string
  estudanteId: string
  disciplinaId: string
  turmaId?: string
  anoAcademicoId: string
  estado: 'matriculado' | 'aprovado' | 'reprovado' | 'trancado'
  nota?: number
  frequencia?: number  // porcentagem
  dataMatricula: Date
}

export interface Grade {
  id: string
  estudanteId: string
  disciplinaId: string
  avaliacao: string  // "Teste 1", "Exame Final", etc.
  valor: number
  peso: number
  data: Date
  docenteId: string
}

export interface QualityIndicator {
  id: string
  nome: string
  descricao?: string
  tipo: 'curso' | 'docente' | 'departamento' | 'institucional'
  meta: number
  unidade: 'percentagem' | 'numero' | 'escala'
  periodo: 'semestral' | 'anual'
}

export interface QualityEvaluation {
  id: string
  indicadorId: string
  cursoId?: string
  docenteId?: string
  departamentoId?: string
  valor: number
  periodo: string  // "2023/2024-1"
  dataAvaliacao: Date
  observacoes?: string
}

export interface NonConformity {
  id: string
  descricao: string
  tipo: 'curso' | 'departamento' | 'instituicao' | 'processo'
  cursoId?: string
  departamentoId?: string
  dataIdentificacao: Date
  dataPrazo: Date
  status: 'aberta' | 'em_andamento' | 'resolvida'
  acoesCorretivas?: string
}

export interface ImprovementPlan {
  id: string
  naoConformidadeId?: string
  avaliacaoId?: string
  titulo: string
  descricao: string
  acoes: ImprovementAction[]
  dataInicio: Date
  dataFimPrevista: Date
  progresso: number  // 0-100
  status: 'planejado' | 'em_execucao' | 'concluido'
}

export interface ImprovementAction {
  descricao: string
  responsavelId: string
  prazo: Date
  concluida: boolean
}

export interface Financial {
  id: string
  estudanteId: string
  tipo: 'propina' | 'taxa' | 'multa'
  descricao: string
  valor: number
  dataVencimento: Date
  dataPagamento?: Date
  status: 'pendente' | 'pago' | 'atrasado'
  referencia?: string
}

export interface Report {
  id: string
  titulo: string
  tipo: 'academico' | 'financeiro' | 'qualidade' | 'estatistico'
  periodo: string
  formato: 'pdf' | 'excel' | 'html'
  dataGeracao: Date
  geradoPor: string
  parametros?: Record<string, any>
}

export interface AuditLog {
  id: string
  usuarioId: string
  acao: string
  entidade: string
  entidadeId?: string
  dadosAntigos?: any
  dadosNovos?: any
  ip?: string
  userAgent?: string
  createdAt: Date
}

// Para forms e inputs
export interface CourseFormData {
  codigo: string
  nome: string
  departamentoId: string
  duracao: number
  regime: 'Presencial' | 'Semi-presencial' | 'Distância'
  grau: 'Licenciatura' | 'Mestrado' | 'Doutoramento'
  descricao?: string
  especializacoes?: Array<{ nome: string; descricao?: string }>
}

export interface StudentFormData {
  nome: string
  email: string
  telefone?: string
  dataNascimento?: string
  genero?: 'M' | 'F' | 'Outro'
  endereco?: string
  numeroEstudante: string
  cursoId: string
  anoIngresso: string
}

// Para dashboard stats
export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  activeCourses: number
  enrollmentRate: number
  graduationRate: number
  revenue: number
  qualityIndicators: {
    met: number
    total: number
  }
}

// Para API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresAt: Date
}

// Enums como const
export const CourseRegime = {
  PRESENCIAL: 'Presencial',
  SEMI_PRESENCIAL: 'Semi-presencial',
  DISTANCIA: 'Distância'
} as const

export const CourseDegree = {
  LICENCIATURA: 'Licenciatura',
  MESTRADO: 'Mestrado',
  DOUTORAMENTO: 'Doutoramento'
} as const

export const CourseStatus = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  SUSPENSO: 'suspenso'
} as const

export const EnrollmentStatus = {
  MATRICULADO: 'matriculado',
  APROVADO: 'aprovado',
  REPROVADO: 'reprovado',
  TRANCADO: 'trancado'
} as const

export const PaymentStatus = {
  PENDENTE: 'pendente',
  PAGO: 'pago',
  ATRASADO: 'atrasado'
} as const


export interface Teacher {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  identityNumber: string;
  taxNumber?: string;
  birthDate?: Date;
  birthPlace?: string;
  nationality: string;
  gender?: 'male' | 'female';
  maritalStatus?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country: string;
  academicTitle: string;
  highestDegree: string;
  institution?: string;
  yearGraduation?: number;
  areaSpecialization?: string;  
  hireDate: Date;
  contractType: string;
  departmentId: string;
  department?: Department;
  courses?: Course[];
  status: 'active' | 'inactive' | 'on_leave';
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilePhone: string;
  identityNumber: string;
  taxNumber: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  academicTitle: string;
  highestDegree: string;
  institution: string;
  yearGraduation: string;
  areaSpecialization: string;
  employeeNumber: string;
  hireDate: string;
  contractType: string;
  departmentId: string;
  courses: string[];
  status: string;
  username: string;
  generatePassword: boolean;
  sendCredentials: boolean;
}