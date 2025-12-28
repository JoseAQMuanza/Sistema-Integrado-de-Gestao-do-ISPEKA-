import { mainModules} from "./sidebar-utilities"
import { academicModules } from "./sidebar-utilities"
import { peopleModules } from "./sidebar-utilities"
import { qualityModules } from "./sidebar-utilities"
import { adminModules } from "./sidebar-utilities"
import { ChevronDownIcon } from "./sidebar-utilities"
import  { useState } from "react"

export default function SideBarElementsNavigation() {  

   const [expandedSections, setExpandedSections] = useState({
    academic: true,
    people: true,
    quality: true,
    admin: true,
  })
  
  const [isOpen, setIsOpen] = useState(false)
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <nav className="flex-1 p-4 overflow-y-auto ">
      {/* Main Modules */}
      <div className="space-y-1 mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Principal
        </p>
        {mainModules.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </a>
          )
        })}
      </div>

      {/* Academic Modules */}
      <div className="space-y-1 mb-6">
        <button
          onClick={() => toggleSection('academic')}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          <span>Acadêmico</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform cursor-pointer ${expandedSections.academic ? 'rotate-0' : '-rotate-90'}`} />
        </button>
        {expandedSections.academic && academicModules.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ml-2"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </a>
          )
        })}
      </div>

      {/* People Modules */}
      <div className="space-y-1 mb-6">
        <button
          onClick={() => toggleSection('people')}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          <span>Pessoas</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform cursor-pointer  ${expandedSections.people ? 'rotate-0' : '-rotate-90'}`} />
        </button>
        {expandedSections.people && peopleModules.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ml-2"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </a>
          )
        })}
      </div>

      {/* Quality Modules */}
      <div className="space-y-1 mb-6">
        <button
          onClick={() => toggleSection('quality')}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          <span>Qualidade</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform cursor-pointer ${expandedSections.quality ? 'rotate-0' : '-rotate-90'}`} />
        </button>
        {expandedSections.quality && qualityModules.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ml-2"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </a>
          )
        })}
      </div>

      {/* Admin Modules */}
      <div className="space-y-1">
        <button
          onClick={() => toggleSection('admin')}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          <span>Administrativo</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform cursor-pointer ${expandedSections.admin ? 'rotate-0' : '-rotate-90'}`} />
        </button>
        {expandedSections.admin && adminModules.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ml-2"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}