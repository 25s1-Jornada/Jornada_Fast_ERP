import { TecnicoForm } from "../tecnico-form"

export default function NovoTecnicoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Novo Técnico</h1>
      <TecnicoForm />
    </div>
  )
}
