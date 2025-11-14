"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Filter, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Tipos para os dados de movimentação
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

// Dados de exemplo para movimentações
const movimentacoesIniciais: MovimentacaoEstoque[] = [
  {
    id: "1",
    produto_id: "1",
    tipo: "ENTRADA",
    quantidade: 5,
    armario_id: "1",
    data_movimentacao: "2023-05-15T10:30:00",
    observacao: "Recebimento de fornecedor",
    usuario_id: "1",
    produto: { id: "1", nome: "Compressor 1HP", sku: "PROD001" },
    armario: { id: "1", nome: "Armário Principal" },
    usuario: { id: "1", nome: "Admin" },
  },
  {
    id: "2",
    produto_id: "2",
    tipo: "ENTRADA",
    quantidade: 10,
    armario_id: "1",
    data_movimentacao: "2023-05-16T14:20:00",
    observacao: "Compra mensal",
    usuario_id: "1",
    produto: { id: "2", nome: "Lâmpada LED 15W", sku: "PROD002" },
    armario: { id: "1", nome: "Armário Principal" },
    usuario: { id: "1", nome: "Admin" },
  },
  {
    id: "3",
    produto_id: "3",
    tipo: "SAIDA",
    quantidade: 2,
    armario_id: "2",
    data_movimentacao: "2023-05-17T09:15:00",
    observacao: "Utilizado em chamado #123",
    usuario_id: "2",
    produto: { id: "3", nome: "Suporte para Ar Condicionado", sku: "PROD003" },
    armario: { id: "2", nome: "Armário Secundário" },
    usuario: { id: "2", nome: "Técnico" },
  },
  {
    id: "4",
    produto_id: "4",
    tipo: "ENTRADA",
    quantidade: 5,
    armario_id: "3",
    data_movimentacao: "2023-05-18T11:45:00",
    observacao: "Transferência entre filiais",
    usuario_id: "1",
    produto: { id: "4", nome: "Gás Refrigerante R410A", sku: "PROD004" },
    armario: { id: "3", nome: "Armário Filial SP" },
    usuario: { id: "1", nome: "Admin" },
  },
  {
    id: "5",
    produto_id: "5",
    tipo: "SAIDA",
    quantidade: 5,
    armario_id: "4",
    data_movimentacao: "2023-05-19T16:30:00",
    observacao: "Venda para cliente",
    usuario_id: "3",
    produto: { id: "5", nome: "Painel LED 24W", sku: "PROD005" },
    armario: { id: "4", nome: "Armário Peças Pequenas" },
    usuario: { id: "3", nome: "Vendedor" },
  },
  {
    id: "6",
    produto_id: "1",
    tipo: "SAIDA",
    quantidade: 2,
    armario_id: "1",
    data_movimentacao: "2023-05-20T08:45:00",
    observacao: "Utilizado em manutenção",
    usuario_id: "2",
    produto: { id: "1", nome: "Compressor 1HP", sku: "PROD001" },
    armario: { id: "1", nome: "Armário Principal" },
    usuario: { id: "2", nome: "Técnico" },
  },
  {
    id: "7",
    produto_id: "2",
    tipo: "ENTRADA",
    quantidade: 15,
    armario_id: "1",
    data_movimentacao: "2023-05-21T13:10:00",
    observacao: "Reposição de estoque",
    usuario_id: "1",
    produto: { id: "2", nome: "Lâmpada LED 15W", sku: "PROD002" },
    armario: { id: "1", nome: "Armário Principal" },
    usuario: { id: "1", nome: "Admin" },
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

export function MovimentacoesTable() {
  const searchParams = useSearchParams()
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>(movimentacoesIniciais)
  const [filtro, setFiltro] = useState("")
  const [filtroProduto, setFiltroProduto] = useState("todos")
  const [filtroArmario, setFiltroArmario] = useState("todos")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [movimentacaoDetalhes, setMovimentacaoDetalhes] = useState<MovimentacaoEstoque | null>(null)

  // Aplicar filtros da URL
  useEffect(() => {
    const produtoParam = searchParams.get("produto")
    const armarioParam = searchParams.get("armario")

    if (produtoParam) {
      setFiltroProduto(produtoParam)
    }

    if (armarioParam) {
      setFiltroArmario(armarioParam)
    }
  }, [searchParams])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulando uma atualização de dados
    setTimeout(() => {
      // Aqui você faria uma chamada para recarregar os dados do servidor
      setIsRefreshing(false)
    }, 1000)
  }

  const handleVerDetalhes = (movimentacao: MovimentacaoEstoque) => {
    setMovimentacaoDetalhes(movimentacao)
  }

  const movimentacoesFiltradas = movimentacoes.filter((movimentacao) => {
    // Filtro por texto (observação)
    const matchesText = filtro === "" || movimentacao.observacao.toLowerCase().includes(filtro.toLowerCase())

    // Filtro por produto
    const matchesProduto = filtroProduto === "todos" || movimentacao.produto_id === filtroProduto

    // Filtro por armário
    const matchesArmario = filtroArmario === "todos" || movimentacao.armario_id === filtroArmario

    // Filtro por tipo
    const matchesTipo = filtroTipo === "todos" || movimentacao.tipo === filtroTipo

    return matchesText && matchesProduto && matchesArmario && matchesTipo
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
            placeholder="Buscar por observação..."
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
              <div className="p-2 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Filtrar por produto</p>
                  <Select value={filtroProduto} onValueChange={setFiltroProduto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os produtos</SelectItem>
                      {produtosDisponiveis.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

                <div className="space-y-2">
                  <p className="text-sm font-medium">Filtrar por tipo</p>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="ENTRADA">Entrada</SelectItem>
                      <SelectItem value="SAIDA">Saída</SelectItem>
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
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Armário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentacoesFiltradas.length > 0 ? (
              movimentacoesFiltradas.map((movimentacao) => (
                <TableRow key={movimentacao.id}>
                  <TableCell>{formatarData(movimentacao.data_movimentacao)}</TableCell>
                  <TableCell>
                    {movimentacao.produto?.nome}
                    <div className="text-xs text-muted-foreground">{movimentacao.produto?.sku}</div>
                  </TableCell>
                  <TableCell>{movimentacao.armario?.nome}</TableCell>
                  <TableCell>
                    <Badge className={movimentacao.tipo === "ENTRADA" ? "bg-green-500" : "bg-amber-500"}>
                      {movimentacao.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                    </Badge>
                  </TableCell>
                  <TableCell>{movimentacao.quantidade}</TableCell>
                  <TableCell>{movimentacao.usuario?.nome}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerDetalhes(movimentacao)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes da Movimentação</DialogTitle>
                          <DialogDescription>{formatarData(movimentacao.data_movimentacao)}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Produto:</p>
                              <p>
                                {movimentacao.produto?.nome} ({movimentacao.produto?.sku})
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Armário:</p>
                              <p>{movimentacao.armario?.nome}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Tipo:</p>
                              <Badge className={movimentacao.tipo === "ENTRADA" ? "bg-green-500" : "bg-amber-500"}>
                                {movimentacao.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Quantidade:</p>
                              <p>{movimentacao.quantidade}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Usuário:</p>
                              <p>{movimentacao.usuario?.nome}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Observação:</p>
                            <p>{movimentacao.observacao || "Nenhuma observação registrada"}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhuma movimentação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
