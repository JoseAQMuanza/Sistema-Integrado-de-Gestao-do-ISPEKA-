// components/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  Settings,
  LayoutDashboard,
  FileText,
  Tags,
  Briefcase,
  User,
  BarChart3,
  Users,
  LogOut,
} from 'lucide-react'


interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  role: 'staff' | 'admin'
}

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    // Menu apenas para admin
    {
      name: 'Configurações',
      href: '/admin/configuracao',
      icon: <Settings className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'DashBoard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'Todos Documentos',
      href: '/admin/documents',
      icon: <FileText className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'Tipos de Documento',
      href: '/admin/documents/documents-type',
      icon: <Tags className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'Cargos',
      href: '/admin/possition',
      icon: <Briefcase className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'Perfil',
      href: '/admin/profile',
      icon: <User className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'Relatórios',
      href: '/admin/reports',
      icon: <BarChart3 className="w-5 h-5" />,
      role: 'admin'
    },
    {
      name: 'Usuários',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
      role: 'admin'
    },

    // Menu para staff
    {
      name: 'Documentos Públicos',
      href: '/documents/publics',
      icon: <FileText className="w-5 h-5" />,
      role: 'staff'
    },
    {
      name: 'Perfil',
      href: '/staff/profile',
      icon: <User className="w-5 h-5" />,
      role: 'staff'
    },
    {
      name: 'Meus Documentos',
      href: '/staff/documents/my',
      icon: <FileText className="w-5 h-5" />,
      role: 'staff'
    }, {
      name: 'Novo Documento',
      href: '/staff/documents/new',
      icon: <FileText className="w-5 h-5" />,
      role: 'staff'
    },
    {
      name: 'Dashboard',
      href: '/staff/dashboard',
      icon: <User className="w-5 h-5" />,
      role: 'staff'
    }
  ];

  const filteredMenu = menuItems.filter(item =>
    (userRole === 'admin' && item.role === 'admin') ||
    (userRole === 'staff' && item.role === 'staff')
  );

  return (
    <div className={`bg-orange-900 text-white transition-staff duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 border-b border-orange-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold">ISPEKA </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-orange-800"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        {!collapsed && (
          <p className="text-white text-sm mt-1">Role: {userRole}</p>
        )}
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                    ? 'bg-orange-600 text-white'
                    : 'hover:bg-orange-800 text-white'
                    }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


      <div className=" bottom-0 left-0 right-0 border-t border-white">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/signin';
          }}
          className={`flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-orange-800 text-white cursor-pointer  ${collapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}