import { ChamadoForm } from "../chamado-form"

export default function NovoChamadoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Novo Chamado</h1>
      <ChamadoForm />
    </div>
  )
}
