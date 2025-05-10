import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FAST - Sistema de gerenciamento de estoque e ordens de serviço",
  description: "FAST - Aplicação para gerenciamento de estoque e ordens de serviço",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        <div className="flex min-h-screen pt-16">
          <Sidebar />
          <main className="flex-1 ml-64 bg-gray-50 p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
