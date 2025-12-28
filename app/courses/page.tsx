'use client'

import { useState } from 'react'
import {
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,  
  Users,
  Clock,
} from 'lucide-react'

import CoursesStats from './courses-stats'
import CoursesFilters from './courses-filters'
import CoursesTable from './courses-table'
import HeaderPage from '@/components/ui/header-page'

export default function CoursesPage() {
  return (
    <div className="space-y-6">      
      {/* Header Page*/}      
      <HeaderPage 
        headerTitle='Gestão de Cursos' 
        pageName='Curso' 
        discriptions='Gerencie os cursos oferecidos pelo ISPEKA' 
        showExportButton={true}/>
      {/* Stats */}
      <CoursesStats />

      {/* Filters */}
      <CoursesFilters />
      
    {/* Courses Table */}
    <CoursesTable />
    </div>
  )
}