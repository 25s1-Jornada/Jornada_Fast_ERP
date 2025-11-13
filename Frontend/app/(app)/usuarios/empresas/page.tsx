import type { Metadata } from "next"
import { EmpresasTable } from "../empresas-table"

export const metadata: Metadata = {
  title: "Empresas | Sistema de Ordem de Serviço",
  description: "Gerenciamento de empresas do sistema",
}

export default function EmpresasPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        <p className="text-muted-foreground">Gerencie as empresas cadastradas no sistema</p>
      </div>

      <EmpresasTable />
    </div>
  )
}
