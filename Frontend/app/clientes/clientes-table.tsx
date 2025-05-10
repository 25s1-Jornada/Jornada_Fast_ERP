"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados de exemplo para clientes
const clientesIniciais = [
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

export function ClientesTable() {
  const [clientes, setClientes] = useState(clientesIniciais)
  const [filtro, setFiltro] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [filtroUF, setFiltroUF] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Lista de estados para filtro
  const estados = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "ES", "GO", "DF"]

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulando uma atualização de dados
    setTimeout(() => {
      // Aqui você faria uma chamada para recarregar os dados do servidor
      setIsRefreshing(false)
    }, 1000)
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    // Filtro por texto (nome, código ou contato)
    const matchesText =
      filtro === "" ||
      cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.contato.toLowerCase().includes(filtro.toLowerCase())

    // Filtro por UF
    const matchesUF = filtroUF === "" || cliente.uf === filtroUF

    // Filtro por tipo
    if (tipoFiltro === "todos") {
      return matchesText && matchesUF
    } else if (tipoFiltro === "comGarantia") {
      return matchesText && matchesUF && cliente.garantia !== ""
    } else if (tipoFiltro === "semGarantia") {
      return matchesText && matchesUF && cliente.garantia === ""
    }

    return matchesText && matchesUF
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
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
                  <p className="text-sm font-medium">Filtrar por tipo</p>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os clientes</SelectItem>
                      <SelectItem value="comGarantia">Com garantia</SelectItem>
                      <SelectItem value="semGarantia">Sem garantia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Filtrar por UF</p>
                  <Select value={filtroUF} onValueChange={setFiltroUF}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cód. Cliente</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>UF</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.codigo}</TableCell>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.contato}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.cidade}</TableCell>
                  <TableCell>{cliente.uf}</TableCell>
                  <TableCell>
                    <Link href={`/clientes/${cliente.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
