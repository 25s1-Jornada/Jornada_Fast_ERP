import { MovimentacoesTable } from "./movimentacoes-table"

export default function MovimentacoesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Movimentações de Estoque</h1>
      </div>

      <MovimentacoesTable />
    </div>
  )
}
