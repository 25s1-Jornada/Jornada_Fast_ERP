"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"
import { api } from "@/lib/api"

type Produto = {
  id?: number
  idIntegracao?: number
  sku?: string
  nome: string
  descricao?: string
  preco?: number
  categoriaId?: number
  status: boolean
}

export function ProdutosTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await api.get<Produto[]>("/api/Produto")
        setProdutos(data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredProdutos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return produtos
    return produtos.filter((p) =>
      (p.nome || "").toLowerCase().includes(term) ||
      (p.sku || "").toLowerCase().includes(term) ||
      String(p.categoriaId ?? "").toLowerCase().includes(term)
    )
  }, [produtos, searchTerm])

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
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredProdutos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProdutos.map((produto) => (
                <TableRow key={produto.id}
                >
                  <TableCell>{produto.sku || '-'}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoriaId ?? '-'}</TableCell>
                  <TableCell>{typeof produto.preco === 'number' ? `R$ ${produto.preco.toFixed(2)}` : '-'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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

