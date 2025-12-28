import { recentActivities } from "../../lib/utilities/dashboard-utilities"
import { CheckCircle, AlertCircle, Eye, Clock } from "lucide-react"

export default function RecentActivities() {
  return (
    <>
      {/* Recent Activities */} 
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Atividades Recentes</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            Ver todas
          </button>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg mr-3 ${activity.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                {activity.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                  activity.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                    <Eye className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}