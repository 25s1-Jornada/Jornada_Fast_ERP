"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Tipos para os dados do estoque
interface Produto {
  id: string
  nome: string
  sku: string
}

interface Armario {
  id: string
  nome: string
}

interface Usuario {
  id: string
  nome: string
}

interface MovimentacaoEstoque {
  id: string
  produto_id: string
  tipo: "ENTRADA" | "SAIDA"
  quantidade: number
  armario_id: string
  data_movimentacao: string
  observacao: string
  usuario_id: string
  produto?: Produto
  armario?: Armario
  usuario?: Usuario
}

interface ItemEstoque {
  id?: string
  armario_id: string
  produto_id: string
  quantidade: number
  ultima_movimentacao?: MovimentacaoEstoque
  armario?: Armario
  produto?: Produto
}

interface EstoqueFormProps {
  itemEstoque?: ItemEstoque
}

// Dados de exemplo para produtos e armários
const produtosDisponiveis: Produto[] = [
  { id: "1", nome: "Compressor 1HP", sku: "PROD001" },
  { id: "2", nome: "Lâmpada LED 15W", sku: "PROD002" },
  { id: "3", nome: "Suporte para Ar Condicionado", sku: "PROD003" },
  { id: "4", nome: "Gás Refrigerante R410A", sku: "PROD004" },
  { id: "5", nome: "Painel LED 24W", sku: "PROD005" },
]

const armariosDisponiveis: Armario[] = [
  { id: "1", nome: "Armário Principal" },
  { id: "2", nome: "Armário Secundário" },
  { id: "3", nome: "Armário Filial SP" },
  { id: "4", nome: "Armário Peças Pequenas" },
  { id: "5", nome: "Armário Ferramentas" },
]

export function EstoqueForm({ itemEstoque }: EstoqueFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ItemEstoque>(
    itemEstoque || {
      armario_id: "",
      produto_id: "",
      quantidade: 0,
    },
  )

  // Estado para a movimentação inicial (apenas para novos itens)
  const [movimentacaoInicial, setMovimentacaoInicial] = useState({
    observacao: "",
  })

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantidade = Number.parseInt(e.target.value) || 0
    setFormData((prev) => ({ ...prev, quantidade }))
  }

  const handleArmarioChange = (armarioId: string) => {
    setFormData((prev) => ({ ...prev, armario_id: armarioId }))
  }

  const handleProdutoChange = (produtoId: string) => {
    setFormData((prev) => ({ ...prev, produto_id: produtoId }))
  }

  const handleObservacaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMovimentacaoInicial((prev) => ({ ...prev, observacao: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar o item de estoque
    console.log("Dados do item de estoque:", formData)
    console.log("Observação da movimentação inicial:", movimentacaoInicial.observacao)

    // Redireciona para a lista de estoque
    router.push("/estoque-geral/estoque")
  }

  // Obter produto e armário selecionados
  const produtoSelecionado = produtosDisponiveis.find((p) => p.id === formData.produto_id)
  const armarioSelecionado = armariosDisponiveis.find((a) => a.id === formData.armario_id)

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Select value={formData.produto_id} onValueChange={handleProdutoChange} required>
                <SelectTrigger id="produto">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtosDisponiveis.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="armario">Armário</Label>
              <Select value={formData.armario_id} onValueChange={handleArmarioChange} required>
                <SelectTrigger id="armario">
                  <SelectValue placeholder="Selecione o armário" />
                </SelectTrigger>
                <SelectContent>
                  {armariosDisponiveis.map((armario) => (
                    <SelectItem key={armario.id} value={armario.id}>
                      {armario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={handleQuantidadeChange}
                required
              />
            </div>

            {!itemEstoque && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacao">Observação da Movimentação Inicial</Label>
                <Textarea
                  id="observacao"
                  value={movimentacaoInicial.observacao}
                  onChange={handleObservacaoChange}
                  rows={3}
                  placeholder="Descreva a origem desta movimentação inicial"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/estoque-geral/estoque")}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
