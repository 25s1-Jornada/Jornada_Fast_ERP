import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { EstoqueTable } from "./estoque-table"

export default function EstoquePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estoque</h1>
        <Link href="/estoque-geral/estoque/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Item de Estoque
          </Button>
        </Link>
      </div>

      <EstoqueTable />
    </div>
  )
}
