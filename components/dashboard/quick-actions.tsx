import { quickActions } from "../../lib/utilities/dashboard-utilities"
import { ArrowUpRight } from "lucide-react"

export default function QuickActions() {
  return (
    <>
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <a
                key={index}
                href={action.href}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-lg ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-gray-900">{action.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}