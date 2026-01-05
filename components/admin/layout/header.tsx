export default function HeaderAdmin({userInfo}: {userInfo:any}) {
  return (
    <header className="bg-white shadow">
      <div className="px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">
              Bem-vindo, {userInfo.nome}! • {userInfo.cargo?.nome}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">{userInfo.email}</p>
              <p className="text-xs text-gray-500">
                {userInfo.role?.name === 'admin' ? 'Administrador' : 'Usuário'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">
                {userInfo.nome.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}