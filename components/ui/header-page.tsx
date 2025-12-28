type HeaderPageProps = {
  headerTitle: string,
  discriptions: string,   
  pageName: string 
  showExportButton: boolean
}
import { Download, Plus } from "lucide-react";

export default function HeaderPage( { headerTitle, discriptions, pageName, showExportButton }: HeaderPageProps) {  
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{headerTitle}</h1>
            <p className="text-gray-600">{discriptions}</p>
          </div>
          <div className="flex items-center space-x-3">
            {showExportButton&&
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            }
            <a
              href="/courses/new"
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo {pageName}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}