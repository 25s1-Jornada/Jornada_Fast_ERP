"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { UsuariosTable } from "./usuarios-table"
import { UsuarioModal } from "./usuario-modal"
import type { Usuario, UsuarioFormData } from "./types"

export default function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | undefined>(undefined)

  const handleNovoUsuario = () => {
    setUsuarioParaEditar(undefined)
    setIsModalOpen(true)
  }

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario)
    setIsModalOpen(true)
  }

  const handleExcluirUsuario = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      // Aqui você implementaria a lógica para excluir o usuário
      console.log("Excluir usuário:", id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setUsuarioParaEditar(undefined)
  }

  const handleSalvarUsuario = (usuarioData: UsuarioFormData) => {
    // Aqui você implementaria a lógica para salvar o usuário
    console.log("Usuário salvo:", usuarioData)
    handleCloseModal()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button onClick={handleNovoUsuario}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <UsuariosTable onEditarUsuario={handleEditarUsuario} onExcluirUsuario={handleExcluirUsuario} />

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarUsuario}
        usuario={usuarioParaEditar}
      />
    </div>
  )
}
