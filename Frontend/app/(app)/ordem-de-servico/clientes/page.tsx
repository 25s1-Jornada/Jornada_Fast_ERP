"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ClientesTable } from "./clientes-table"
import { ClienteModal } from "./cliente-modal"
import { api } from "@/lib/api"

interface Cliente {
  id?: string
  nome: string
  contato: string
  telefone: string
  email: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cnpj: string
}

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | undefined>(undefined)
  const [clientes, setClientes] = useState<Cliente[]>([])

  const loadClientes = useCallback(async () => {
    try {
      const data = await api.get<any[]>("/api/os/empresas?tipo=cliente")
      const mapped: Cliente[] = (data || []).map((cliente) => ({
        id: cliente.id?.toString(),
        nome: cliente.nome ?? "",
        contato: cliente.contato ?? "",
        telefone: cliente.telefone ?? "",
        email: cliente.email ?? "",
        endereco: cliente.endereco ?? "",
        numero: cliente.numero ?? "",
        bairro: cliente.bairro ?? "",
        cidade: cliente.cidade ?? "",
        uf: cliente.uf ?? "",
        cnpj: cliente.cnpj ?? "",
      }))
      setClientes(mapped)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    loadClientes()
  }, [loadClientes])

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

  const handleSalvarCliente = async (cliente: Cliente) => {
    try {
      const payload = {
        nome: cliente.nome,
        contato: cliente.contato,
        telefone: cliente.telefone,
        email: cliente.email,
        cnpj: cliente.cnpj,
        endereco: cliente.endereco,
        numero: cliente.numero,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        uf: cliente.uf,
        cnpj: cliente.cnpj,
        tipoEmpresa: "cliente",
      }

      if (clienteParaEditar?.id) {
        await api.put(`/api/os/empresas/${clienteParaEditar.id}?tipo=cliente`, payload)
      } else {
        await api.post("/api/os/empresas?tipo=cliente", payload)
      }

      await loadClientes()
      handleCloseModal()
    } catch (e) {
      console.error(e)
      alert("Não foi possível salvar o cliente.")
    }
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

      <ClientesTable onEditarCliente={handleEditarCliente} clientes={clientes} />

      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarCliente}
        cliente={clienteParaEditar}
      />
    </div>
  )
}
