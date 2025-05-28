"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

// Tipos para os dados do chamado
interface Cliente {
  id: string
  nome: string
}

interface Tecnico {
  id: string
  nome: string
}

interface Descricao {
  id: string
  numeroSerie: string
  defeito: string
  observacao: string
}

interface Material {
  id: string
  material: string
  quantidade: string
  valorUnitario: string
  totalValor: string
}

interface Custos {
  deslocamento: {
    hrSaidaEmpresa: string
    hrChegadaCliente: string
    hrSaidaCliente: string
    hrChegadaEmpresa: string
    totalHoras: string
    totalValor: string
  }
  horaTrabalhada: {
    hrInicio: string
    hrTermino: string
    totalHoras: string
    totalValor: string
  }
  km: {
    km: string
    valorPorKm: string
    totalValor: string
  }
  materiais: Material[]
  valorTotal: string
}

interface Chamado {
  id?: string
  cliente: Cliente
  tecnico: Tecnico
  dataAbertura: string
  dataVisita: string
  status: string
  descricoes: Descricao[]
  custos: Custos
}

interface ChamadoModalProps {
  isOpen: boolean
  onClose: () => void
  onSalvar: (chamado: Chamado) => void
  chamado?: Chamado
}

// Dados de exemplo para seleção
const clientesDisponiveis = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Empresa ABC Ltda" },
  { id: "3", nome: "Comércio XYZ" },
]

const tecnicosDisponiveis = [
  { id: "1", nome: "Carlos Oliveira" },
  { id: "2", nome: "Ana Silva" },
  { id: "3", nome: "Roberto Santos" },
]

const tiposDefeito = ["Refrigeração", "Iluminação", "Estrutura", "Outros"]

export function ChamadoModal({ isOpen, onClose, onSalvar, chamado }: ChamadoModalProps) {
  const hoje = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState<Chamado>({
    cliente: { id: "", nome: "" },
    tecnico: { id: "", nome: "" },
    dataAbertura: hoje,
    dataVisita: "",
    status: "aberto",
    descricoes: [
      {
        id: "temp-1",
        numeroSerie: "",
        defeito: "Refrigeração",
        observacao: "",
      },
    ],
    custos: {
      deslocamento: {
        hrSaidaEmpresa: "",
        hrChegadaCliente: "",
        hrSaidaCliente: "",
        hrChegadaEmpresa: "",
        totalHoras: "0",
        totalValor: "0",
      },
      horaTrabalhada: {
        hrInicio: "",
        hrTermino: "",
        totalHoras: "0",
        totalValor: "0",
      },
      km: {
        km: "0",
        valorPorKm: "1.50",
        totalValor: "0",
      },
      materiais: [],
      valorTotal: "0",
    },
  })

  const [activeTab, setActiveTab] = useState("descricao")

  useEffect(() => {
    if (chamado) {
      setFormData(chamado)
    } else {
      setFormData({
        cliente: { id: "", nome: "" },
        tecnico: { id: "", nome: "" },
        dataAbertura: hoje,
        dataVisita: "",
        status: "aberto",
        descricoes: [
          {
            id: "temp-1",
            numeroSerie: "",
            defeito: "Refrigeração",
            observacao: "",
          },
        ],
        custos: {
          deslocamento: {
            hrSaidaEmpresa: "",
            hrChegadaCliente: "",
            hrSaidaCliente: "",
            hrChegadaEmpresa: "",
            totalHoras: "0",
            totalValor: "0",
          },
          horaTrabalhada: {
            hrInicio: "",
            hrTermino: "",
            totalHoras: "0",
            totalValor: "0",
          },
          km: {
            km: "0",
            valorPorKm: "1.50",
            totalValor: "0",
          },
          materiais: [],
          valorTotal: "0",
        },
      })
    }
  }, [chamado, isOpen])

  const handleAddDescricao = () => {
    const novaDescricao = {
      id: `temp-${Date.now()}`,
      numeroSerie: "",
      defeito: "Refrigeração",
      observacao: "",
    }
    setFormData({
      ...formData,
      descricoes: [...formData.descricoes, novaDescricao],
    })
  }

  const handleRemoveDescricao = (id: string) => {
    setFormData({
      ...formData,
      descricoes: formData.descricoes.filter((desc) => desc.id !== id),
    })
  }

  const handleDescricaoChange = (id: string, field: keyof Descricao, value: string) => {
    setFormData({
      ...formData,
      descricoes: formData.descricoes.map((desc) => (desc.id === id ? { ...desc, [field]: value } : desc)),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvar(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{chamado ? "Editar Chamado" : "Novo Chamado"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select
                    value={formData.cliente.id}
                    onValueChange={(value) => {
                      const cliente = clientesDisponiveis.find((c) => c.id === value)
                      setFormData({
                        ...formData,
                        cliente: cliente || { id: "", nome: "" },
                      })
                    }}
                  >
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientesDisponiveis.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tecnico">Técnico</Label>
                  <Select
                    value={formData.tecnico.id}
                    onValueChange={(value) => {
                      const tecnico = tecnicosDisponiveis.find((t) => t.id === value)
                      setFormData({
                        ...formData,
                        tecnico: tecnico || { id: "", nome: "" },
                      })
                    }}
                  >
                    <SelectTrigger id="tecnico">
                      <SelectValue placeholder="Selecione o técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {tecnicosDisponiveis.map((tecnico) => (
                        <SelectItem key={tecnico.id} value={tecnico.id}>
                          {tecnico.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        status: value,
                      })
                    }}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataAbertura">Data de Abertura</Label>
                  <Input
                    id="dataAbertura"
                    type="date"
                    value={formData.dataAbertura}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        dataAbertura: e.target.value,
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVisita">Data de Visita</Label>
                  <Input
                    id="dataVisita"
                    type="date"
                    value={formData.dataVisita}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        dataVisita: e.target.value,
                      })
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="descricao">DESCRIÇÃO DO CHAMADO</TabsTrigger>
              <TabsTrigger value="custos">CUSTOS SERVIÇO</TabsTrigger>
            </TabsList>

            <TabsContent value="descricao" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Descrições</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddDescricao}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Descrição
                </Button>
              </div>

              {formData.descricoes.map((descricao, index) => (
                <Card key={descricao.id} className="mb-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveDescricao(descricao.id)}
                    disabled={formData.descricoes.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`numeroSerie-${index}`}>N° Série:</Label>
                        <Input
                          id={`numeroSerie-${index}`}
                          value={descricao.numeroSerie}
                          onChange={(e) => handleDescricaoChange(descricao.id, "numeroSerie", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`defeito-${index}`}>Defeito:</Label>
                        <Select
                          value={descricao.defeito}
                          onValueChange={(value) => handleDescricaoChange(descricao.id, "defeito", value)}
                        >
                          <SelectTrigger id={`defeito-${index}`}>
                            <SelectValue placeholder="Selecione o tipo de defeito" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposDefeito.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`observacao-${index}`}>Observação:</Label>
                        <Textarea
                          id={`observacao-${index}`}
                          value={descricao.observacao}
                          onChange={(e) => handleDescricaoChange(descricao.id, "observacao", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="custos" className="space-y-4">
              <div className="text-center text-muted-foreground">
                <p>Funcionalidade de custos será implementada em versão futura</p>
                <p>Por enquanto, foque na descrição do chamado</p>
              </div>
            </TabsContent>
          </Tabs>

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
