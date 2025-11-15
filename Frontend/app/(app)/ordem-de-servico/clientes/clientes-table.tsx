"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface Cliente {
  id: string
  nome: string
  contato: string
  telefone: string
  email: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cnpj: string
}

interface ClientesTableProps {
  onEditarCliente: (cliente: Cliente) => void
  clientes: Cliente[]
}

export function ClientesTable({ onEditarCliente, clientes }: ClientesTableProps) {
  const clientesFiltrados = useMemo(() => clientes, [clientes])

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Contato</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="hidden lg:table-cell">UF</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.cnpj}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{cliente.contato}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{cliente.contato}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.telefone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{cliente.cidade}</TableCell>
                  <TableCell className="hidden lg:table-cell">{cliente.uf}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onEditarCliente(cliente)}>
                      <Edit className="h-4 w-4" />
                    </Button>
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

