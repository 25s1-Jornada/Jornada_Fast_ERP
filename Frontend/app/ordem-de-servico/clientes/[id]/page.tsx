import { notFound } from "next/navigation"
import { ClienteForm } from "../cliente-form"

// Função para simular a busca de um cliente pelo ID
async function getCliente(id: string) {
  // Dados de exemplo
  const clientes = [
    {
      id: "1",
      nome: "João Silva",
      contato: "Maria Silva",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      codigo: "CLI001",
      pedido: "PED123",
      dataFaturamento: "15/05/2023",
      garantia: "12 meses",
    },
    {
      id: "2",
      nome: "Empresa ABC Ltda",
      contato: "Carlos Souza",
      telefone: "(11) 91234-5678",
      endereco: "Av. Paulista",
      numero: "1500",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      codigo: "CLI002",
      pedido: "PED456",
      dataFaturamento: "22/06/2023",
      garantia: "24 meses",
    },
    {
      id: "3",
      nome: "Comércio XYZ",
      contato: "Ana Oliveira",
      telefone: "(21) 98888-7777",
      endereco: "Rua do Comércio",
      numero: "45",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      codigo: "CLI003",
      pedido: "PED789",
      dataFaturamento: "10/07/2023",
      garantia: "6 meses",
    },
  ]

  const cliente = clientes.find((c) => c.id === id)

  if (!cliente) {
    return null
  }

  return cliente
}

export default async function EditarClientePage({ params }: { params: { id: string } }) {
  const cliente = await getCliente(params.id)

  if (!cliente) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Cliente</h1>
      <ClienteForm cliente={cliente} />
    </div>
  )
}
