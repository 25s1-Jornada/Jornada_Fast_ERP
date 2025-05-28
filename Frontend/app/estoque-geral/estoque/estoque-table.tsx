"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter, Trash2, Plus, History } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Tipos para os dados do estoque
interface Produto {
  id: string
  nome: string
  sku: string
}

interface Armario {
  id: string
  nome: string
}

interface Usuario {
  id: string
  nome: string
}

interface MovimentacaoEstoque {
  id: string
  produto_id: string
  tipo: "ENTRADA" | "SAIDA"
  quantidade: number
  armario_id: string
  data_movimentacao: string
  observacao: string
  usuario_id: string
  produto?: Produto
  armario?: Armario
  usuario?: Usuario
}

interface ItemEstoque {
  id: string
  armario_id: string
  produto_id: string
  quantidade: number
  ultima_movimentacao: MovimentacaoEstoque
  armario?: Armario
  produto?: Produto
}

// Dados de exemplo para estoque
const estoqueInicial: ItemEstoque[] = [
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

// Dados de exemplo para produtos e armários
const produtosDisponiveis: Produto[] = [
  { id: "1", nome: "Compressor 1HP", sku: "PROD001" },
  { id: "2", nome: "Lâmpada LED 15W", sku: "PROD002" },
  { id: "3", nome: "Suporte para Ar Condicionado", sku: "PROD003" },
  { id: "4", nome: "Gás Refrigerante R410A", sku: "PROD004" },
  { id: "5", nome: "Painel LED 24W", sku: "PROD005" },
]

const armariosDisponiveis: Armario[] = [
  { id: "1", nome: "Armário Principal" },
  { id: "2", nome: "Armário Secundário" },
  { id: "3", nome: "Armário Filial SP" },
  { id: "4", nome: "Armário Peças Pequenas" },
  { id: "5", nome: "Armário Ferramentas" },
]

const usuariosDisponiveis: Usuario[] = [
  { id: "1", nome: "Admin" },
  { id: "2", nome: "Técnico" },
  { id: "3", nome: "Vendedor" },
]

export function EstoqueTable() {
  const [estoque, setEstoque] = useState<ItemEstoque[]>(estoqueInicial)
  const [filtro, setFiltro] = useState("")
  const [filtroArmario, setFiltroArmario] = useState("todos")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Estados para o modal de movimentação
  const [modalMovimentacaoAberto, setModalMovimentacaoAberto] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<ItemEstoque | null>(null)
  const [novaMovimentacao, setNovaMovimentacao] = useState<{
    tipo: "ENTRADA" | "SAIDA"
    quantidade: number
    observacao: string
  }>({
    tipo: "ENTRADA",
    quantidade: 1,
    observacao: "",
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulando uma atualização de dados
    setTimeout(() => {
      // Aqui você faria uma chamada para recarregar os dados do servidor
      setIsRefreshing(false)
    }, 1000)
  }

  const handleDelete = (id: string) => {
    setEstoque(estoque.filter((item) => item.id !== id))
  }

  const handleAbrirModalMovimentacao = (item: ItemEstoque) => {
    setItemSelecionado(item)
    setNovaMovimentacao({
      tipo: "ENTRADA",
      quantidade: 1,
      observacao: "",
    })
    setModalMovimentacaoAberto(true)
  }

  const handleRegistrarMovimentacao = () => {
    if (!itemSelecionado) return

    // Criar nova movimentação
    const novaMovimentacaoCompleta: MovimentacaoEstoque = {
      id: `mov-${Date.now()}`,
      produto_id: itemSelecionado.produto_id,
      tipo: novaMovimentacao.tipo,
      quantidade: novaMovimentacao.quantidade,
      armario_id: itemSelecionado.armario_id,
      data_movimentacao: new Date().toISOString(),
      observacao: novaMovimentacao.observacao,
      usuario_id: "1", // Usuário logado (simulado)
      produto: itemSelecionado.produto,
      armario: itemSelecionado.armario,
      usuario: { id: "1", nome: "Admin" }, // Usuário logado (simulado)
    }

    // Atualizar quantidade do item
    const novaQuantidade =
      novaMovimentacao.tipo === "ENTRADA"
        ? itemSelecionado.quantidade + novaMovimentacao.quantidade
        : Math.max(0, itemSelecionado.quantidade - novaMovimentacao.quantidade)

    // Atualizar o estoque
    setEstoque(
      estoque.map((item) =>
        item.id === itemSelecionado.id
          ? {
              ...item,
              quantidade: novaQuantidade,
              ultima_movimentacao: novaMovimentacaoCompleta,
            }
          : item,
      ),
    )

    // Fechar o modal
    setModalMovimentacaoAberto(false)
    setItemSelecionado(null)
  }

  const estoqueFiltrado = estoque.filter((item) => {
    // Filtro por texto (nome do produto ou SKU)
    const matchesText =
      filtro === "" ||
      (item.produto?.nome.toLowerCase().includes(filtro.toLowerCase()) ?? false) ||
      (item.produto?.sku.toLowerCase().includes(filtro.toLowerCase()) ?? false)

    // Filtro por armário
    const matchesArmario = filtroArmario === "todos" || item.armario_id === filtroArmario

    return matchesText && matchesArmario
  })

  // Formatar data
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    return (
      data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )
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
                  <p className="text-sm font-medium">Filtrar por armário</p>
                  <Select value={filtroArmario} onValueChange={setFiltroArmario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o armário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os armários</SelectItem>
                      {armariosDisponiveis.map((armario) => (
                        <SelectItem key={armario.id} value={armario.id}>
                          {armario.nome}
                        </SelectItem>
                      ))}
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

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Produto</TableHead>
                <TableHead className="min-w-[100px] hidden sm:table-cell">SKU</TableHead>
                <TableHead className="min-w-[120px]">Armário</TableHead>
                <TableHead className="min-w-[80px]">Qtd</TableHead>
                <TableHead className="min-w-[180px] hidden md:table-cell">Última Movimentação</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estoqueFiltrado.length > 0 ? (
                estoqueFiltrado.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.produto?.nome}</div>
                        <div className="text-sm text-gray-500 sm:hidden">{item.produto?.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{item.produto?.sku}</TableCell>
                    <TableCell>{item.armario?.nome}</TableCell>
                    <TableCell className="font-medium">{item.quantidade}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm">{formatarData(item.ultima_movimentacao.data_movimentacao)}</span>
                        <Badge
                          className={item.ultima_movimentacao.tipo === "ENTRADA" ? "bg-green-500" : "bg-amber-500"}
                        >
                          {item.ultima_movimentacao.tipo === "ENTRADA" ? "Entrada" : "Saída"} de{" "}
                          {item.ultima_movimentacao.quantidade} un.
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAbrirModalMovimentacao(item)}
                          title="Registrar movimentação"
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Link href={`/estoque-geral/estoque/${item.id}`}>
                          <Button variant="ghost" size="icon" title="Editar" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/estoque-geral/movimentacoes?produto=${item.produto_id}&armario=${item.armario_id}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Ver histórico"
                            className="h-8 w-8 hidden sm:inline-flex"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Excluir" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir item de estoque</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este item de estoque? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>Excluir</AlertDialogAction>
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
                    Nenhum item de estoque encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal para registrar movimentação */}
      <Dialog open={modalMovimentacaoAberto} onOpenChange={setModalMovimentacaoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimentação</DialogTitle>
            <DialogDescription>
              {itemSelecionado?.produto?.nome} - {itemSelecionado?.armario?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-movimentacao">Tipo de Movimentação</Label>
              <Select
                value={novaMovimentacao.tipo}
                onValueChange={(valor: "ENTRADA" | "SAIDA") =>
                  setNovaMovimentacao({ ...novaMovimentacao, tipo: valor })
                }
              >
                <SelectTrigger id="tipo-movimentacao">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade-movimentacao">Quantidade</Label>
              <Input
                id="quantidade-movimentacao"
                type="number"
                min="1"
                value={novaMovimentacao.quantidade}
                onChange={(e) =>
                  setNovaMovimentacao({ ...novaMovimentacao, quantidade: Number.parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacao-movimentacao">Observação</Label>
              <Textarea
                id="observacao-movimentacao"
                value={novaMovimentacao.observacao}
                onChange={(e) => setNovaMovimentacao({ ...novaMovimentacao, observacao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalMovimentacaoAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegistrarMovimentacao}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
