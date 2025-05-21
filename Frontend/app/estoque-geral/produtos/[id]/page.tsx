import { notFound } from "next/navigation"
import { ProdutoForm } from "../produto-form"

// Função para simular a busca de um produto pelo ID
async function getProduto(id: string) {
  // Dados de exemplo
  const produtos = [
    {
      id: "1",
      id_integracao: "INT001",
      sku: "PROD001",
      nome: "Compressor 1HP",
      descricao: "Compressor de refrigeração 1HP 220V",
      preco: "850.00",
      categorias: [
        { id: "1", nome: "Refrigeração", descricao: "Produtos para refrigeração" },
        { id: "3", nome: "Compressores", descricao: "Compressores para diversos usos" },
      ],
      status: "ativo",
    },
    {
      id: "2",
      id_integracao: "INT002",
      sku: "PROD002",
      nome: "Lâmpada LED 15W",
      descricao: "Lâmpada LED 15W Branca",
      preco: "25.90",
      categorias: [{ id: "2", nome: "Iluminação", descricao: "Produtos para iluminação" }],
      status: "ativo",
    },
    {
      id: "3",
      id_integracao: "INT003",
      sku: "PROD003",
      nome: "Suporte para Ar Condicionado",
      descricao: "Suporte para ar condicionado split até 18000 BTUs",
      preco: "120.50",
      categorias: [
        { id: "1", nome: "Refrigeração", descricao: "Produtos para refrigeração" },
        { id: "4", nome: "Acessórios", descricao: "Acessórios diversos" },
      ],
      status: "ativo",
    },
    {
      id: "4",
      id_integracao: "INT004",
      sku: "PROD004",
      nome: "Gás Refrigerante R410A",
      descricao: "Gás refrigerante R410A - Cilindro 11kg",
      preco: "450.00",
      categorias: [{ id: "1", nome: "Refrigeração", descricao: "Produtos para refrigeração" }],
      status: "inativo",
    },
    {
      id: "5",
      id_integracao: "INT005",
      sku: "PROD005",
      nome: "Painel LED 24W",
      descricao: "Painel LED 24W de embutir 30x30cm",
      preco: "89.90",
      categorias: [{ id: "2", nome: "Iluminação", descricao: "Produtos para iluminação" }],
      status: "ativo",
    },
  ]

  const produto = produtos.find((p) => p.id === id)

  if (!produto) {
    return null
  }

  return produto
}

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const produto = await getProduto(params.id)

  if (!produto) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Produto</h1>
      <ProdutoForm produto={produto} />
    </div>
  )
}
