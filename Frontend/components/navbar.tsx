import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Sistema OS
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/clientes" className="text-sm font-medium hover:underline">
              Clientes
            </Link>
            <Link href="/tecnicos" className="text-sm font-medium hover:underline">
              Técnicos
            </Link>
            <Link href="/chamados" className="text-sm font-medium hover:underline">
              Chamados
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Ajuda
          </Button>
        </div>
      </div>
    </header>
  )
}
