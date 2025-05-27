import { ProdutoForm } from "../../produto-form"

// Dados de exemplo
const produtos = [
  {
    id: "1",
    nome: "Placa Mãe ASUS",
    codigo: "PM001",
    categoria: "informatica",
    preco: "450,00",
    unidade: "un",
    descricao: "Placa-mãe ASUS para processadores Intel, socket LGA 1200, com suporte a memória DDR4.",
  },
  {
    id: "2",
    nome: "Memória RAM 8GB",
    codigo: "MR002",
    categoria: "informatica",
    preco: "220,00",
    unidade: "un",
    descricao: "Memória RAM DDR4 de 8GB, frequência de 2666MHz.",
  },
  {
    id: "3",
    nome: "SSD 240GB",
    codigo: "SSD003",
    categoria: "informatica",
    preco: "180,00",
    unidade: "un",
    descricao: "SSD SATA de 240GB, velocidade de leitura de até 500MB/s.",
  },
  {
    id: "4",
    nome: "Fonte ATX 500W",
    codigo: "FT004",
    categoria: "informatica",
    preco: "280,00",
    unidade: "un",
    descricao: "Fonte de alimentação ATX com potência de 500W, certificação 80 Plus.",
  },
  {
    id: "5",
    nome: "Cabo HDMI 2m",
    codigo: "CB005",
    categoria: "eletronicos",
    preco: "35,00",
    unidade: "un",
    descricao: "Cabo HDMI 2.0 com 2 metros de comprimento, suporta resolução 4K.",
  },
]

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  const produto = produtos.find((p) => p.id === params.id)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Produto</h1>
      <ProdutoForm produto={produto} />
    </div>
  )
}
