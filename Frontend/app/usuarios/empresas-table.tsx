"use client"

import { useEffect, useMemo, useState } from "react"
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
import { type Empresa, TipoEmpresa } from "./types"
import { EmpresaModal } from "./empresa-modal"
import { api } from "@/lib/api"

export function EmpresasTable() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [filtros, setFiltros] = useState({ termo: "", tipoEmpresa: "all" })
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false)
  const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | undefined>(undefined)
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null)

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      setLoading(true)
      // Tenta endpoint padrão; se falhar, cai no /lista
      try {
        const raw = await api.get<any[]>("/api/Empresa")
        const mapped: Empresa[] = (raw || []).map((e) => ({
          id: (e.id ?? "").toString(),
          nome: e.nome,
          cnpj: e.documento,
          endereco_id: (e.enderecoId ?? "").toString(),
          tipo_empresa: e.tipoEmpresa,
          email: e.email,
          created_at: "",
          updated_at: "",
          endereco: e.endereco
            ? {
                id: (e.endereco.id ?? "").toString(),
                logradouro: e.endereco.logradouro,
                numero: e.endereco.numero,
                bairro: e.endereco.bairro,
                cidade: e.endereco.cidade,
                uf: e.endereco.uf,
              }
            : undefined,
        }))
        setEmpresas(mapped)
      } catch (err) {
        // Fallback para DTO em snake_case
        const data = await api.get<Empresa[]>("/api/Empresa/lista")
        setEmpresas(data || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const empresasFiltradas = useMemo(() => {
    return empresas.filter((empresa) => {
      const matchTermo =
        !filtros.termo ||
        empresa.nome.toLowerCase().includes(filtros.termo.toLowerCase()) ||
        (empresa.cnpj || "").includes(filtros.termo) ||
        (empresa.email || "").toLowerCase().includes(filtros.termo.toLowerCase())

      const matchTipo = filtros.tipoEmpresa === "all" || empresa.tipo_empresa === filtros.tipoEmpresa
      return matchTermo && matchTipo
    })
  }, [empresas, filtros])

  const totalPages = Math.max(1, Math.ceil(empresasFiltradas.length / itemsPerPage))
  const empresasPaginadas = useMemo(
    () => empresasFiltradas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [empresasFiltradas, currentPage]
  )

  const handleOpenEmpresaModal = (empresa?: Empresa) => {
    setCurrentEmpresa(empresa)
    setIsEmpresaModalOpen(true)
  }

  const handleSaveEmpresa = async (empresa: Empresa) => {
    try {
      const payload = {
        Id: empresa.id ? parseInt(empresa.id, 10) : undefined,
        Nome: empresa.nome,
        Cnpj: empresa.cnpj,
        EnderecoId: empresa.endereco_id ? parseInt(empresa.endereco_id, 10) : undefined,
        TipoEmpresa: empresa.tipo_empresa,
        Email: empresa.email,
      }
      if (currentEmpresa?.id) {
        await api.put(`/api/Empresa/${parseInt(currentEmpresa.id, 10)}`, payload)
      } else {
        await api.post(`/api/Empresa`, payload)
      }
      await loadEmpresas()
      setIsEmpresaModalOpen(false)
      setCurrentEmpresa(undefined)
    } catch (e) {
      console.error(e)
      alert("Falha ao salvar empresa")
    }
  }

  const handleConfirmDelete = async () => {
    if (!empresaToDelete) return
    try {
      await api.delete(`/api/Empresa/${parseInt(empresaToDelete.id, 10)}`)
      await loadEmpresas()
      setEmpresaToDelete(null)
    } catch (e) {
      console.error(e)
      alert("Falha ao excluir empresa")
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button onClick={() => handleOpenEmpresaModal()} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>

          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                value={filtros.termo}
                onChange={(e) => handleFilterChange("termo", e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-56">
              <Select value={filtros.tipoEmpresa} onValueChange={(v) => handleFilterChange("tipoEmpresa", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="representante">Representante</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">CNPJ</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Endereço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Carregando...</TableCell>
              </TableRow>
            ) : empresasPaginadas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Nenhuma empresa encontrada</TableCell>
              </TableRow>
            ) : (
              empresasPaginadas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{empresa.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{empresa.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{empresa.cnpj ? formatCNPJ(empresa.cnpj) : '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">{getTipoEmpresaText(empresa.tipo_empresa)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{empresa.email || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {empresa.endereco ? (
                      <div className="text-sm">
                        {empresa.endereco.logradouro}, {empresa.endereco.numero} - {empresa.endereco.bairro}
                        <div className="text-muted-foreground">{empresa.endereco.cidade}/{empresa.endereco.uf}</div>
                      </div>

                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEmpresaModal(empresa)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => setEmpresaToDelete(empresa)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink isActive={currentPage === idx + 1} onClick={() => setCurrentPage(idx + 1)}>
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
          </PaginationContent>
        </Pagination>
      </div>

      <EmpresaModal isOpen={isEmpresaModalOpen} onClose={() => setIsEmpresaModalOpen(false)} onSave={handleSaveEmpresa} empresa={currentEmpresa} />

      <AlertDialog open={!!empresaToDelete} onOpenChange={() => setEmpresaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir empresa</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

