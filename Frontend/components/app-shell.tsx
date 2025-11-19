"use client"

import { useEffect, type PropsWithChildren } from "react"
import { useRouter, usePathname } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

export function AppShell({ children }: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return
    const token = localStorage.getItem("token")
    const mustReset = localStorage.getItem("forcePasswordReset") === "true"
    const perfilNome = localStorage.getItem("perfilNome")?.toLowerCase()

    if (!token) {
      router.replace("/")
      return
    }

    if (mustReset && window.location.pathname !== "/definir-senha") {
      router.replace("/definir-senha")
      return
    }

    const chamadosRoutes = ["/ordem-de-servico", "/ordem-de-servico/chamados"]
    const isChamados = chamadosRoutes.some((r) => pathname?.startsWith(r))

    if (perfilNome && (perfilNome === "cliente" || perfilNome === "tecnico")) {
      if (!isChamados) {
        router.replace("/ordem-de-servico/chamados")
      }
    }
  }, [router, pathname])

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-[220px] bg-gray-50 p-3 sm:p-4 lg:p-6 w-full min-w-0">{children}</main>
      </div>
      <Toaster />
    </>
  )
}
