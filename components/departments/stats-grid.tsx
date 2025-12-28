import { BookOpen, Building2, TrendingUp, Users } from "lucide-react";
import { departments } from "@/lib/utilities/departments-utilities"


export default function StatsGrid() {
  
   const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    })
  }

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Departamentos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{departments.length}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">+1 este ano</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Docentes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {departments.reduce((sum, dept) => sum + dept.numeroDocentes, 0)}
              </p>
              <p className="text-xs text-gray-500">Total em todos departamentos</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cursos Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {departments.reduce((sum, dept) => sum + dept.numeroCursos, 0)}
              </p>
              <p className="text-xs text-gray-500">Em funcionamento</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(departments.reduce((sum, dept) => sum + dept.orcamento, 0))}
              </p>
              <p className="text-xs text-gray-500">Anual</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
  )
}