"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, UserCog, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Clientes",
      href: "/clientes",
      icon: Users,
    },
    {
      name: "Técnicos",
      href: "/tecnicos",
      icon: UserCog,
    },
    {
      name: "Chamados",
      href: "/chamados",
      icon: PhoneCall,
    },
  ]

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
