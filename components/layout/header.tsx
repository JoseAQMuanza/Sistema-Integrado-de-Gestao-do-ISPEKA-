// components/header.tsx
'use client';

import { supabase} from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function Header({ userInfo }: { userInfo: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userInfo.nome}</p>
              <p className="text-xs text-gray-500">
                {userInfo.cargo?.nome} • {userInfo.role?.name === 'admin' ? 'Administrador' : 'Usuário'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}