import { AlertCircle, Star, Target, TrendingUp } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <a
        href="/departamentos/relatorios"
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-blue-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">Relatórios</span>
          <p className="text-sm text-gray-600 mt-1">Académicos</p>
        </div>
      </a>

      <a
        href="/departamentos/avaliacoes"
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-sm transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="font-medium text-gray-900">Avaliações</span>
          <p className="text-sm text-gray-600 mt-1">De Qualidade</p>
        </div>
      </a>

      <a
        href="/departamentos/orcamento"
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-500 hover:shadow-sm transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-violet-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-violet-600" />
          </div>
          <span className="font-medium text-gray-900">Orçamento</span>
          <p className="text-sm text-gray-600 mt-1">Planejamento</p>
        </div>
      </a>

      <a
        href="/departamentos/auditorias"
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-500 hover:shadow-sm transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-amber-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <span className="font-medium text-gray-900">Auditorias</span>
          <p className="text-sm text-gray-600 mt-1">Internas</p>
        </div>
      </a>
    </div>
  )
}