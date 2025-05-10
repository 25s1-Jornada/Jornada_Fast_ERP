"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search } from "lucide-react"

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

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.contato.toLowerCase().includes(filtro.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente..."
          className="pl-8"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
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
