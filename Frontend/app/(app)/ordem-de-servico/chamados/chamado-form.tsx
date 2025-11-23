"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, WifiOff, Clock, RefreshCw } from "lucide-react"
import { offlineOsQueue, type OfflineOsStatus } from "@/lib/offline-os-store"

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

interface ChamadoFormProps {
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

export function ChamadoForm({ chamado }: ChamadoFormProps) {
  const router = useRouter()
  const hoje = new Date().toISOString().split("T")[0]
  const [localId, setLocalId] = useState<string | undefined>(chamado?.id)
  const [offlineStatus, setOfflineStatus] = useState<OfflineOsStatus>("draft")
  const [lastError, setLastError] = useState<string | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)
  const [isQueueing, setIsQueueing] = useState(false)

  const [formData, setFormData] = useState<Chamado>(
    chamado || {
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
    },
  )

  const [activeTab, setActiveTab] = useState("descricao")
  const payload = useMemo(
    () => ({
      localId,
      clienteId: formData.cliente.id,
      clienteNome: formData.cliente.nome,
      tecnicoId: formData.tecnico.id,
      tecnicoNome: formData.tecnico.nome,
      status: formData.status,
      dataAbertura: formData.dataAbertura,
      dataVisita: formData.dataVisita,
      valorTotal: formData.custos.valorTotal,
      descricoes: formData.descricoes.map((d) => ({
        numeroSerie: d.numeroSerie,
        defeito: d.defeito,
        observacao: d.observacao,
      })),
    }),
    [formData, localId],
  )

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true)
        const saved = await offlineOsQueue.saveDraft(payload)
        setLocalId(saved.localId)
        setOfflineStatus(saved.status)
        setLastError(undefined)
      } catch (error) {
        console.error("Erro ao salvar rascunho offline", error)
        setLastError("Não foi possível salvar o rascunho offline.")
        setOfflineStatus("failed")
      } finally {
        setIsSaving(false)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [payload])

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
      custos: {
        ...formData.custos,
        materiais: [...formData.custos.materiais, novoMaterial],
      },
    })
  }

  const handleRemoveMaterial = (id: string) => {
    setFormData({
      ...formData,
      custos: {
        ...formData.custos,
        materiais: formData.custos.materiais.filter((mat) => mat.id !== id),
      },
    })
  }

  const handleMaterialChange = (id: string, field: keyof Material, value: string) => {
    setFormData({
      ...formData,
      custos: {
        ...formData.custos,
        materiais: formData.custos.materiais.map((mat) => {
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
      },
    })
  }

  // Funções para manipular os custos de deslocamento
  const handleDeslocamentoChange = (field: keyof typeof formData.custos.deslocamento, value: string) => {
    setFormData({
      ...formData,
      custos: {
        ...formData.custos,
        deslocamento: {
          ...formData.custos.deslocamento,
          [field]: value,
        },
      },
    })
  }

  // Funções para manipular os custos de hora trabalhada
  const handleHoraTrabalhadaChange = (field: keyof typeof formData.custos.horaTrabalhada, value: string) => {
    setFormData({
      ...formData,
      custos: {
        ...formData.custos,
        horaTrabalhada: {
          ...formData.custos.horaTrabalhada,
          [field]: value,
        },
      },
    })
  }

  // Funções para manipular os custos de KM
  const handleKmChange = (field: keyof typeof formData.custos.km, value: string) => {
    setFormData({
      ...formData,
      custos: {
        ...formData.custos,
        km: {
          ...formData.custos.km,
          [field]: value,
        },
      },
    })
  }

  // Função para calcular os totais
  const calcularTotais = () => {
    // Calcular total de horas de deslocamento
    const calcularHorasDeslocamento = () => {
      const { hrSaidaEmpresa, hrChegadaCliente, hrSaidaCliente, hrChegadaEmpresa } = formData.custos.deslocamento

      if (!hrSaidaEmpresa || !hrChegadaCliente || !hrSaidaCliente || !hrChegadaEmpresa) {
        return "0"
      }

      // Implementação simplificada - em um sistema real, você usaria uma biblioteca de data/hora
      return "4.5" // Valor de exemplo
    }

    // Calcular total de horas trabalhadas
    const calcularHorasTrabalhadas = () => {
      const { hrInicio, hrTermino } = formData.custos.horaTrabalhada

      if (!hrInicio || !hrTermino) {
        return "0"
      }

      // Implementação simplificada
      return "3.0" // Valor de exemplo
    }

    // Calcular total de custos de KM
    const calcularCustosKm = () => {
      const km = Number.parseFloat(formData.custos.km.km) || 0
      const valorPorKm = Number.parseFloat(formData.custos.km.valorPorKm) || 0
      return (km * valorPorKm).toFixed(2)
    }

    // Calcular total de materiais
    const calcularTotalMateriais = () => {
      return formData.custos.materiais
        .reduce((total, mat) => {
          return total + (Number.parseFloat(mat.totalValor) || 0)
        }, 0)
        .toFixed(2)
    }

    // Calcular valor total
    const calcularValorTotal = () => {
      const deslocamento = Number.parseFloat(formData.custos.deslocamento.totalValor) || 0
      const horaTrabalhada = Number.parseFloat(formData.custos.horaTrabalhada.totalValor) || 0
      const km = Number.parseFloat(formData.custos.km.totalValor) || 0
      const materiais = formData.custos.materiais.reduce((total, mat) => {
        return total + (Number.parseFloat(mat.totalValor) || 0)
      }, 0)

      return (deslocamento + horaTrabalhada + km + materiais).toFixed(2)
    }

    // Atualizar os totais no estado
    setFormData({
      ...formData,
      custos: {
        ...formData.custos,
        deslocamento: {
          ...formData.custos.deslocamento,
          totalHoras: calcularHorasDeslocamento(),
          totalValor: (Number.parseFloat(calcularHorasDeslocamento()) * 50).toFixed(2), // 50 é o valor por hora de exemplo
        },
        horaTrabalhada: {
          ...formData.custos.horaTrabalhada,
          totalHoras: calcularHorasTrabalhadas(),
          totalValor: (Number.parseFloat(calcularHorasTrabalhadas()) * 50).toFixed(2),
        },
        km: {
          ...formData.custos.km,
          totalValor: calcularCustosKm(),
        },
        valorTotal: calcularValorTotal(),
      },
    })
  }

  const handleQueue = async () => {
    setIsQueueing(true)
    try {
      const saved = await offlineOsQueue.queueForSync(payload)
      setLocalId(saved.localId)
      setOfflineStatus(saved.status)
      setLastError(undefined)
    } catch (error) {
      console.error("Erro ao enfileirar chamado offline", error)
      setOfflineStatus("failed")
      setLastError("Falha ao enfileirar para sincronização.")
    } finally {
      setIsQueueing(false)
    }
  }

  const handleSaveOffline = async () => {
    setIsSaving(true)
    try {
      const saved = await offlineOsQueue.saveDraft(payload)
      setLocalId(saved.localId)
      setOfflineStatus(saved.status)
      setLastError(undefined)
    } catch (error) {
      console.error("Erro ao salvar rascunho offline", error)
      setLastError("Não foi possível salvar o rascunho offline.")
      setOfflineStatus("failed")
    } finally {
      setIsSaving(false)
    }
  }

  const statusChip = useMemo(() => {
    switch (offlineStatus) {
      case "draft":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> Rascunho offline
          </Badge>
        )
      case "queued":
        return (
          <Badge variant="secondary" className="gap-1">
            <RefreshCw className="h-3 w-3" /> Na fila para enviar
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            <WifiOff className="h-3 w-3" /> Erro ao sincronizar
          </Badge>
        )
      case "synced":
        return (
          <Badge className="gap-1">
            <RefreshCw className="h-3 w-3" /> Sincronizado
          </Badge>
        )
      case "syncing":
        return (
          <Badge variant="outline" className="gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" /> Enviando...
          </Badge>
        )
      default:
        return null
    }
  }, [offlineStatus])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Status offline</p>
                <div className="flex items-center gap-2">{statusChip}</div>
                {lastError ? <p className="text-xs text-destructive">{lastError}</p> : null}
              </div>
              {isSaving ? <span className="text-xs text-muted-foreground">Salvando rascunho...</span> : null}
            </div>
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
                        value={formData.custos.deslocamento.hrSaidaEmpresa}
                        onChange={(e) => handleDeslocamentoChange("hrSaidaEmpresa", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrChegadaCliente">Hr Chegada Cliente:</Label>
                      <Input
                        id="hrChegadaCliente"
                        type="time"
                        value={formData.custos.deslocamento.hrChegadaCliente}
                        onChange={(e) => handleDeslocamentoChange("hrChegadaCliente", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrSaidaCliente">Hr Saída Cliente:</Label>
                      <Input
                        id="hrSaidaCliente"
                        type="time"
                        value={formData.custos.deslocamento.hrSaidaCliente}
                        onChange={(e) => handleDeslocamentoChange("hrSaidaCliente", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrChegadaEmpresa">Hr Chegada Empresa:</Label>
                      <Input
                        id="hrChegadaEmpresa"
                        type="time"
                        value={formData.custos.deslocamento.hrChegadaEmpresa}
                        onChange={(e) => handleDeslocamentoChange("hrChegadaEmpresa", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalHorasDeslocamento">Total Hr:</Label>
                      <Input id="totalHorasDeslocamento" value={formData.custos.deslocamento.totalHoras} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalValorDeslocamento">Total R$:</Label>
                      <Input
                        id="totalValorDeslocamento"
                        value={formData.custos.deslocamento.totalValor}
                        onChange={(e) => handleDeslocamentoChange("totalValor", e.target.value)}
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
                        value={formData.custos.horaTrabalhada.hrInicio}
                        onChange={(e) => handleHoraTrabalhadaChange("hrInicio", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrTermino">Hr Término:</Label>
                      <Input
                        id="hrTermino"
                        type="time"
                        value={formData.custos.horaTrabalhada.hrTermino}
                        onChange={(e) => handleHoraTrabalhadaChange("hrTermino", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalHorasTrabalhadas">Total Hr:</Label>
                      <Input id="totalHorasTrabalhadas" value={formData.custos.horaTrabalhada.totalHoras} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalValorHoraTrabalhada">Total R$:</Label>
                      <Input
                        id="totalValorHoraTrabalhada"
                        value={formData.custos.horaTrabalhada.totalValor}
                        onChange={(e) => handleHoraTrabalhadaChange("totalValor", e.target.value)}
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
                        value={formData.custos.km.km}
                        onChange={(e) => handleKmChange("km", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorPorKm">R$/KM:</Label>
                      <Input
                        id="valorPorKm"
                        type="number"
                        step="0.01"
                        value={formData.custos.km.valorPorKm}
                        onChange={(e) => handleKmChange("valorPorKm", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="totalValorKm">Total R$:</Label>
                      <Input id="totalValorKm" value={formData.custos.km.totalValor} readOnly />
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

                  {formData.custos.materiais.length > 0 ? (
                    formData.custos.materiais.map((material, index) => (
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
                    <h3 className="text-base font-medium">Valor Total R$</h3>
                    <div className="text-xl font-bold">R$ {formData.custos.valorTotal}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/ordem-de-servico/chamados")}>
            Cancelar
          </Button>
          <Button type="button" onClick={calcularTotais}>
            Calcular Totais
          </Button>
          <Button type="button" variant="secondary" onClick={handleSaveOffline} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar offline"}
          </Button>
          <Button type="button" onClick={handleQueue} disabled={isQueueing}>
            {isQueueing ? "Enfileirando..." : "Enviar quando possível"}
          </Button>
        </div>
      </div>
    </form>
  )
}
