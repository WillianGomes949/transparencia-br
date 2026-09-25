import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Archivo_Black } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Portal da Transparência',
  description: 'Acompanhe os gastos públicos em tempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${mono.variable} ${archivo.variable}`}>
      <body className="bg-paper text-ink font-body antialiased min-h-screen">
        <Providers>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-[calc(100vh-80px)] p-6 md:p-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}