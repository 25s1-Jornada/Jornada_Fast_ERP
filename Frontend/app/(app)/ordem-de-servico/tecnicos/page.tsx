"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TecnicosTable } from "./tecnicos-table"
import { TecnicoModal } from "./tecnico-modal"
import { api } from "@/lib/api"

interface Tecnico {
  id?: string
  nome: string
  empresa: string
  telefone: string
  email: string
  cidade: string
  uf: string
  cnpj: string
}

export default function TecnicosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tecnicoParaEditar, setTecnicoParaEditar] = useState<Tecnico | undefined>(undefined)
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])

  const loadTecnicos = useCallback(async () => {
    try {
      const data = await api.get<any[]>("/api/os/empresas?tipo=tecnico")
      const mapped: Tecnico[] = (data || []).map((item) => ({
        id: item.id?.toString(),
        nome: item.contato ?? item.nome ?? "",
        empresa: item.nome ?? "",
        telefone: item.telefone ?? "",
        email: item.email ?? "",
        cidade: item.cidade ?? "",
        uf: item.uf ?? "",
        cnpj: item.cnpj ?? "",
      }))
      setTecnicos(mapped)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    loadTecnicos()
  }, [loadTecnicos])

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

  const handleSalvarTecnico = async (tecnico: Tecnico) => {
    try {
      const payload = {
        nome: tecnico.empresa || tecnico.nome,
        contato: tecnico.nome,
        telefone: tecnico.telefone,
        email: tecnico.email,
        cidade: tecnico.cidade,
        uf: tecnico.uf,
        cnpj: tecnico.cnpj,
        tipoEmpresa: "tecnico",
      }

      if (tecnicoParaEditar?.id) {
        await api.put(`/api/os/empresas/${tecnicoParaEditar.id}?tipo=tecnico`, payload)
      } else {
        await api.post("/api/os/empresas?tipo=tecnico", payload)
      }

      await loadTecnicos()
      handleCloseModal()
    } catch (e) {
      console.error(e)
      alert("Não foi possível salvar o técnico.")
    }
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

      <TecnicosTable onEditarTecnico={handleEditarTecnico} tecnicos={tecnicos} onRefresh={loadTecnicos} />

      <TecnicoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarTecnico}
        tecnico={tecnicoParaEditar}
      />
    </div>
  )
}
