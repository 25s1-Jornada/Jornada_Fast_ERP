"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, RefreshCw } from "lucide-react"
import type { Usuario, PerfilUsuario } from "./types"

// Dados mockados de usuários
const usuariosMock: Usuario[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@fastcom.com.br",
    documento: "123.456.789-00",
    perfil: "admin" as PerfilUsuario,
    empresaId: "1",
    ativo: true,
    dataCriacao: "2024-01-15",
    endereco: {
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01234-567",
    },
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@techservice.com.br",
    documento: "987.654.321-00",
    perfil: "tecnico" as PerfilUsuario,
    empresaId: "2",
    ativo: true,
    dataCriacao: "2024-01-20",
    endereco: {
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01310-100",
    },
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    email: "carlos@assistenciabc.com.br",
    perfil: "tecnico" as PerfilUsuario,
    empresaId: "3",
    ativo: true,
    dataCriacao: "2024-02-01",
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana.costa@clientexyz.com.br",
    documento: "456.789.123-00",
    perfil: "cliente" as PerfilUsuario,
    empresaId: "4",
    ativo: false,
    dataCriacao: "2024-02-10",
  },
  {
    id: "5",
    nome: "Roberto Lima",
    email: "roberto@refrigeracaototal.com.br",
    perfil: "tecnico" as PerfilUsuario,
    empresaId: "5",
    ativo: true,
    dataCriacao: "2024-02-15",
  },
]

// Dados das empresas para exibição
const empresasMap = {
  "1": { nome: "Fast Com Tecnologia", tipo: "Administradora" },
  "2": { nome: "TechService Ltda", tipo: "Representante" },
  "3": { nome: "Assistência Técnica ABC", tipo: "Técnico" },
  "4": { nome: "Cliente Empresa XYZ", tipo: "Cliente" },
  "5": { nome: "Refrigeração Total", tipo: "Técnico" },
}

interface UsuariosTableProps {
  onEditarUsuario: (usuario: Usuario) => void
  onExcluirUsuario: (id: string) => void
  usuarios: Usuario[]
  setUsuarios: (usuarios: Usuario[]) => void
}

export function UsuariosTable({ onEditarUsuario, onExcluirUsuario, usuarios, setUsuarios }: UsuariosTableProps) {
  useEffect(() => {
    if (usuarios.length === 0) {
      setUsuarios(usuariosMock)
    }
  }, [])

  const [busca, setBusca] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Filtrar usuários baseado na busca
  const usuariosFiltrados = useMemo(() => {
    if (!busca.trim()) return usuarios

    const termoBusca = busca.toLowerCase()
    return usuarios.filter((usuario) => {
      const empresa = empresasMap[usuario.empresaId as keyof typeof empresasMap]
      return (
        usuario.nome.toLowerCase().includes(termoBusca) ||
        usuario.email.toLowerCase().includes(termoBusca) ||
        empresa?.nome.toLowerCase().includes(termoBusca) ||
        usuario.documento?.toLowerCase().includes(termoBusca)
      )
    })
  }, [usuarios, busca])

  const getPerfilBadge = (perfil: PerfilUsuario) => {
    const configs = {
      admin: { label: "Admin", variant: "destructive" as const },
      tecnico: { label: "Técnico", variant: "default" as const },
      cliente: { label: "Cliente", variant: "secondary" as const },
    }

    const config = configs[perfil]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusBadge = (ativo: boolean) => {
    return <Badge variant={ativo ? "default" : "secondary"}>{ativo ? "Ativo" : "Inativo"}</Badge>
  }

  return (
    <div className="space-y-4">
      {/* Barra de busca e ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        {usuariosFiltrados.length} usuário{usuariosFiltrados.length !== 1 ? "s" : ""} encontrado
        {usuariosFiltrados.length !== 1 ? "s" : ""}
      </div>

      {/* Tabela */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Perfil</TableHead>
              <TableHead className="hidden lg:table-cell">Empresa</TableHead>
              <TableHead className="hidden lg:table-cell">Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => {
                const empresa = empresasMap[usuario.empresaId as keyof typeof empresasMap]
                return (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{usuario.nome}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">{usuario.email}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{getPerfilBadge(usuario.perfil)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{usuario.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{getPerfilBadge(usuario.perfil)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {empresa && (
                        <div>
                          <div className="font-medium">{empresa.nome}</div>
                          <div className="text-sm text-muted-foreground">{empresa.tipo}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {usuario.endereco ? (
                        <div className="text-sm">
                          <div>
                            {usuario.endereco.cidade}/{usuario.endereco.uf}
                          </div>
                          <div className="text-muted-foreground">{usuario.endereco.bairro}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(usuario.ativo)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEditarUsuario(usuario)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => usuario.id && onExcluirUsuario(usuario.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
