import { Home, Building2, Users, GraduationCap, BookOpen, UserCircle, School, FileText, BarChart3, Settings, Shield, ClipboardCheck, Calendar, CreditCard, Menu, X, ChevronDown } from 'lucide-react'

//Main Modules
export const mainModules = [    
   { name: 'Dashboard', icon: Home, href: '/', }, 
   { name: 'Instituição', icon: Building2, href: '/institutions', }, 
   { name: 'Departamentos', icon: Users, href: '/departments', }, 
   { name: 'Cursos', icon: GraduationCap, href: '/courses', }, ]

//Academic Modules 
export const  academicModules = [
  { name: 'Anos Académicos', icon: Calendar, href: '/academic/years',},
  { name: 'Disciplinas', icon: BookOpen, href: '/academic/disciplines',},
  { name: 'Turmas', icon: School, href: '/academic/classes',},
  { name: 'Horários', icon: Calendar, href: '/academic/schedules',},
]

//People Modules
export const peopleModules = [
  { name: 'Docentes', icon: UserCircle, href: '/teachers', },
  { name: 'Estudantes', icon: Users, href: '/students', },
]

// Quality Modules
export const qualityModules = [
  { name: 'Indicadores', icon: BarChart3, href: '/quality/indicators', },
  { name: 'Avaliações', icon: ClipboardCheck, href: '/quality/reviews', },
  { name: 'Auditorias', icon: Shield, href: '/quality/auditses', },
]

// Admin Modules
export const adminModules = [
  { name: 'Financeiro', icon: CreditCard, href: '/financial', },
  { name: 'Relatórios', icon: FileText, href: '/reports', },
  { name: 'Configurações', icon: Settings, href: '/config', },
]

//ChevronDown
export const ChevronDownIcon = ChevronDown