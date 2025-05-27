"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"

// Dados de exemplo
const produtos = [
  {
    id: "1",
    nome: "Placa Mãe ASUS",
    codigo: "PM001",
    categoria: "Informática",
    preco: "450,00",
    unidade: "UN",
    estoque: 15,
  },
  {
    id: "2",
    nome: "Memória RAM 8GB",
    codigo: "MR002",
    categoria: "Informática",
    preco: "220,00",
    unidade: "UN",
    estoque: 32,
  },
  {
    id: "3",
    nome: "SSD 240GB",
    codigo: "SSD003",
    categoria: "Informática",
    preco: "180,00",
    unidade: "UN",
    estoque: 28,
  },
  {
    id: "4",
    nome: "Fonte ATX 500W",
    codigo: "FT004",
    categoria: "Informática",
    preco: "280,00",
    unidade: "UN",
    estoque: 12,
  },
  {
    id: "5",
    nome: "Cabo HDMI 2m",
    codigo: "CB005",
    categoria: "Eletrônicos",
    preco: "35,00",
    unidade: "UN",
    estoque: 50,
  },
]

export function ProdutosTable() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtra os produtos com base no termo de busca
  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>R$ {produto.preco}</TableCell>
                  <TableCell>{produto.estoque}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/estoque-geral/produtos/${produto.id}`}>Ver detalhes</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
