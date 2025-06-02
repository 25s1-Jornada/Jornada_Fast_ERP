"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Tipos para os dados do chamado
interface Cliente {
  id: string
  nome: string
}

interface Tecnico {
  id: string
  nome: string
}

interface Descricao {
  id: string
  numeroSerie: string
  defeito: string
  observacao: string
}

interface Material {
  id: string
  material: string
  quantidade: string
  valorUnitario: string
  totalValor: string
}

interface CustoServico {
  id: string
  nome: string
  deslocamento: {
    hrSaidaEmpresa: string
    hrChegadaCliente: string
    hrSaidaCliente: string
    hrChegadaEmpresa: string
    totalHoras: string
    totalValor: string
  }
  horaTrabalhada: {
    hrInicio: string
    hrTermino: string
    totalHoras: string
    totalValor: string
  }
  km: {
    km: string
    valorPorKm: string
    totalValor: string
  }
  materiais: Material[]
  subtotal: string
}

interface Chamado {
  id: string
  cliente: Cliente
  tecnico: Tecnico
  dataAbertura: string
  dataVisita: string
  status: string
  pedido: string
  dataFaturamento: string
  garantia: string
  descricoes: Descricao[]
  custosServico: CustoServico[]
  valorTotal: string
}

interface ChamadosTableProps {
  onEditarChamado: (chamado: Chamado) => void
}

// Dados de exemplo para chamados
const chamadosIniciais: Chamado[] = [
  {
    id: "1",
    cliente: { id: "1", nome: "João Silva" },
    tecnico: { id: "1", nome: "Carlos Oliveira" },
    dataAbertura: "2023-05-15",
    dataVisita: "2023-05-18",
    status: "concluido",
    pedido: "PED123",
    dataFaturamento: "15/05/2023",
    garantia: "12 meses",
    descricoes: [
      {
        id: "1",
        numeroSerie: "SN12345",
        defeito: "Refrigeração",
        observacao: "Equipamento não está refrigerando adequadamente.",
      },
    ],
    custosServico: [
      {
        id: "custo-1",
        nome: "Custo Principal",
        deslocamento: {
          hrSaidaEmpresa: "08:00",
          hrChegadaCliente: "09:30",
          hrSaidaCliente: "14:00",
          hrChegadaEmpresa: "15:30",
          totalHoras: "5.5",
          totalValor: "275.00",
        },
        horaTrabalhada: {
          hrInicio: "09:30",
          hrTermino: "14:00",
          totalHoras: "4.5",
          totalValor: "225.00",
        },
        km: {
          km: "45",
          valorPorKm: "1.50",
          totalValor: "67.50",
        },
        materiais: [],
        subtotal: "567.50",
      },
    ],
    valorTotal: "567.50",
  },
  {
    id: "2",
    cliente: { id: "2", nome: "Empresa ABC Ltda" },
    tecnico: { id: "2", nome: "Ana Silva" },
    dataAbertura: "2023-06-22",
    dataVisita: "2023-06-25",
    status: "em_andamento",
    pedido: "PED456",
    dataFaturamento: "22/06/2023",
    garantia: "24 meses",
    descricoes: [
      {
        id: "2",
        numeroSerie: "IL789",
        defeito: "Iluminação",
        observacao: "Luzes piscando intermitentemente.",
      },
    ],
    custosServico: [
      {
        id: "custo-2",
        nome: "Custo Iluminação",
        deslocamento: {
          hrSaidaEmpresa: "",
          hrChegadaCliente: "",
          hrSaidaCliente: "",
          hrChegadaEmpresa: "",
          totalHoras: "0",
          totalValor: "0",
        },
        horaTrabalhada: {
          hrInicio: "",
          hrTermino: "",
          totalHoras: "0",
          totalValor: "0",
        },
        km: {
          km: "0",
          valorPorKm: "1.50",
          totalValor: "0",
        },
        materiais: [],
        subtotal: "0",
      },
    ],
    valorTotal: "0",
  },
  {
    id: "3",
    cliente: { id: "3", nome: "Comércio XYZ" },
    tecnico: { id: "3", nome: "Roberto Santos" },
    dataAbertura: "2023-07-10",
    dataVisita: "",
    status: "aberto",
    pedido: "PED789",
    dataFaturamento: "10/07/2023",
    garantia: "6 meses",
    descricoes: [
      {
        id: "3",
        numeroSerie: "EST123",
        defeito: "Estrutura",
        observacao: "Suporte de parede com folga.",
      },
    ],
    custosServico: [
      {
        id: "custo-3",
        nome: "Custo Estrutura",
        deslocamento: {
          hrSaidaEmpresa: "",
          hrChegadaCliente: "",
          hrSaidaCliente: "",
          hrChegadaEmpresa: "",
          totalHoras: "0",
          totalValor: "0",
        },
        horaTrabalhada: {
          hrInicio: "",
          hrTermino: "",
          totalHoras: "0",
          totalValor: "0",
        },
        km: {
          km: "0",
          valorPorKm: "1.50",
          totalValor: "0",
        },
        materiais: [],
        subtotal: "0",
      },
    ],
    valorTotal: "0",
  },
]

export function ChamadosTable({ onEditarChamado }: ChamadosTableProps) {
  const [chamados, setChamados] = useState(chamadosIniciais)
  const [filtro, setFiltro] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulando uma atualização de dados
    setTimeout(() => {
      // Aqui você faria uma chamada para recarregar os dados do servidor
      setIsRefreshing(false)
    }, 1000)
  }

  const chamadosFiltrados = chamados.filter((chamado) => {
    // Filtro por texto (cliente, técnico ou defeito)
    const matchesText =
      filtro === "" ||
      chamado.cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      chamado.tecnico.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      chamado.descricoes.some((desc) => desc.defeito.toLowerCase().includes(filtro.toLowerCase()))

    // Filtro por status
    const matchesStatus = filtroStatus === "todos" || chamado.status === filtroStatus

    return matchesText && matchesStatus
  })

  // Função para renderizar o status com a cor apropriada
  const renderStatus = (status: string) => {
    switch (status) {
      case "concluido":
        return <Badge className="bg-green-500">Concluído</Badge>
      case "em_andamento":
        return <Badge className="bg-blue-500">Em Andamento</Badge>
      case "aberto":
        return <Badge className="bg-yellow-500">Aberto</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: string) => {
    const num = Number.parseFloat(value)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar chamado..."
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
                  <p className="text-sm font-medium">Filtrar por status</p>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Técnico</TableHead>
              <TableHead className="hidden md:table-cell">Data Abertura</TableHead>
              <TableHead className="hidden md:table-cell">Data Visita</TableHead>
              <TableHead className="hidden lg:table-cell">Defeito</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Valor Total</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chamadosFiltrados.length > 0 ? (
              chamadosFiltrados.map((chamado) => (
                <TableRow key={chamado.id}>
                  <TableCell>{chamado.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{chamado.cliente.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{chamado.tecnico.nome}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{chamado.tecnico.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(chamado.dataAbertura)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(chamado.dataVisita)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{chamado.descricoes[0]?.defeito || "-"}</TableCell>
                  <TableCell>{renderStatus(chamado.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatCurrency(chamado.valorTotal)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditarChamado(chamado)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Nenhum chamado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
