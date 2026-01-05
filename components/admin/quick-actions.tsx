export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/admin/users/create"
          className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="p-2 rounded-full bg-orange-100 text-orange-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="font-medium">Criar Usuário</h3>
            <p className="text-sm text-gray-500">Adicionar novo funcionário</p>
          </div>
        </a>

        <a
          href="/admin/documents/documents-type"
          className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="font-medium">Tipos de Documento</h3>
            <p className="text-sm text-gray-500">Gerenciar categorias</p>
          </div>
        </a>

        <a
          href="/admin/documents"
          className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="p-2 rounded-full bg-purple-100 text-orange-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="font-medium">Todos Documentos</h3>
            <p className="text-sm text-gray-500">Ver todos os arquivos</p>
          </div>
        </a>
      </div>
    </div>
  )
}