import { ClienteForm } from "../cliente-form"

export default function NovoClientePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Novo Cliente</h1>
      <ClienteForm />
    </div>
  )
}
