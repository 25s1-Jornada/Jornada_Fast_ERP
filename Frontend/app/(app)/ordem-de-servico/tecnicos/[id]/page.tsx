import { notFound } from "next/navigation"
import { TecnicoForm } from "../tecnico-form"

// Função para simular a busca de um técnico pelo ID
async function getTecnico(id: string) {
  // Dados de exemplo
  const tecnicos = [
    {
      id: "1",
      nome: "Carlos Oliveira",
      empresa: "TechSupport Ltda",
      telefone: "(11) 98765-4321",
      email: "carlos@techsupport.com",
      cidade: "São Paulo",
      uf: "SP",
    },
    {
      id: "2",
      nome: "Ana Silva",
      empresa: "Manutenção Express",
      telefone: "(21) 97654-3210",
      email: "ana@manutencaoexpress.com",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
    {
      id: "3",
      nome: "Roberto Santos",
      empresa: "Fix IT Soluções",
      telefone: "(31) 96543-2109",
      email: "roberto@fixit.com",
      cidade: "Belo Horizonte",
      uf: "MG",
    },
  ]

  const tecnico = tecnicos.find((t) => t.id === id)

  if (!tecnico) {
    return null
  }

  return tecnico
}

export default async function EditarTecnicoPage({ params }: { params: { id: string } }) {
  const tecnico = await getTecnico(params.id)

  if (!tecnico) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Técnico</h1>
      <TecnicoForm tecnico={tecnico} />
    </div>
  )
}
