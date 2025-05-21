"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, ClipboardList, Package, Users, UserCog, PhoneCall, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Sidebar() {
  const pathname = usePathname()

  // Estado para controlar quais seções estão expandidas
  const [openSections, setOpenSections] = useState({
    ordemServico: true, // Começa expandido por padrão
    estoque: false,
  })

  // Verifica se o caminho atual está dentro da seção de Ordem de Serviço
  const isOrdemServicoActive =
    pathname.includes("/clientes") || pathname.includes("/tecnicos") || pathname.includes("/chamados")

  // Verifica se o caminho atual está dentro da seção de Estoque
  const isEstoqueActive = pathname.includes("/estoque")

  // Toggle para abrir/fechar seções
  const toggleSection = (section: "ordemServico" | "estoque") => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white overflow-y-auto">
      <div className="flex flex-col gap-1 p-4">
        {/* Seção de Ordem de Serviço */}
        <Collapsible
          open={openSections.ordemServico}
          onOpenChange={() => toggleSection("ordemServico")}
          className="w-full"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5" />
              <span>Ordem de Serviço</span>
            </div>
            {openSections.ordemServico ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-1">
            <Link
              href="/clientes"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/clientes" || pathname.startsWith("/clientes/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Users className="h-4 w-4" />
              Clientes
            </Link>
            <Link
              href="/tecnicos"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/tecnicos" || pathname.startsWith("/tecnicos/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <UserCog className="h-4 w-4" />
              Técnicos
            </Link>
            <Link
              href="/chamados"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/chamados" || pathname.startsWith("/chamados/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <PhoneCall className="h-4 w-4" />
              Chamados
            </Link>
          </CollapsibleContent>
        </Collapsible>

        {/* Seção de Estoque */}
        <Collapsible open={openSections.estoque} onOpenChange={() => toggleSection("estoque")} className="w-full">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5" />
              <span>Estoque</span>
            </div>
            {openSections.estoque ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-1">
            <Link
              href="/estoque/produtos"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/estoque/produtos" || pathname.startsWith("/estoque/produtos/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Package className="h-4 w-4" />
              Produtos
            </Link>
            <Link
              href="/estoque/armarios"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/estoque/armarios" || pathname.startsWith("/estoque/armarios/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Archive className="h-4 w-4" />
              Armários
            </Link>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
