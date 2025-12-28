import { Search, Filter, ChevronDown } from 'lucide-react'
import { departments, statusOptions } from './courses-utilities'
import { useState } from 'react'

export default function CoursesFilters() {
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('Todos os departamentos')
  const [selectedStatus, setSelectedStatus] = useState('Todos os estados')
  return (
    <>
      {/* Filters */}
      <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
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
                placeholder="Pesquisar por nome ou código..."
                className="pl-10 w-full input-field border outline-none p-2 rounded-md "
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full input-field"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
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
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração
                </label>
                <select className="w-full input-field">
                  <option>Todas as durações</option>
                  <option>4 anos</option>
                  <option>5 anos</option>
                  <option>6 anos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regime
                </label>
                <select className="w-full input-field">
                  <option>Todos os regimes</option>
                  <option>Presencial</option>
                  <option>Semi-presencial</option>
                  <option>Distância</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}