// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pagina de login',
  description: 'Pagina de login',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {children}
    </div>
  )
}