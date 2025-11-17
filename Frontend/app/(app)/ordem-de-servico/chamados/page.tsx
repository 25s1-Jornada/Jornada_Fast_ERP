"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ChamadosTable } from "./chamados-table"
import { ChamadoModal } from "./chamado-modal"
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
  categoriaId: string
  observacao: string
}

interface Material {
  id: string
  material: string
  quantidade: string
  valorUnitario: string
  totalValor: string
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
  custosServico: {
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
  }[]
  valorTotal: string
  descricaoDefeito?: any
  descricaoDefeitoId?: number
}

const createDefaultCustoServico = (valorTotal = "0") => ({
  id: `custo-${Date.now()}`,
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
  subtotal: valorTotal,
})

// Converte DTO de DescricaoDefeito em shape esperado pelo formulário
const mapDefeitoDtoToForm = (dto: any) => {
  if (!dto) return undefined
  const numeroSerie = dto.numeroSerie ?? dto.NumeroSerie ?? ""
  const observacao = dto.observacao ?? dto.Observacao ?? ""
  const pendencia = dto.pendencia ?? dto.Pendencia
  const servicoFinalizado = pendencia === true ? false : pendencia === false ? true : null
  return {
    confirmacaoAtendimento: {
      data: new Date().toISOString().split("T")[0],
      nomeLegivel: "",
      telefone: "",
    },
    equipamentos: [
      {
        id: dto.id ? `eq-${dto.id}` : `eq-${Date.now()}`,
        numeroSerie,
        categoriaProblema: "", // não temos categoria detalhada aqui
        defeitos: {
          refrigeracao: {},
          iluminacao: {},
          estrutura: {},
          outros: {},
        },
        observacoes: observacao,
      },
    ],
    servicoFinalizado,
    pendencia: observacao,
  }
}

// Normaliza propriedades (camelCase/PascalCase) vindas do backend
const normalizeOs = (os: any, defeitosLookup: Record<number, any> = {}): Chamado => {
  const rawValor = (os.valorTotal ?? os.ValorTotal) as string | number | undefined
  const valorNumber =
    typeof rawValor === "number"
      ? rawValor
      : parseFloat(String(rawValor ?? "0").replace(/[^\d,.-]/g, "").replace(",", ".") || "0") || 0

  const descricoes = (os.descricoes ?? os.Descricoes ?? []).map((d: any) => ({
    id: (d.id ?? d.Id ?? "").toString(),
    numeroSerie: d.numeroSerie ?? d.NumeroSerie ?? "",
    categoriaId: (d.categoriaId ?? d.CategoriaId ?? "").toString(),
    observacao: d.observacao ?? d.Observacao ?? "",
  }))

  return {
    id: (os.id ?? os.Id ?? "").toString(),
    cliente: { id: (os.cliente?.id ?? os.Cliente?.Id ?? "").toString(), nome: os.cliente?.nome ?? os.Cliente?.Nome ?? "" },
    tecnico: { id: (os.tecnico?.id ?? os.Tecnico?.Id ?? "").toString(), nome: os.tecnico?.nome ?? os.Tecnico?.Nome ?? "" },
    dataAbertura: os.dataAbertura ?? os.DataAbertura ?? "",
    dataVisita: os.dataVisita ?? os.DataVisita ?? "",
    status: os.status ?? os.Status ?? "aberto",
    pedido: os.pedido ?? os.Pedido ?? "",
    dataFaturamento: os.dataFaturamento ?? os.DataFaturamento ?? "",
    garantia: os.garantia ?? os.Garantia ?? "",
    descricoes,
    custosServico: [createDefaultCustoServico(valorNumber.toString())],
    valorTotal: valorNumber.toString(),
    descricaoDefeito: defeitosLookup[Number(os.Id ?? os.id)]?.form,
    descricaoDefeitoId: defeitosLookup[Number(os.Id ?? os.id)]?.id,
  }
}

export default function ChamadosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [chamadoParaEditar, setChamadoParaEditar] = useState<Chamado | undefined>(undefined)
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<any[]>("/api/OrdensServico/front-list")
        const mapped: Chamado[] = (data || []).map((os) => normalizeOs(os))
        setChamados(mapped)
        setRefreshKey((k) => k + 1)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const handleNovoChamado = () => {
    setChamadoParaEditar(undefined)
    setIsModalOpen(true)
  }

  const handleEditarChamado = (chamado: Chamado) => {
    setChamadoParaEditar(chamado)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setChamadoParaEditar(undefined)
  }

  const handleSalvarChamado = async (chamado: Chamado) => {
    try {
      const clientId = Number(chamado.cliente?.id)
      const tecnicoId = chamado.tecnico?.id ? Number(chamado.tecnico.id) : undefined

      if (!clientId || Number.isNaN(clientId)) {
        alert("Selecione um cliente válido antes de salvar o chamado.")
        return
      }

      const payload = {
        ClientId: clientId,
        TecnicoId: tecnicoId && !Number.isNaN(tecnicoId) ? tecnicoId : undefined,
        DataAbertura: chamado.dataAbertura ? new Date(chamado.dataAbertura) : new Date(),
        StatusId: undefined,
        GarantiaId: undefined,
        DataFaturamento: chamado.dataFaturamento ? new Date(chamado.dataFaturamento) : undefined,
        Pedido: chamado.pedido || undefined,
        NumeroOS: chamado.id,
      }

      let OrdemServicoId: number | undefined

      if (chamado.id) {
        await api.put(`/api/OrdensServico/${chamado.id}`, payload)
        OrdemServicoId = Number(chamado.id)
      } else {
        const created = await api.post("/api/OrdensServico", payload)
        OrdemServicoId = Number(created?.id ?? created?.Id ?? created?.data?.id ?? created?.data?.Id)
      }

      // Se não obtivermos id, aborta fluxo dependente
      if (!OrdemServicoId || Number.isNaN(OrdemServicoId) || OrdemServicoId <= 0) {
        throw new Error("Não foi possível obter o ID da OS criada.")
      }

      // Se estamos editando, apaga descrições existentes para não duplicar
      if (chamado.id) {
        try {
          const existing = await api.get<any[]>("/api/DescricoesDoChamado?includeRelacionamentos=false")
          const toDelete = (existing || []).filter(
            (d) => Number(d.ordemServicoId ?? d.OrdemServicoId ?? d.ordemId ?? d.OrdemId) === OrdemServicoId,
          )
          if (toDelete.length > 0) {
            await Promise.all(
              toDelete.map((d) => api.delete(`/api/DescricoesDoChamado/${d.id ?? d.Id ?? ""}`)),
            )
          }
        } catch (err) {
          console.error("Falha ao limpar descrições antigas", err)
        }
      }

      // Salvar descrições do chamado (apenas IDs de categoria)
      const descricoesPayload = (chamado.descricoes || []).map((d) => ({
        NumeroSerie: d.numeroSerie || undefined,
        CategoriaId: d.categoriaId ? Number(d.categoriaId) : undefined,
        Observacao: d.observacao || undefined,
        OrdemServicoId: OrdemServicoId,
      }))
      if (descricoesPayload.length > 0) {
        await Promise.all(descricoesPayload.map((body) => api.post("/api/DescricoesDoChamado", body)))
      }

      // Salvar descrição de defeito (pega o primeiro equipamento do formulário de defeito)
      const defeitoForm = (chamado as any).descricaoDefeito
      const eq0 = defeitoForm?.equipamentos?.[0]
      if (defeitoForm && OrdemServicoId) {
        await api.post("/api/DescricoesDefeito", {
          NumeroSerie: eq0?.numeroSerie || undefined,
          Observacao: eq0?.observacoes || defeitoForm?.pendencia || undefined,
          Pendencia: defeitoForm?.servicoFinalizado === false ? true : defeitoForm?.servicoFinalizado ?? null,
          CategoriaId: undefined,
          OrdemServicoId,
        })
      }

      // Salvar custo principal (valorTotal)
      const valorTotalNumber = parseFloat(chamado.valorTotal || "0") || 0
      await api.post("/api/Custos", {
        OrdemServicoId: OrdemServicoId,
        ValorTotal: valorTotalNumber,
        AjudanteName: "",
        TecnicoId: tecnicoId && !Number.isNaN(tecnicoId) ? tecnicoId : undefined,
        dataVisita: chamado.dataVisita ? new Date(chamado.dataVisita) : undefined,
      })

      const data = await api.get<any[]>("/api/OrdensServico/front-list")
      const mapped: Chamado[] = (data || []).map((os) => normalizeOs(os))
      setChamados(mapped)
      setRefreshKey((prev) => prev + 1)
      handleCloseModal()
    } catch (e) {
      console.error(e)
      alert("Falha ao salvar chamado")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chamados</h1>
        <Button onClick={handleNovoChamado}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      <ChamadosTable key={refreshKey} onEditarChamado={handleEditarChamado} chamadosExternos={chamados} />

      <ChamadoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarChamado}
        chamado={chamadoParaEditar}
      />
    </div>
  )
}


