import { notFound } from "next/navigation"
import { EstoqueForm } from "../estoque-form"

// Função para simular a busca de um item de estoque pelo ID
async function getItemEstoque(id: string) {
  // Dados de exemplo
  const estoqueItens = [
    {
      id: "1",
      armario_id: "1",
      produto_id: "1",
      quantidade: 15,
      armario: { id: "1", nome: "Armário Principal" },
      produto: { id: "1", nome: "Compressor 1HP", sku: "PROD001" },
      ultima_movimentacao: {
        id: "1",
        produto_id: "1",
        tipo: "ENTRADA",
        quantidade: 5,
        armario_id: "1",
        data_movimentacao: "2023-05-15T10:30:00",
        observacao: "Recebimento de fornecedor",
        usuario_id: "1",
        usuario: { id: "1", nome: "Admin" },
      },
    },
    {
      id: "2",
      armario_id: "1",
      produto_id: "2",
      quantidade: 30,
      armario: { id: "1", nome: "Armário Principal" },
      produto: { id: "2", nome: "Lâmpada LED 15W", sku: "PROD002" },
      ultima_movimentacao: {
        id: "2",
        produto_id: "2",
        tipo: "ENTRADA",
        quantidade: 10,
        armario_id: "1",
        data_movimentacao: "2023-05-16T14:20:00",
        observacao: "Compra mensal",
        usuario_id: "1",
        usuario: { id: "1", nome: "Admin" },
      },
    },
    {
      id: "3",
      armario_id: "2",
      produto_id: "3",
      quantidade: 8,
      armario: { id: "2", nome: "Armário Secundário" },
      produto: { id: "3", nome: "Suporte para Ar Condicionado", sku: "PROD003" },
      ultima_movimentacao: {
        id: "3",
        produto_id: "3",
        tipo: "SAIDA",
        quantidade: 2,
        armario_id: "2",
        data_movimentacao: "2023-05-17T09:15:00",
        observacao: "Utilizado em chamado #123",
        usuario_id: "2",
        usuario: { id: "2", nome: "Técnico" },
      },
    },
    {
      id: "4",
      armario_id: "3",
      produto_id: "4",
      quantidade: 5,
      armario: { id: "3", nome: "Armário Filial SP" },
      produto: { id: "4", nome: "Gás Refrigerante R410A", sku: "PROD004" },
      ultima_movimentacao: {
        id: "4",
        produto_id: "4",
        tipo: "ENTRADA",
        quantidade: 5,
        armario_id: "3",
        data_movimentacao: "2023-05-18T11:45:00",
        observacao: "Transferência entre filiais",
        usuario_id: "1",
        usuario: { id: "1", nome: "Admin" },
      },
    },
    {
      id: "5",
      armario_id: "4",
      produto_id: "5",
      quantidade: 25,
      armario: { id: "4", nome: "Armário Peças Pequenas" },
      produto: { id: "5", nome: "Painel LED 24W", sku: "PROD005" },
      ultima_movimentacao: {
        id: "5",
        produto_id: "5",
        tipo: "SAIDA",
        quantidade: 5,
        armario_id: "4",
        data_movimentacao: "2023-05-19T16:30:00",
        observacao: "Venda para cliente",
        usuario_id: "3",
        usuario: { id: "3", nome: "Vendedor" },
      },
    },
  ]

  const item = estoqueItens.find((i) => i.id === id)

  if (!item) {
    return null
  }

  return item
}

export default async function EditarEstoquePage({ params }: { params: { id: string } }) {
  const itemEstoque = await getItemEstoque(params.id)

  if (!itemEstoque) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Item de Estoque</h1>
      <EstoqueForm itemEstoque={itemEstoque} />
    </div>
  )
}
