'use client'

import { useState } from 'react'
import { GraduationCap, Menu, X, } from 'lucide-react'
import SideBarElementsNavigation from '../sidebar-components/sidebar-elements-navigation'
import UserProfile from '../sidebar-components/user-profile'


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SIG-ISPEKA</h1>
              <p className="text-xs text-gray-500">Gestão Acadêmica</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SideBarElementsNavigation/>

        {/* User profile */}
        <UserProfile userName='admin' userEmail='admin.edu.co.ao'/>
      </aside>
    </>
  )
}