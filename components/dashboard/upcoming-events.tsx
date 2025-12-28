import { upcomingEvents } from "../../lib/utilities/dashboard-utilities"
import { Calendar, BarChart3 } from "lucide-react"

export default function UpComingEvents() {
  return (
    <>
      {/* Upcoming Events */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            Ver calendário
          </button>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.type === 'exam' ? 'bg-red-100 text-red-800' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                  }`}>
                  {event.type === 'exam' ? 'Prova' :
                    event.type === 'meeting' ? 'Reunião' : 'Prazo'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state for chart */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Gráficos de desempenho</p>
              <p className="text-sm text-gray-400">Disponível em breve</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}