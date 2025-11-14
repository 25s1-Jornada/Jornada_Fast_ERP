"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, RefreshCw, Filter, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

// Dados de exemplo para armários
const armariosIniciais = [
  {
    id: "1",
    nome: "Armário Principal",
    empresa: {
      id: "1",
      nome: "FAST Refrigeração Ltda",
      cnpj: "12.345.678/0001-90",
    },
  },
  {
    id: "2",
    nome: "Armário Secundário",
    empresa: {
      id: "1",
      nome: "FAST Refrigeração Ltda",
      cnpj: "12.345.678/0001-90",
    },
  },
  {
    id: "3",
    nome: "Armário Filial SP",
    empresa: {
      id: "2",
      nome: "FAST SP Ltda",
      cnpj: "98.765.432/0001-10",
    },
  },
  {
    id: "4",
    nome: "Armário Peças Pequenas",
    empresa: {
      id: "1",
      nome: "FAST Refrigeração Ltda",
      cnpj: "12.345.678/0001-90",
    },
  },
  {
    id: "5",
    nome: "Armário Ferramentas",
    empresa: {
      id: "3",
      nome: "FAST Manutenção Ltda",
      cnpj: "45.678.901/0001-23",
    },
  },
]

export function ArmariosTable() {
  const [armarios, setArmarios] = useState(armariosIniciais)
  const [filtro, setFiltro] = useState("")
  const [filtroEmpresa, setFiltroEmpresa] = useState("todos")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Lista de empresas para filtro
  const empresas = [
    { id: "1", nome: "FAST Refrigeração Ltda" },
    { id: "2", nome: "FAST SP Ltda" },
    { id: "3", nome: "FAST Manutenção Ltda" },
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
    setArmarios(armarios.filter((armario) => armario.id !== id))
  }

  const armariosFiltrados = armarios.filter((armario) => {
    // Filtro por texto (nome)
    const matchesText = filtro === "" || armario.nome.toLowerCase().includes(filtro.toLowerCase())

    // Filtro por empresa
    const matchesEmpresa = filtroEmpresa === "todos" || armario.empresa.id === filtroEmpresa

    return matchesText && matchesEmpresa
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar armário..."
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
                  <p className="text-sm font-medium">Filtrar por empresa</p>
                  <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as empresas</SelectItem>
                      {empresas.map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.nome}
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
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {armariosFiltrados.length > 0 ? (
              armariosFiltrados.map((armario) => (
                <TableRow key={armario.id}>
                  <TableCell>{armario.id}</TableCell>
                  <TableCell>{armario.nome}</TableCell>
                  <TableCell>{armario.empresa.nome}</TableCell>
                  <TableCell>{armario.empresa.cnpj ?? armario.empresa.documento ?? ""}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/estoque-geral/armarios/${armario.id}`}>
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
                            <AlertDialogTitle>Excluir armário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o armário "{armario.nome}"? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(armario.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum armário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
