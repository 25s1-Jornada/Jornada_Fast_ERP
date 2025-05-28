"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ChamadosTable } from "./chamados-table"
import { ChamadoModal } from "./chamado-modal"

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

export default function ChamadosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [chamadoParaEditar, setChamadoParaEditar] = useState<Chamado | undefined>(undefined)

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

  const handleSalvarChamado = (chamado: Chamado) => {
    // Aqui você implementaria a lógica para salvar o chamado
    console.log("Chamado salvo:", chamado)
    handleCloseModal()
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

      <ChamadosTable onEditarChamado={handleEditarChamado} />

      <ChamadoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarChamado}
        chamado={chamadoParaEditar}
      />
    </div>
  )
}
