"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, Trash2 } from "lucide-react"
import { DescricaoDefeitoForm } from "./descricao-defeito-form"
import { api } from "@/lib/api"

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
  descricaoDefeito?: any // Para armazenar os dados do formulário de descrição do defeito
}

interface ChamadoModalProps {
  isOpen: boolean
  onClose: () => void
  onSalvar: (chamado: Chamado) => void
  chamado?: Chamado
}

// Atualizar os dados de exemplo para seleção com mais clientes e técnicos
const clientesDisponiveis = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Empresa ABC Ltda" },
  { id: "3", nome: "Comércio XYZ" },
  { id: "4", nome: "Restaurante Bom Sabor" },
  { id: "5", nome: "Supermercado Central" },
  { id: "6", nome: "Hotel Vista Mar" },
  { id: "7", nome: "Padaria Pão Dourado" },
  { id: "8", nome: "Clínica Saúde Total" },
  { id: "9", nome: "Farmácia Popular" },
  { id: "10", nome: "Escola Futuro Brilhante" },
  { id: "11", nome: "Oficina Mecânica Silva" },
  { id: "12", nome: "Loja de Roupas Fashion" },
]

const tecnicosDisponiveis = [
  { id: "1", nome: "Carlos Oliveira" },
  { id: "2", nome: "Ana Silva" },
  { id: "3", nome: "Roberto Santos" },
  { id: "4", nome: "Marina Costa" },
  { id: "5", nome: "Pedro Almeida" },
  { id: "6", nome: "Juliana Ferreira" },
  { id: "7", nome: "Lucas Mendes" },
  { id: "8", nome: "Fernanda Lima" },
]

const tiposDefeito = ["Refrigeração", "Iluminação", "Estrutura", "Elétrico", "Hidráulico", "Outros"]

export function ChamadoModal({ isOpen, onClose, onSalvar, chamado }: ChamadoModalProps) {
  const hoje = new Date().toISOString().split("T")[0]

  const prevIsOpenRef = useRef(false)
  const chamadoIdRef = useRef<string | undefined>(undefined)

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

  // Carregar usuários para preencher cliente e técnico
  const [usuariosOptions, setUsuariosOptions] = useState<{ id: string; nome: string }[]>([])
  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const data = await api.get<any[]>("/api/Usuario")
        const mapped = (data || []).map((u) => ({ id: String(u.id ?? ""), nome: u.nome ?? "" }))
        setUsuariosOptions(mapped)
      } catch (e) {
        console.error(e)
      }
    }
    if (isOpen) loadUsuarios()
  }, [isOpen])

  // Sombreamento: usa usuários como fonte para clientes e técnicos
  const clientesDisponiveis = usuariosOptions
  const tecnicosDisponiveis = usuariosOptions

  const [activeTab, setActiveTab] = useState("descricao")

  useEffect(() => {
    // Only update form data when modal opens or when editing a different chamado
    const modalJustOpened = isOpen && !prevIsOpenRef.current
    const chamadoChanged = chamado?.id !== chamadoIdRef.current

    if (modalJustOpened || (isOpen && chamadoChanged)) {
      if (chamado) {
        setFormData(chamado)
        chamadoIdRef.current = chamado.id
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
        chamadoIdRef.current = undefined
      }
      setActiveTab("descricao")
    }

    prevIsOpenRef.current = isOpen
  }, [isOpen, chamado, hoje])

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

  const handleDescricaoDefeitoSalvar = (dadosDescricaoDefeito: any) => {
    setFormData({
      ...formData,
      descricaoDefeito: dadosDescricaoDefeito,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvar(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[98vw] max-w-[98vw] h-[98vh] max-h-[98vh] overflow-hidden flex flex-col p-0"
        style={{ width: "98vw", maxWidth: "98vw" }}
      >
        <DialogHeader className="flex-shrink-0 px-8 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{chamado ? "Editar Chamado" : "Novo Chamado"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="chamado-form" onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-sm font-medium">
                      Cliente
                    </Label>
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
                    <Label htmlFor="tecnico" className="text-sm font-medium">
                      Técnico
                    </Label>
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
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status
                    </Label>
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
                    <Label htmlFor="dataAbertura" className="text-sm font-medium">
                      Data de Abertura
                    </Label>
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
                    <Label htmlFor="dataVisita" className="text-sm font-medium">
                      Data de Visita
                    </Label>
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
                    <Label htmlFor="pedido" className="text-sm font-medium">
                      Pedido
                    </Label>
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
                    <Label htmlFor="dataFaturamento" className="text-sm font-medium">
                      Data Fat.
                    </Label>
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
                    <Label htmlFor="garantia" className="text-sm font-medium">
                      Garantia
                    </Label>
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

            <div className="mt-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList
                  className="w-full h-16 mb-8 p-2 bg-muted"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                  }}
                >
                  <TabsTrigger
                    value="descricao"
                    className="text-lg font-bold px-8 py-4 data-[state=active]:bg-background data-[state=active]:shadow-lg whitespace-nowrap"
                    style={{ minWidth: "200px" }}
                  >
                    DESCRIÇÃO DO CHAMADO
                  </TabsTrigger>
                  <TabsTrigger
                    value="descricao-defeito"
                    className="text-lg font-bold px-8 py-4 data-[state=active]:bg-background data-[state=active]:shadow-lg whitespace-nowrap"
                    style={{ minWidth: "200px" }}
                  >
                    DESCRIÇÃO DO DEFEITO
                  </TabsTrigger>
                  <TabsTrigger
                    value="custos"
                    className="text-lg font-bold px-8 py-4 data-[state=active]:bg-background data-[state=active]:shadow-lg whitespace-nowrap"
                    style={{ minWidth: "200px" }}
                  >
                    CUSTOS SERVIÇO
                  </TabsTrigger>
                </TabsList>

                {/* Conteúdo da aba DESCRIÇÃO DO CHAMADO */}
                <TabsContent value="descricao" className="space-y-4 mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Descrições</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddDescricao}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Descrição
                    </Button>
                  </div>

                  {formData.descricoes.map((descricao, index) => (
                    <Card key={descricao.id} className="relative border-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-10"
                        onClick={() => handleRemoveDescricao(descricao.id)}
                        disabled={formData.descricoes.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <CardContent className="pt-6 pr-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`numeroSerie-${index}`} className="text-sm font-medium">
                              N° Série:
                            </Label>
                            <Input
                              id={`numeroSerie-${index}`}
                              value={descricao.numeroSerie}
                              onChange={(e) => handleDescricaoChange(descricao.id, "numeroSerie", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`defeito-${index}`} className="text-sm font-medium">
                              Defeito:
                            </Label>
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
                            <Label htmlFor={`observacao-${index}`} className="text-sm font-medium">
                              Observação:
                            </Label>
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

                {/* Conteúdo da aba DESCRIÇÃO DO DEFEITO */}
                <TabsContent value="descricao-defeito" className="space-y-4 mt-0">
                  <DescricaoDefeitoForm
                    onSalvar={handleDescricaoDefeitoSalvar}
                    dadosIniciais={formData.descricaoDefeito}
                  />
                </TabsContent>

                {/* Conteúdo da aba CUSTOS SERVIÇO */}
                <TabsContent value="custos" className="space-y-4 mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Custos de Serviço</h3>
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
                            <Label htmlFor={`nomeCusto-${custoIndex}`} className="text-sm font-medium">
                              Nome do Custo:
                            </Label>
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
                                        onChange={(e) =>
                                          handleMaterialChange(material.id, "quantidade", e.target.value)
                                        }
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
                                        onChange={(e) =>
                                          handleMaterialChange(material.id, "valorUnitario", e.target.value)
                                        }
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
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-4 px-8 py-5 border-t bg-background">
          <Button type="button" variant="outline" onClick={onClose} size="lg">
            Cancelar
          </Button>
          <Button type="button" onClick={calcularTotais} variant="secondary" size="lg">
            Calcular Totais
          </Button>
          <Button type="submit" form="chamado-form" size="lg">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
