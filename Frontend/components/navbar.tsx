"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { email, perfilNome, refresh } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Atualiza quando auth-changed disparar
    const handler = () => refresh()
    window.addEventListener("auth-changed", handler as any)
    return () => window.removeEventListener("auth-changed", handler as any)
  }, [refresh])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("perfilId")
      localStorage.removeItem("perfilNome")
      localStorage.removeItem("email")
      localStorage.removeItem("forcePasswordReset")
      localStorage.removeItem("userId")
      window.dispatchEvent(new Event("auth-changed"))
    }
    router.replace("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Menu hambúrguer para mobile */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center justify-start">
                  <Image
                    src="/images/fast.png"
                    alt="FAST - Gôndolas e Check-outs"
                    width={100}
                    height={32}
                    className="h-6 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-[calc(100vh-80px)]">
                <Sidebar isMobile={true} onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/fast.png"
              alt="FAST - Gôndolas e Check-outs"
              width={120}
              height={40}
              className="h-6 sm:h-8 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-sm leading-tight">
            <span className="font-semibold text-gray-900">{email || "Usuário"}</span>
            <span className="text-xs text-gray-500">{perfilNome || "Perfil não definido"}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-1">
                <div className="font-semibold">{email || "Usuário"}</div>
                <div className="text-xs text-muted-foreground">{perfilNome || "Perfil não definido"}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
