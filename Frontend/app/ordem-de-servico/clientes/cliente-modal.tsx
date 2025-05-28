"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Lista de estados brasileiros
const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

interface Cliente {
  id?: string
  nome: string
  contato: string
  telefone: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  codigo: string
  pedido: string
  dataFaturamento: string
  garantia: string
}

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSalvar: (cliente: Cliente) => void
  cliente?: Cliente
}

export function ClienteModal({ isOpen, onClose, onSalvar, cliente }: ClienteModalProps) {
  const [formData, setFormData] = useState<Cliente>({
    nome: "",
    contato: "",
    telefone: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    codigo: "",
    pedido: "",
    dataFaturamento: "",
    garantia: "",
  })

  useEffect(() => {
    if (cliente) {
      setFormData(cliente)
    } else {
      setFormData({
        nome: "",
        contato: "",
        telefone: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        codigo: "",
        pedido: "",
        dataFaturamento: "",
        garantia: "",
      })
    }
  }, [cliente, isOpen])

  const handleChange = (field: keyof Cliente, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvar(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Cliente</Label>
              <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Contato</Label>
              <Input id="contato" value={formData.contato} onChange={(e) => handleChange("contato", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Tel.</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">N°</Label>
              <Input id="numero" value={formData.numero} onChange={(e) => handleChange("numero", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" value={formData.bairro} onChange={(e) => handleChange("bairro", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={formData.cidade} onChange={(e) => handleChange("cidade", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Select value={formData.uf} onValueChange={(value) => handleChange("uf", value)}>
                <SelectTrigger id="uf">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Cód. Cliente</Label>
              <Input id="codigo" value={formData.codigo} onChange={(e) => handleChange("codigo", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pedido">Pedido</Label>
              <Input id="pedido" value={formData.pedido} onChange={(e) => handleChange("pedido", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFaturamento">Data Fat.</Label>
              <Input
                id="dataFaturamento"
                value={formData.dataFaturamento}
                onChange={(e) => handleChange("dataFaturamento", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="garantia">Garantia</Label>
              <Input
                id="garantia"
                value={formData.garantia}
                onChange={(e) => handleChange("garantia", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
