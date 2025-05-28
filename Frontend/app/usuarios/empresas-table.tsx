"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { type Empresa, TipoEmpresa, empresasMock } from "./types"
import { EmpresaModal } from "./empresa-modal"

export function EmpresasTable() {
  // Estado para armazenar as empresas
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasMock)

  // Estado para controlar a paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Estado para controlar os filtros
  const [filtros, setFiltros] = useState({
    termo: "",
    tipoEmpresa: "",
  })

  // Estado para controlar os modais
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false)
  const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | undefined>(undefined)
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null)

  // Filtra as empresas com base nos filtros
  const empresasFiltradas = empresas.filter((empresa) => {
    const matchTermo =
      filtros.termo === "" ||
      empresa.nome.toLowerCase().includes(filtros.termo.toLowerCase()) ||
      empresa.cnpj.includes(filtros.termo) ||
      empresa.email.toLowerCase().includes(filtros.termo.toLowerCase())

    const matchTipo = filtros.tipoEmpresa === "" || empresa.tipo_empresa === filtros.tipoEmpresa

    return matchTermo && matchTipo
  })

  // Calcula o total de páginas
  const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage)

  // Obtém as empresas da página atual
  const empresasPaginadas = empresasFiltradas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Função para abrir o modal de empresa
  const handleOpenEmpresaModal = (empresa?: Empresa) => {
    setCurrentEmpresa(empresa)
    setIsEmpresaModalOpen(true)
  }

  // Função para salvar uma empresa
  const handleSaveEmpresa = (empresa: Empresa) => {
    if (currentEmpresa) {
      // Atualiza a empresa existente
      setEmpresas(empresas.map((e) => (e.id === empresa.id ? empresa : e)))
    } else {
      // Adiciona a nova empresa
      setEmpresas([...empresas, empresa])
    }
  }

  // Função para confirmar a exclusão de uma empresa
  const handleConfirmDelete = () => {
    if (empresaToDelete) {
      setEmpresas(empresas.filter((e) => e.id !== empresaToDelete.id))
      setEmpresaToDelete(null)
    }
  }

  // Função para atualizar os filtros
  const handleFilterChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Volta para a primeira página ao filtrar
  }

  // Função para formatar o CNPJ
  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  // Função para obter o texto do tipo de empresa
  const getTipoEmpresaText = (tipo: TipoEmpresa) => {
    const tipos = {
      [TipoEmpresa.ADMIN]: "Administrador",
      [TipoEmpresa.REPRESENTANTE]: "Representante",
      [TipoEmpresa.TECNICO]: "Técnico",
      [TipoEmpresa.CLIENTE]: "Cliente",
    }
    return tipos[tipo]
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com botão de adicionar e filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button onClick={() => handleOpenEmpresaModal()} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar empresa..."
                className="pl-8 w-full"
                value={filtros.termo}
                onChange={(e) => handleFilterChange("termo", e.target.value)}
              />
            </div>

            <Select value={filtros.tipoEmpresa} onValueChange={(value) => handleFilterChange("tipoEmpresa", value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value={TipoEmpresa.ADMIN}>Administrador</SelectItem>
                <SelectItem value={TipoEmpresa.REPRESENTANTE}>Representante</SelectItem>
                <SelectItem value={TipoEmpresa.TECNICO}>Técnico</SelectItem>
                <SelectItem value={TipoEmpresa.CLIENTE}>Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela de empresas */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Nome</TableHead>
                <TableHead className="min-w-[120px]">CNPJ</TableHead>
                <TableHead className="min-w-[100px]">Tipo</TableHead>
                <TableHead className="min-w-[200px] hidden sm:table-cell">Email</TableHead>
                <TableHead className="min-w-[150px] hidden md:table-cell">Endereço</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresasPaginadas.length > 0 ? (
                empresasPaginadas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{empresa.nome}</div>
                        <div className="text-sm text-gray-500 sm:hidden">{empresa.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCNPJ(empresa.cnpj)}</TableCell>
                    <TableCell>
                      <span className="text-xs sm:text-sm">{getTipoEmpresaText(empresa.tipo_empresa)}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{empresa.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {empresa.endereco ? `${empresa.endereco.cidade}/${empresa.endereco.uf}` : "Não definido"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEmpresaModal(empresa)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmpresaToDelete(empresa)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma empresa encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal de Empresa */}
      <EmpresaModal
        isOpen={isEmpresaModalOpen}
        onClose={() => setIsEmpresaModalOpen(false)}
        onSave={handleSaveEmpresa}
        empresa={currentEmpresa}
      />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={!!empresaToDelete} onOpenChange={() => setEmpresaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a empresa "{empresaToDelete?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
