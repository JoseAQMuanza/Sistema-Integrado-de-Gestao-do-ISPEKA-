import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,   
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react'

// Data mocketed to dashboard
export const stats = [
  {
    title: 'Total de Estudantes',
    value: '2,845',
    change: '+12.5%',
    isPositive: true,
    icon: Users,
    color: 'bg-blue-500',
    description: 'Matriculados este ano'
  },
  {
    title: 'Docentes Ativos',
    value: '186',
    change: '+5.2%',
    isPositive: true,
    icon: GraduationCap,
    color: 'bg-emerald-500',
    description: 'Em atividade'
  },
  {
    title: 'Cursos Ativos',
    value: '28',
    change: '+3',
    isPositive: true,
    icon: BookOpen,
    color: 'bg-violet-500',
    description: 'Oferecidos'
  },
  {
    title: 'Taxa de Aprovação',
    value: '78.4%',
    change: '-2.1%',
    isPositive: false,
    icon: TrendingUp,
    color: 'bg-amber-500',
    description: 'Último semestre'
  }
]

export const recentActivities = [
  {
    id: 1,
    user: 'Maria Silva',
    action: 'realizou matrícula em',
    target: 'Engenharia Civil',
    time: '10 min atrás',
    type: 'success'
  },
  {
    id: 2,
    user: 'Prof. Carlos Santos',
    action: 'cadastrou nova disciplina',
    target: 'Cálculo III',
    time: '1 hora atrás',
    type: 'info'
  },
  {
    id: 3,
    user: 'Secretaria Académica',
    action: 'emitiu declaração para',
    target: 'João Pereira',
    time: '2 horas atrás',
    type: 'warning'
  },
  {
    id: 4,
    user: 'Sistema',
    action: 'relatório gerado',
    target: 'Frequência Mensal',
    time: '1 dia atrás',
    type: 'info'
  }
]

export const upcomingEvents = [
  {
    id: 1,
    title: 'Prova Final - Direito',
    date: '15 Dez',
    time: '08:00 - 10:00',
    type: 'exam'
  },
  {
    id: 2,
    title: 'Reunião de Departamento',
    date: '18 Dez',
    time: '14:00 - 16:00',
    type: 'meeting'
  },
  {
    id: 3,
    title: 'Entrega TCC',
    date: '20 Dez',
    time: 'Até 23:59',
    type: 'deadline'
  }
]

export const quickActions = [
  {
    title: 'Nova Matrícula',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
    href: '/estudantes/matriculas'
  },
  {
    title: 'Lançar Notas',
    icon: FileText,
    color: 'bg-emerald-100 text-emerald-600',
    href: '/academico/notas'
  },
  {
    title: 'Gerar Relatório',
    icon: BarChart3,
    color: 'bg-violet-100 text-violet-600',
    href: '/relatorios'
  },
  {
    title: 'Agendar Aula',
    icon: Calendar,
    color: 'bg-amber-100 text-amber-600',
    href: '/academico/horarios'
  }
]