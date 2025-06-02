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
import { Plus, X, Trash2 } from "lucide-react"

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

interface CustoServico {
  id: string
  nome: string
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
  subtotal: string
}

interface Chamado {
  id?: string
  cliente: Cliente
  tecnico: Tecnico
  dataAbertura: string
  dataVisita: string
  status: string
  pedido: string
  dataFaturamento: string
  garantia: string
  descricoes: Descricao[]
  custosServico: CustoServico[]
  valorTotal: string
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
    pedido: "",
    dataFaturamento: "",
    garantia: "",
    descricoes: [
      {
        id: "temp-1",
        numeroSerie: "",
        defeito: "Refrigeração",
        observacao: "",
      },
    ],
    custosServico: [
      {
        id: "custo-1",
        nome: "Custo Principal",
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
        subtotal: "0",
      },
    ],
    valorTotal: "0",
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
        pedido: "",
        dataFaturamento: "",
        garantia: "",
        descricoes: [
          {
            id: "temp-1",
            numeroSerie: "",
            defeito: "Refrigeração",
            observacao: "",
          },
        ],
        custosServico: [
          {
            id: "custo-1",
            nome: "Custo Principal",
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
            subtotal: "0",
          },
        ],
        valorTotal: "0",
      })
    }
  }, [chamado, isOpen])

  // Funções para manipular as descrições
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

  // Funções para manipular os materiais
  const handleAddMaterial = () => {
    const novoMaterial = {
      id: `temp-${Date.now()}`,
      material: "",
      quantidade: "1",
      valorUnitario: "0",
      totalValor: "0",
    }
    setFormData({
      ...formData,
      custosServico: formData.custosServico.map((custoServico, index) => {
        if (index === 0) {
          return {
            ...custoServico,
            materiais: [...custoServico.materiais, novoMaterial],
          }
        }
        return custoServico
      }),
    })
  }

  const handleRemoveMaterial = (id: string) => {
    setFormData({
      ...formData,
      custosServico: formData.custosServico.map((custoServico, index) => {
        if (index === 0) {
          return {
            ...custoServico,
            materiais: custoServico.materiais.filter((mat) => mat.id !== id),
          }
        }
        return custoServico
      }),
    })
  }

  const handleMaterialChange = (id: string, field: keyof Material, value: string) => {
    setFormData({
      ...formData,
      custosServico: formData.custosServico.map((custoServico, index) => {
        if (index === 0) {
          return {
            ...custoServico,
            materiais: custoServico.materiais.map((mat) => {
              if (mat.id === id) {
                const updatedMat = { ...mat, [field]: value }

                // Recalcular o valor total se quantidade ou valor unitário mudar
                if (field === "quantidade" || field === "valorUnitario") {
                  const quantidade = Number.parseFloat(updatedMat.quantidade) || 0
                  const valorUnitario = Number.parseFloat(updatedMat.valorUnitario) || 0
                  updatedMat.totalValor = (quantidade * valorUnitario).toFixed(2)
                }

                return updatedMat
              }
              return mat
            }),
          }
        }
        return custoServico
      }),
    })
  }

  // Funções para manipular custos de serviço
  const handleAddCustoServico = () => {
    const novoCusto = {
      id: `custo-${Date.now()}`,
      nome: `Custo ${formData.custosServico.length + 1}`,
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
      subtotal: "0",
    }
    setFormData({
      ...formData,
      custosServico: [...formData.custosServico, novoCusto],
    })
  }

  const handleRemoveCustoServico = (id: string) => {
    setFormData({
      ...formData,
      custosServico: formData.custosServico.filter((custo) => custo.id !== id),
    })
  }

  // Função para calcular os totais
  const calcularTotais = () => {
    let valorTotalGeral = 0

    const custosAtualizados = formData.custosServico.map((custoServico) => {
      // Calcular total de custos de KM
      const km = Number.parseFloat(custoServico.km.km) || 0
      const valorPorKm = Number.parseFloat(custoServico.km.valorPorKm) || 0
      const totalKm = (km * valorPorKm).toFixed(2)

      // Calcular total de materiais
      const totalMateriais = custoServico.materiais.reduce((total, mat) => {
        return total + (Number.parseFloat(mat.totalValor) || 0)
      }, 0)

      // Calcular subtotal
      const deslocamento = Number.parseFloat(custoServico.deslocamento.totalValor) || 0
      const horaTrabalhada = Number.parseFloat(custoServico.horaTrabalhada.totalValor) || 0
      const kmTotal = Number.parseFloat(totalKm) || 0

      const subtotal = (deslocamento + horaTrabalhada + kmTotal + totalMateriais).toFixed(2)
      valorTotalGeral += Number.parseFloat(subtotal)

      return {
        ...custoServico,
        km: {
          ...custoServico.km,
          totalValor: totalKm,
        },
        subtotal: subtotal,
      }
    })

    setFormData({
      ...formData,
      custosServico: custosAtualizados,
      valorTotal: valorTotalGeral.toFixed(2),
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

                <div className="space-y-2">
                  <Label htmlFor="pedido">Pedido</Label>
                  <Input
                    id="pedido"
                    value={formData.pedido}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        pedido: e.target.value,
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFaturamento">Data Fat.</Label>
                  <Input
                    id="dataFaturamento"
                    value={formData.dataFaturamento}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        dataFaturamento: e.target.value,
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garantia">Garantia</Label>
                  <Input
                    id="garantia"
                    value={formData.garantia}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        garantia: e.target.value,
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

            {/* Conteúdo da aba DESCRIÇÃO DO CHAMADO */}
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

            {/* Conteúdo da aba CUSTOS SERVIÇO */}
            <TabsContent value="custos" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Custos de Serviço</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddCustoServico}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Custo
                </Button>
              </div>

              {formData.custosServico.map((custoServico, custoIndex) => (
                <Card key={custoServico.id} className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="space-y-2 flex-1 mr-4">
                        <Label htmlFor={`nomeCusto-${custoIndex}`}>Nome do Custo:</Label>
                        <Input
                          id={`nomeCusto-${custoIndex}`}
                          value={custoServico.nome}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              custosServico: formData.custosServico.map((custo) =>
                                custo.id === custoServico.id ? { ...custo, nome: e.target.value } : custo,
                              ),
                            })
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCustoServico(custoServico.id)}
                        disabled={formData.custosServico.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Custos de Deslocamento */}
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-base font-medium mb-4">Custos Deslocamento</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="hrSaidaEmpresa">Hr Saída Empresa:</Label>
                              <Input
                                id="hrSaidaEmpresa"
                                type="time"
                                value={custoServico.deslocamento.hrSaidaEmpresa}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          deslocamento: {
                                            ...custo.deslocamento,
                                            hrSaidaEmpresa: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hrChegadaCliente">Hr Chegada Cliente:</Label>
                              <Input
                                id="hrChegadaCliente"
                                type="time"
                                value={custoServico.deslocamento.hrChegadaCliente}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          deslocamento: {
                                            ...custo.deslocamento,
                                            hrChegadaCliente: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hrSaidaCliente">Hr Saída Cliente:</Label>
                              <Input
                                id="hrSaidaCliente"
                                type="time"
                                value={custoServico.deslocamento.hrSaidaCliente}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          deslocamento: {
                                            ...custo.deslocamento,
                                            hrSaidaCliente: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hrChegadaEmpresa">Hr Chegada Empresa:</Label>
                              <Input
                                id="hrChegadaEmpresa"
                                type="time"
                                value={custoServico.deslocamento.hrChegadaEmpresa}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          deslocamento: {
                                            ...custo.deslocamento,
                                            hrChegadaEmpresa: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="totalHorasDeslocamento">Total Hr:</Label>
                              <Input
                                id="totalHorasDeslocamento"
                                value={custoServico.deslocamento.totalHoras}
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="totalValorDeslocamento">Total R$:</Label>
                              <Input
                                id="totalValorDeslocamento"
                                value={custoServico.deslocamento.totalValor}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          deslocamento: {
                                            ...custo.deslocamento,
                                            totalValor: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Custos Hora Trabalhada */}
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-base font-medium mb-4">Custos Hora Trabalhada</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="hrInicio">Hr Início:</Label>
                              <Input
                                id="hrInicio"
                                type="time"
                                value={custoServico.horaTrabalhada.hrInicio}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          horaTrabalhada: {
                                            ...custo.horaTrabalhada,
                                            hrInicio: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hrTermino">Hr Término:</Label>
                              <Input
                                id="hrTermino"
                                type="time"
                                value={custoServico.horaTrabalhada.hrTermino}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          horaTrabalhada: {
                                            ...custo.horaTrabalhada,
                                            hrTermino: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="totalHorasTrabalhadas">Total Hr:</Label>
                              <Input
                                id="totalHorasTrabalhadas"
                                value={custoServico.horaTrabalhada.totalHoras}
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="totalValorHoraTrabalhada">Total R$:</Label>
                              <Input
                                id="totalValorHoraTrabalhada"
                                value={custoServico.horaTrabalhada.totalValor}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          horaTrabalhada: {
                                            ...custo.horaTrabalhada,
                                            totalValor: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Custos KM */}
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-base font-medium mb-4">Custos KM</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="km">KM:</Label>
                              <Input
                                id="km"
                                type="number"
                                value={custoServico.km.km}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          km: {
                                            ...custo.km,
                                            km: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="valorPorKm">R$/KM:</Label>
                              <Input
                                id="valorPorKm"
                                type="number"
                                step="0.01"
                                value={custoServico.km.valorPorKm}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    custosServico: formData.custosServico.map((custo, index) => {
                                      if (custo.id === custoServico.id) {
                                        return {
                                          ...custo,
                                          km: {
                                            ...custo.km,
                                            valorPorKm: e.target.value,
                                          },
                                        }
                                      }
                                      return custo
                                    }),
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="totalValorKm">Total R$:</Label>
                              <Input id="totalValorKm" value={custoServico.km.totalValor} readOnly />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Despesas c/ Materiais */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-medium">Despesas c/ Materiais</h3>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddMaterial}>
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Material
                            </Button>
                          </div>

                          {custoServico.materiais.length > 0 ? (
                            custoServico.materiais.map((material, index) => (
                              <div key={material.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                                <div className="col-span-5">
                                  <Label htmlFor={`material-${index}`} className="text-xs">
                                    Material:
                                  </Label>
                                  <Input
                                    id={`material-${index}`}
                                    value={material.material}
                                    onChange={(e) => handleMaterialChange(material.id, "material", e.target.value)}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label htmlFor={`quantidade-${index}`} className="text-xs">
                                    Qtd:
                                  </Label>
                                  <Input
                                    id={`quantidade-${index}`}
                                    type="number"
                                    value={material.quantidade}
                                    onChange={(e) => handleMaterialChange(material.id, "quantidade", e.target.value)}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label htmlFor={`valorUnitario-${index}`} className="text-xs">
                                    Valor:
                                  </Label>
                                  <Input
                                    id={`valorUnitario-${index}`}
                                    type="number"
                                    step="0.01"
                                    value={material.valorUnitario}
                                    onChange={(e) => handleMaterialChange(material.id, "valorUnitario", e.target.value)}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label htmlFor={`totalValor-${index}`} className="text-xs">
                                    Total:
                                  </Label>
                                  <Input id={`totalValor-${index}`} value={material.totalValor} readOnly />
                                </div>
                                <div className="col-span-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveMaterial(material.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum material adicionado</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Valor Total */}
                      <Card className="md:col-span-2 bg-muted">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-medium">Subtotal R$</h3>
                            <div className="text-xl font-bold">R$ {custoServico.subtotal}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Valor Total */}
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Valor Total R$</h3>
                    <div className="text-xl font-bold">R$ {formData.valorTotal}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={calcularTotais}>
              Calcular Totais
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
