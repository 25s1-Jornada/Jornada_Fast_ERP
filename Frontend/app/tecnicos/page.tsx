import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TecnicosTable } from "./tecnicos-table"

export default function TecnicosPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Técnicos</h1>
        <Link href="/tecnicos/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Técnico
          </Button>
        </Link>
      </div>

      <TecnicosTable />
    </div>
  )
}
