import { GraduationCap, BookOpen, Users, Building2 } from "lucide-react"

export default function CoursesStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Cursos Ativos</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">22</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Estudantes</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">2,845</p>
          </div>
          <div className="p-3 bg-violet-50 rounded-lg">
            <Users className="w-6 h-6 text-violet-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Departamentos</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <Building2 className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  )
}