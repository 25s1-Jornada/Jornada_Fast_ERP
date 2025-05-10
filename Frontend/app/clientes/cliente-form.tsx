"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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

interface ClienteFormProps {
  cliente?: Cliente
}

export function ClienteForm({ cliente }: ClienteFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Cliente>(
    cliente || {
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
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, uf: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar o cliente
    console.log("Dados do cliente:", formData)

    // Redireciona para a lista de clientes
    router.push("/clientes")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Cliente</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Contato</Label>
              <Input id="contato" name="contato" value={formData.contato} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Tel.</Label>
              <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">N°</Label>
              <Input id="numero" name="numero" value={formData.numero} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Select value={formData.uf} onValueChange={handleSelectChange}>
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
              <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pedido">Pedido</Label>
              <Input id="pedido" name="pedido" value={formData.pedido} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFaturamento">Data Fat.</Label>
              <Input
                id="dataFaturamento"
                name="dataFaturamento"
                value={formData.dataFaturamento}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="garantia">Garantia</Label>
              <Input id="garantia" name="garantia" value={formData.garantia} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/clientes")}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
