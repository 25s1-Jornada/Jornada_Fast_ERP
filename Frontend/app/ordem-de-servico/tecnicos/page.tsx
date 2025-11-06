"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TecnicosTable } from "./tecnicos-table"
import { TecnicoModal } from "./tecnico-modal"

interface Tecnico {
  id?: string
  nome: string
  empresa: string
  telefone: string
  email: string
  cidade: string
  uf: string
}

export default function TecnicosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tecnicoParaEditar, setTecnicoParaEditar] = useState<Tecnico | undefined>(undefined)
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])

  const handleNovoTecnico = () => {
    setTecnicoParaEditar(undefined)
    setIsModalOpen(true)
  }

  const handleEditarTecnico = (tecnico: Tecnico) => {
    setTecnicoParaEditar(tecnico)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTecnicoParaEditar(undefined)
  }

  const handleSalvarTecnico = (tecnico: Tecnico) => {
    if (tecnicoParaEditar?.id) {
      // Editing existing tecnico
      setTecnicos((prev) => prev.map((t) => (t.id === tecnico.id ? tecnico : t)))
    } else {
      // Adding new tecnico
      const novoTecnico = { ...tecnico, id: Date.now().toString() }
      setTecnicos((prev) => [...prev, novoTecnico])
    }
    handleCloseModal()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Técnicos</h1>
        <Button onClick={handleNovoTecnico}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Técnico
        </Button>
      </div>

      <TecnicosTable onEditarTecnico={handleEditarTecnico} tecnicos={tecnicos} setTecnicos={setTecnicos} />

      <TecnicoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarTecnico}
        tecnico={tecnicoParaEditar}
      />
    </div>
  )
}
