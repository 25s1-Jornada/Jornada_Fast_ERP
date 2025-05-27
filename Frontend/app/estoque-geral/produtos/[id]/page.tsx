import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dados de exemplo
const produtos = [
  {
    id: "1",
    nome: "Placa Mãe ASUS",
    codigo: "PM001",
    categoria: "Informática",
    preco: "450,00",
    unidade: "UN",
    estoque: 15,
    descricao: "Placa-mãe ASUS para processadores Intel, socket LGA 1200, com suporte a memória DDR4.",
  },
  {
    id: "2",
    nome: "Memória RAM 8GB",
    codigo: "MR002",
    categoria: "Informática",
    preco: "220,00",
    unidade: "UN",
    estoque: 32,
    descricao: "Memória RAM DDR4 de 8GB, frequência de 2666MHz.",
  },
  {
    id: "3",
    nome: "SSD 240GB",
    codigo: "SSD003",
    categoria: "Informática",
    preco: "180,00",
    unidade: "UN",
    estoque: 28,
    descricao: "SSD SATA de 240GB, velocidade de leitura de até 500MB/s.",
  },
  {
    id: "4",
    nome: "Fonte ATX 500W",
    codigo: "FT004",
    categoria: "Informática",
    preco: "280,00",
    unidade: "UN",
    estoque: 12,
    descricao: "Fonte de alimentação ATX com potência de 500W, certificação 80 Plus.",
  },
  {
    id: "5",
    nome: "Cabo HDMI 2m",
    codigo: "CB005",
    categoria: "Eletrônicos",
    preco: "35,00",
    unidade: "UN",
    estoque: 50,
    descricao: "Cabo HDMI 2.0 com 2 metros de comprimento, suporta resolução 4K.",
  },
]

export default function ProdutoDetalhesPage({ params }: { params: { id: string } }) {
  const produto = produtos.find((p) => p.id === params.id)

  if (!produto) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Produto não encontrado</h1>
        <Link href="/estoque-geral/produtos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalhes do Produto</h1>
        <div className="flex gap-4">
          <Link href="/estoque-geral/produtos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Link href={`/estoque-geral/produtos/${params.id}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Detalhes principais do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
              <p>{produto.nome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Código</h3>
              <p>{produto.codigo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Categoria</h3>
              <p>{produto.categoria}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
              <p>{produto.descricao || "Sem descrição"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Comerciais</CardTitle>
            <CardDescription>Detalhes de preço e estoque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Preço</h3>
              <p>R$ {produto.preco}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Unidade</h3>
              <p>{produto.unidade}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Estoque Atual</h3>
              <p>
                {produto.estoque} {produto.unidade}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
