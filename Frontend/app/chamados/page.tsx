import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ChamadosTable } from "./chamados-table"

export default function ChamadosPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chamados</h1>
        <Link href="/chamados/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Chamado
          </Button>
        </Link>
      </div>

      <ChamadosTable />
    </div>
  )
}
