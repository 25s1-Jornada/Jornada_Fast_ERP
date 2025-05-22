"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipos para os dados do armário
interface Empresa {
  id: string
  nome: string
  documento: string
}

interface Armario {
  id?: string
  nome: string
  empresa: Empresa
}

interface ArmarioFormProps {
  armario?: Armario
}

// Dados de exemplo para empresas disponíveis
const empresasDisponiveis: Empresa[] = [
  { id: "1", nome: "FAST Refrigeração Ltda", documento: "12.345.678/0001-90" },
  { id: "2", nome: "FAST SP Ltda", documento: "98.765.432/0001-10" },
  { id: "3", nome: "FAST Manutenção Ltda", documento: "45.678.901/0001-23" },
]

export function ArmarioForm({ armario }: ArmarioFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Armario>(
    armario || {
      nome: "",
      empresa: { id: "", nome: "", documento: "" },
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmpresaChange = (empresaId: string) => {
    const empresaSelecionada = empresasDisponiveis.find((emp) => emp.id === empresaId)
    if (empresaSelecionada) {
      setFormData((prev) => ({
        ...prev,
        empresa: empresaSelecionada,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar o armário
    console.log("Dados do armário:", formData)

    // Redireciona para a lista de armários
    router.push("/estoque/armarios")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Armário</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select value={formData.empresa.id} onValueChange={handleEmpresaChange}>
                <SelectTrigger id="empresa">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasDisponiveis.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.empresa.id && (
              <div className="space-y-2">
                <Label>Documento da Empresa</Label>
                <Input value={formData.empresa.documento} disabled />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/estoque/armarios")}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
