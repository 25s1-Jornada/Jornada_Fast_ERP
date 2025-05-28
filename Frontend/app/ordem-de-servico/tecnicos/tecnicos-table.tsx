"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Tecnico {
  id: string
  nome: string
  empresa: string
  telefone: string
  email: string
  cidade: string
  uf: string
}

interface TecnicosTableProps {
  onEditarTecnico: (tecnico: Tecnico) => void
}

// Dados de exemplo para técnicos
const tecnicosIniciais = [
  {
    id: "1",
    nome: "Carlos Oliveira",
    empresa: "TechSupport Ltda",
    telefone: "(11) 98765-4321",
    email: "carlos@techsupport.com",
    cidade: "São Paulo",
    uf: "SP",
  },
  {
    id: "2",
    nome: "Ana Silva",
    empresa: "Manutenção Express",
    telefone: "(21) 97654-3210",
    email: "ana@manutencaoexpress.com",
    cidade: "Rio de Janeiro",
    uf: "RJ",
  },
  {
    id: "3",
    nome: "Roberto Santos",
    empresa: "Fix IT Soluções",
    telefone: "(31) 96543-2109",
    email: "roberto@fixit.com",
    cidade: "Belo Horizonte",
    uf: "MG",
  },
]

export function TecnicosTable({ onEditarTecnico }: TecnicosTableProps) {
  const [tecnicos, setTecnicos] = useState(tecnicosIniciais)
  const [filtro, setFiltro] = useState("")
  const [filtroUF, setFiltroUF] = useState("todos")
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

  const tecnicosFiltrados = tecnicos.filter((tecnico) => {
    // Filtro por texto (nome, empresa ou email)
    const matchesText =
      filtro === "" ||
      tecnico.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      tecnico.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
      tecnico.email.toLowerCase().includes(filtro.toLowerCase())

    // Filtro por UF
    const matchesUF = filtroUF === "todos" || tecnico.uf === filtroUF

    return matchesText && matchesUF
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar técnico..."
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
                  <p className="text-sm font-medium">Filtrar por UF</p>
                  <Select value={filtroUF} onValueChange={setFiltroUF}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Técnico</TableHead>
              <TableHead className="hidden sm:table-cell">Empresa</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">E-mail</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="hidden lg:table-cell">UF</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tecnicosFiltrados.length > 0 ? (
              tecnicosFiltrados.map((tecnico) => (
                <TableRow key={tecnico.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tecnico.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{tecnico.empresa}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{tecnico.empresa}</TableCell>
                  <TableCell className="hidden md:table-cell">{tecnico.telefone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tecnico.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tecnico.cidade}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tecnico.uf}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onEditarTecnico(tecnico)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum técnico encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
