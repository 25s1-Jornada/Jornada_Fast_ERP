import { EstoqueForm } from "../estoque-form"

export default function NovoEstoquePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Novo Item de Estoque</h1>
      <EstoqueForm />
    </div>
  )
}
