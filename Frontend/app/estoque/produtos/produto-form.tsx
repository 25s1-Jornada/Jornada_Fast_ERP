"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Tipos para os dados do produto
interface Categoria {
  id: string
  nome: string
  descricao: string
}

interface Produto {
  id?: string
  id_integracao: string
  sku: string
  nome: string
  descricao: string
  preco: string
  categorias: Categoria[]
  status: string
}

interface ProdutoFormProps {
  produto?: Produto
}

// Dados de exemplo para categorias disponíveis
const categoriasDisponiveis: Categoria[] = [
  { id: "1", nome: "Refrigeração", descricao: "Produtos para refrigeração" },
  { id: "2", nome: "Iluminação", descricao: "Produtos para iluminação" },
  { id: "3", nome: "Compressores", descricao: "Compressores para diversos usos" },
  { id: "4", nome: "Acessórios", descricao: "Acessórios diversos" },
  { id: "5", nome: "Ferramentas", descricao: "Ferramentas para manutenção" },
  { id: "6", nome: "Elétrica", descricao: "Materiais elétricos" },
]

export function ProdutoForm({ produto }: ProdutoFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Produto>(
    produto || {
      id_integracao: "",
      sku: "",
      nome: "",
      descricao: "",
      preco: "",
      categorias: [],
      status: "ativo",
    },
  )

  // Estado para o modal de categoria
  const [modalAberto, setModalAberto] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState<Categoria>({
    id: "",
    nome: "",
    descricao: "",
  })
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, "")

    // Garantir que só haja um ponto decimal
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }

    setFormData((prev) => ({ ...prev, preco: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  // Funções para manipular categorias
  const adicionarCategoria = () => {
    // Verificar se a categoria já existe no produto
    if (formData.categorias.some((cat) => cat.id === categoriaSelecionada)) {
      return
    }

    const categoriaSelecionadaObj = categoriasDisponiveis.find((cat) => cat.id === categoriaSelecionada)
    if (categoriaSelecionadaObj) {
      setFormData((prev) => ({
        ...prev,
        categorias: [...prev.categorias, categoriaSelecionadaObj],
      }))
      setCategoriaSelecionada("")
    }
  }

  const removerCategoria = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.filter((cat) => cat.id !== id),
    }))
  }

  // Funções para o modal de nova categoria
  const handleNovaCategoriaNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaCategoria((prev) => ({ ...prev, nome: e.target.value }))
  }

  const handleNovaCategoriaDescricaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNovaCategoria((prev) => ({ ...prev, descricao: e.target.value }))
  }

  const salvarNovaCategoria = () => {
    if (!novaCategoria.nome) return

    // Em um sistema real, você enviaria isso para o backend
    // e receberia um ID real. Aqui estamos simulando.
    const novaId = `novo-${Date.now()}`
    const categoriaCriada = {
      ...novaCategoria,
      id: novaId,
    }

    // Adicionar à lista de categorias disponíveis (simulação)
    categoriasDisponiveis.push(categoriaCriada)

    // Adicionar ao produto atual
    setFormData((prev) => ({
      ...prev,
      categorias: [...prev.categorias, categoriaCriada],
    }))

    // Resetar o formulário e fechar o modal
    setNovaCategoria({ id: "", nome: "", descricao: "" })
    setModalAberto(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar o produto
    console.log("Dados do produto:", formData)

    // Redireciona para a lista de produtos
    router.push("/estoque/produtos")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_integracao">ID Integração</Label>
              <Input id="id_integracao" name="id_integracao" value={formData.id_integracao} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handlePrecoChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center">
                <Label>Categorias</Label>
                <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Categoria</DialogTitle>
                      <DialogDescription>Adicione uma nova categoria de produto.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="nova-categoria-nome">Nome</Label>
                        <Input
                          id="nova-categoria-nome"
                          value={novaCategoria.nome}
                          onChange={handleNovaCategoriaNomeChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nova-categoria-descricao">Descrição</Label>
                        <Textarea
                          id="nova-categoria-descricao"
                          value={novaCategoria.descricao}
                          onChange={handleNovaCategoriaDescricaoChange}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setModalAberto(false)}>
                        Cancelar
                      </Button>
                      <Button type="button" onClick={salvarNovaCategoria}>
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.categorias.map((categoria) => (
                  <Badge key={categoria.id} variant="secondary" className="pl-2 pr-1 py-1">
                    {categoria.nome}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => removerCategoria(categoria.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {formData.categorias.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma categoria selecionada</p>
                )}
              </div>

              <div className="flex gap-2">
                <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasDisponiveis
                      .filter((cat) => !formData.categorias.some((c) => c.id === cat.id))
                      .map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={adicionarCategoria} disabled={!categoriaSelecionada}>
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/estoque/produtos")}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
