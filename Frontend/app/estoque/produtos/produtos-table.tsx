"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Dados de exemplo para produtos
const produtosIniciais = [
  {
    id: "1",
    id_integracao: "INT001",
    sku: "PROD001",
    nome: "Compressor 1HP",
    descricao: "Compressor de refrigeração 1HP 220V",
    preco: "850.00",
    categorias: [
      { id: "1", nome: "Refrigeração" },
      { id: "3", nome: "Compressores" },
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
    categorias: [{ id: "2", nome: "Iluminação" }],
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
      { id: "1", nome: "Refrigeração" },
      { id: "4", nome: "Acessórios" },
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
    categorias: [{ id: "1", nome: "Refrigeração" }],
    status: "inativo",
  },
  {
    id: "5",
    id_integracao: "INT005",
    sku: "PROD005",
    nome: "Painel LED 24W",
    descricao: "Painel LED 24W de embutir 30x30cm",
    preco: "89.90",
    categorias: [{ id: "2", nome: "Iluminação" }],
    status: "ativo",
  },
]

export function ProdutosTable() {
  const [produtos, setProdutos] = useState(produtosIniciais)
  const [filtro, setFiltro] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Lista de categorias para filtro
  const categorias = [
    { id: "1", nome: "Refrigeração" },
    { id: "2", nome: "Iluminação" },
    { id: "3", nome: "Compressores" },
    { id: "4", nome: "Acessórios" },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulando uma atualização de dados
    setTimeout(() => {
      // Aqui você faria uma chamada para recarregar os dados do servidor
      setIsRefreshing(false)
    }, 1000)
  }

  const handleDelete = (id: string) => {
    setProdutos(produtos.filter((produto) => produto.id !== id))
  }

  const produtosFiltrados = produtos.filter((produto) => {
    // Filtro por texto (nome, sku ou descrição)
    const matchesText =
      filtro === "" ||
      produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      produto.sku.toLowerCase().includes(filtro.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(filtro.toLowerCase())

    // Filtro por categoria
    const matchesCategoria =
      filtroCategoria === "todos" || produto.categorias.some((categoria) => categoria.id === filtroCategoria)

    // Filtro por status
    const matchesStatus = filtroStatus === "todos" || produto.status === filtroStatus

    return matchesText && matchesCategoria && matchesStatus
  })

  // Função para formatar o preço
  const formatarPreco = (preco: string) => {
    return `R$ ${Number.parseFloat(preco).toFixed(2).replace(".", ",")}`
  }

  // Função para renderizar o status com a cor apropriada
  const renderStatus = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>
      case "inativo":
        return <Badge className="bg-gray-500">Inativo</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            className="pl-8"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Filtrar por categoria</p>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as categorias</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Filtrar por status</p>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.sku}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{formatarPreco(produto.preco)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {produto.categorias.map((categoria) => (
                        <Badge key={categoria.id} variant="outline" className="bg-blue-50">
                          {categoria.nome}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{renderStatus(produto.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/estoque/produtos/${produto.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir produto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o produto "{produto.nome}"? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(produto.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
