// components/DashboardStats.tsx - JÁ ATUALIZADO para Lucide
'use client'

import { Users, GraduationCap, BookOpen, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  {
    title: 'Total de Alunos',
    value: '2,845',
    change: '+12.5%',
    isPositive: true,
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Professores',
    value: '186',
    change: '+5.2%',
    isPositive: true,
    icon: GraduationCap,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    title: 'Cursos Ativos',
    value: '28',
    change: '+3',
    isPositive: true,
    icon: BookOpen,
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50'
  },
  {
    title: 'Taxa de Ocupação',
    value: '94%',
    change: '-2.1%',
    isPositive: false,
    icon: TrendingUp,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50'
  }
]

export default function DashboardStats() {
  return (
    <div className="bg-orange-400 rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Visão Geral</h2>
        <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>Este mês</option>
          <option>Mês passado</option>
          <option>Últimos 3 meses</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-5 border border-gray-100`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}