"use client"

import type React from "react"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Package,
  Users,
  ClipboardList,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  UserCheck,
  Wrench,
  Archive,
  BarChart3,
  Truck,
  MapPin,
  User,
} from "lucide-react"
import { useAuth } from "./auth-provider"

interface MenuItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Ordem de Serviço",
    icon: Wrench,
    children: [
      {
        title: "Visão Geral",
        href: "/ordem-de-servico",
        icon: BarChart3,
      },
      {
        title: "Chamados",
        href: "/ordem-de-servico/chamados",
        icon: ClipboardList,
      },
      {
        title: "Clientes",
        href: "/ordem-de-servico/clientes",
        icon: Users,
      },
      {
        title: "Técnicos",
        href: "/ordem-de-servico/tecnicos",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Estoque Geral",
    icon: Package,
    children: [
      {
        title: "Visão Geral",
        href: "/estoque-geral",
        icon: BarChart3,
      },
      {
        title: "Produtos",
        href: "/estoque-geral/produtos",
        icon: Package,
      },
      {
        title: "Estoque",
        href: "/estoque-geral/estoque",
        icon: Archive,
      },
      {
        title: "Movimentações",
        href: "/estoque-geral/movimentacoes",
        icon: Truck,
      },
      {
        title: "Armários",
        href: "/estoque-geral/armarios",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Usuários",
    icon: User,
    children: [
      {
        title: "Usuários",
        href: "/usuarios/usuarios",
        icon: User,
      },
      {
        title: "Empresas",
        href: "/usuarios/empresas",
        icon: Building2,
      },
    ],
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileText,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

interface SidebarContentProps {
  onItemClick?: () => void
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { perfilNome } = useAuth()

  const filteredMenu = useMemo(() => {
    const role = (perfilNome ?? "").toLowerCase()

    if (role === "cliente" || role === "tecnico") {
      // Apenas chamados (ordem de serviço)
      return [
        {
          title: "Ordem de Serviço",
          icon: Wrench,
          children: [
            {
              title: "Chamados",
              href: "/ordem-de-servico/chamados",
              icon: ClipboardList,
            },
          ],
        },
      ]
    }

    // Admin e demais: menu completo
    return menuItems
  }, [perfilNome])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title)
    const hasChildren = item.children && item.children.length > 0
    const isActive = item.href ? pathname === item.href : false

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            className={cn("w-full justify-start", level > 0 && "ml-4", isActive && "bg-accent text-accent-foreground")}
            onClick={() => toggleExpanded(item.title)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
            {isExpanded ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
          </Button>
          {isExpanded && (
            <div className="ml-4 space-y-1">{item.children.map((child) => renderMenuItem(child, level + 1))}</div>
          )}
        </div>
      )
    }

    return (
      <Button
        key={item.title}
        variant="ghost"
        className={cn("w-full justify-start", level > 0 && "ml-4", isActive && "bg-accent text-accent-foreground")}
        asChild
        onClick={onItemClick}
      >
        <Link href={item.href!}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      </Button>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          
          <span>{"Sistema - OS"}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-4">{filteredMenu.map((item) => renderMenuItem(item))}</div>
      </ScrollArea>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block md:w-[220px] md:fixed md:left-0 md:top-16 md:bottom-0">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
