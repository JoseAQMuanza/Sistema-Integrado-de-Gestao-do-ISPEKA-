// app/layout.tsx (ou layout principal)
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema de Gestão Documental',
  description: 'Sistema profissional para gerenciamento de documentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 ">
          {children}
        </main>
      </body>
    </html>
  )
}