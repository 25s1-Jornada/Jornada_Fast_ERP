import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ArmariosTable } from "./armarios-table"

export default function ArmariosPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Armários</h1>
        <Link href="/estoque/armarios/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Armário
          </Button>
        </Link>
      </div>

      <ArmariosTable />
    </div>
  )
}
