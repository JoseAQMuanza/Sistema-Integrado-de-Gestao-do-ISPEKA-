'use client'

import StatsGrid from '../../components/dashboard/stats-grid'
import QuickActions from '../../components/dashboard/quick-actions'
import RecentActivities from '../../components/dashboard/recent-activities'
import UpComingEvents from '../../components/dashboard/upcoming-events'
import SystemStatus from '../../components/dashboard/system-status'
import HeaderPage from '@/components/ui/header-page'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header Page */}
      <HeaderPage
        headerTitle='Dashboard'
        pageName='Curso'
        discriptions='Bem-vindo ao Sistema Integrado de Gestão do ISPEKA' 
        showExportButton={false}/>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <RecentActivities />

        {/* Upcoming Events */}
        <UpComingEvents />
      </div>

      {/* System Status */}
      <SystemStatus />
    </div>
  )
}