"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ClientesTable } from "./clientes-table"
import { ClienteModal } from "./cliente-modal"

interface Cliente {
  id?: string
  nome: string
  contato: string
  telefone: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  codigo: string
  pedido: string
  dataFaturamento: string
  garantia: string
}

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | undefined>(undefined)

  const handleNovoCliente = () => {
    setClienteParaEditar(undefined)
    setIsModalOpen(true)
  }

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteParaEditar(cliente)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setClienteParaEditar(undefined)
  }

  const handleSalvarCliente = (cliente: Cliente) => {
    // Aqui você implementaria a lógica para salvar o cliente
    console.log("Cliente salvo:", cliente)
    handleCloseModal()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={handleNovoCliente}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <ClientesTable onEditarCliente={handleEditarCliente} />

      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarCliente}
        cliente={clienteParaEditar}
      />
    </div>
  )
}
