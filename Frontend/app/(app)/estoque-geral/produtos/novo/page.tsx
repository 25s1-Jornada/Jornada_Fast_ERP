import { ProdutoForm } from "../produto-form"

export default function NovoProdutoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Novo Produto</h1>
      <ProdutoForm />
    </div>
  )
}
