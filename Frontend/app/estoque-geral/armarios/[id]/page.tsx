import { notFound } from "next/navigation"
import { ArmarioForm } from "../armario-form"

// Função para simular a busca de um armário pelo ID
async function getArmario(id: string) {
  // Dados de exemplo
  const armarios = [
    {
      id: "1",
      nome: "Armário Principal",
      empresa: {
        id: "1",
        nome: "FAST Refrigeração Ltda",
        cnpj: "12.345.678/0001-90",
      },
    },
    {
      id: "2",
      nome: "Armário Secundário",
      empresa: {
        id: "1",
        nome: "FAST Refrigeração Ltda",
        cnpj: "12.345.678/0001-90",
      },
    },
    {
      id: "3",
      nome: "Armário Filial SP",
      empresa: {
        id: "2",
        nome: "FAST SP Ltda",
        cnpj: "98.765.432/0001-10",
      },
    },
    {
      id: "4",
      nome: "Armário Peças Pequenas",
      empresa: {
        id: "1",
        nome: "FAST Refrigeração Ltda",
        cnpj: "12.345.678/0001-90",
      },
    },
    {
      id: "5",
      nome: "Armário Ferramentas",
      empresa: {
        id: "3",
        nome: "FAST Manutenção Ltda",
        cnpj: "45.678.901/0001-23",
      },
    },
  ]

  const armario = armarios.find((a) => a.id === id)

  if (!armario) {
    return null
  }

  return armario
}

export default async function EditarArmarioPage({ params }: { params: { id: string } }) {
  const armario = await getArmario(params.id)

  if (!armario) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Armário</h1>
      <ArmarioForm armario={armario} />
    </div>
  )
}
