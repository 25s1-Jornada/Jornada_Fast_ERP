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
  pedido: string
  dataFaturamento: string
  garantia: string
  descricoes: Descricao[]
  custos: Custos
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
        // Mapeia o DTO do backend para o tipo Chamado da UI
        const mapped: Chamado[] = (data || []).map((os) => ({
          id: os.id,
          cliente: { id: os.cliente?.id || "", nome: os.cliente?.nome || "" },
          tecnico: { id: os.tecnico?.id || "", nome: os.tecnico?.nome || "" },
          dataAbertura: os.dataAbertura || "",
          dataVisita: os.dataVisita || "",
          status: os.status || "",
          pedido: os.pedido || "",
          dataFaturamento: os.dataFaturamento || "",
          garantia: os.garantia || "",
          descricoes: (os.descricoes || []).map((d: any) => ({
            id: d.id,
            numeroSerie: d.numeroSerie,
            defeito: d.defeito,
            observacao: d.observacao,
          })),
          custos: {
            deslocamento: { hrSaidaEmpresa: "", hrChegadaCliente: "", hrSaidaCliente: "", hrChegadaEmpresa: "", totalHoras: "", totalValor: "0" },
            horaTrabalhada: { hrInicio: "", hrTermino: "", totalHoras: "", totalValor: "0" },
            km: { km: "", valorPorKm: "", totalValor: "0" },
            materiais: [],
            valorTotal: (os.valorTotal || "R$ 0,00").replace(/[R$\s]/g, ""),
          },
        }))
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
        DataFaturamento: undefined,
        Pedido: chamado.pedido || undefined,
        NumeroOS: undefined,
      }

      await api.post("/api/OrdensServico", payload)

      const data = await api.get<any[]>("/api/OrdensServico/front-list")
      const mapped: Chamado[] = (data || []).map((os) => ({
        id: os.id,
        cliente: { id: os.cliente?.id || "", nome: os.cliente?.nome || "" },
        tecnico: { id: os.tecnico?.id || "", nome: os.tecnico?.nome || "" },
        dataAbertura: os.dataAbertura || "",
        dataVisita: os.dataVisita || "",
        status: os.status || "",
        pedido: os.pedido || "",
        dataFaturamento: os.dataFaturamento || "",
        garantia: os.garantia || "",
        descricoes: (os.descricoes || []).map((d: any) => ({ id: d.id, numeroSerie: d.numeroSerie, defeito: d.defeito, observacao: d.observacao })),
        custos: { deslocamento: { hrSaidaEmpresa: "", hrChegadaCliente: "", hrSaidaCliente: "", hrChegadaEmpresa: "", totalHoras: "", totalValor: "0" }, horaTrabalhada: { hrInicio: "", hrTermino: "", totalHoras: "", totalValor: "0" }, km: { km: "", valorPorKm: "", totalValor: "0" }, materiais: [], valorTotal: (os.valorTotal || "R$ 0,00").replace(/[R$\s]/g, "") },
      }))
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

