"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para chamados
const chamadosIniciais = [
  {
    id: "1",
    cliente: "João Silva",
    tecnico: "Carlos Oliveira",
    dataAbertura: "15/05/2023",
    dataVisita: "18/05/2023",
    status: "concluido",
    defeito: "Refrigeração",
    valorTotal: "R$ 450,00",
  },
  {
    id: "2",
    cliente: "Empresa ABC Ltda",
    tecnico: "Ana Silva",
    dataAbertura: "22/06/2023",
    dataVisita: "25/06/2023",
    status: "em_andamento",
    defeito: "Iluminação",
    valorTotal: "R$ 320,00",
  },
  {
    id: "3",
    cliente: "Comércio XYZ",
    tecnico: "Roberto Santos",
    dataAbertura: "10/07/2023",
    dataVisita: "",
    status: "aberto",
    defeito: "Estrutura",
    valorTotal: "R$ 0,00",
  },
]

export function ChamadosTable() {
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
      chamado.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      chamado.tecnico.toLowerCase().includes(filtro.toLowerCase()) ||
      chamado.defeito.toLowerCase().includes(filtro.toLowerCase())

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Data Abertura</TableHead>
              <TableHead>Data Visita</TableHead>
              <TableHead>Defeito</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chamadosFiltrados.length > 0 ? (
              chamadosFiltrados.map((chamado) => (
                <TableRow key={chamado.id}>
                  <TableCell>{chamado.id}</TableCell>
                  <TableCell>{chamado.cliente}</TableCell>
                  <TableCell>{chamado.tecnico}</TableCell>
                  <TableCell>{chamado.dataAbertura}</TableCell>
                  <TableCell>{chamado.dataVisita || "-"}</TableCell>
                  <TableCell>{chamado.defeito}</TableCell>
                  <TableCell>{renderStatus(chamado.status)}</TableCell>
                  <TableCell>{chamado.valorTotal}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/chamados/${chamado.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/chamados/${chamado.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
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
