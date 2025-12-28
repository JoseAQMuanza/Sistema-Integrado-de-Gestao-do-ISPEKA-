// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SIG-ISPEKA - Sistema Integrado de Gestão',
  description: 'Sistema de gestão acadêmica do Instituto Superior Politécnico Kalandula',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className="min-h-screen w-screen ">
      <body className={`${inter.className} h-full w-full bg-gray-50`}>
        <div className="min-h-screen flex min-w-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}