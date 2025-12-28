import { ChevronDown, Filter, Search } from "lucide-react";
import { areasCientificas, statusOptions } from "@/lib/utilities/departments-utilities"
import { useState } from "react";

export default function Filters() {
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedArea, setSelectedArea] = useState('Todas as áreas')
  const [selectedStatus, setSelectedStatus] = useState('Todos os estados') 

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, código ou chefe..."
              className="pl-10 w-full input-field"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Científica
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full input-field"
              >
                {areasCientificas.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full input-field"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'em_reestruturacao' ? 'Em Reestruturação' :
                      status === 'em_implementacao' ? 'Em Implementação' :
                        status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação Mínima
              </label>
              <select className="w-full input-field">
                <option>Todas as avaliações</option>
                <option>4.0+ ⭐⭐⭐⭐</option>
                <option>4.5+ ⭐⭐⭐⭐½</option>
                <option>5.0 ⭐⭐⭐⭐⭐</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}