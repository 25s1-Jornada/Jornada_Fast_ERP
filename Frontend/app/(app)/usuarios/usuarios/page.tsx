"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { UsuariosTable } from "./usuarios-table"
import { UsuarioModal } from "./usuario-modal"
import type { Usuario, UsuarioFormData } from "./types"
import { api } from "@/lib/api"

type BackendUsuario = {
  id?: number
  nome: string
  telefone?: string
  email: string
  senha?: string
  perfilId?: number | null
  empresaId?: number | null
}

type BackendPerfil = { id?: number; nome: string }
type EmpresaOption = { id: string; nome: string; tipo?: string }

export default function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | undefined>(undefined)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [empresasMap, setEmpresasMap] = useState<Record<string, string>>({})
  const [empresasOptions, setEmpresasOptions] = useState<EmpresaOption[]>([])
  const [perfisMap, setPerfisMap] = useState<Record<number, "admin" | "tecnico" | "cliente">>({})
  const [perfilNomeToId, setPerfilNomeToId] = useState<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      try {
        const [usuariosApi, empresasApi, perfisApi] = await Promise.all([
          api.get<BackendUsuario[]>("/api/Usuario"),
          api.get<any[]>("/api/Empresa/lista"),
          api.get<BackendPerfil[]>("/api/Perfil"),
        ])

        // perfis
        const pIdToName: Record<number, "admin" | "tecnico" | "cliente"> = {}
        const pNameToId: Record<string, number> = {}
        for (const p of perfisApi) {
          const nome = (p.nome || "").trim().toLowerCase()
          let key: "admin" | "tecnico" | "cliente" = "cliente"
          if (nome.includes("admin")) key = "admin"
          else if (nome.includes("tec")) key = "tecnico"
          else if (nome.includes("client")) key = "cliente"
          if (typeof p.id === "number") pIdToName[p.id] = key
          if (nome) pNameToId[key] = p.id ?? pNameToId[key]
        }
        setPerfisMap(pIdToName)
        setPerfilNomeToId(pNameToId)

        // empresas
        const eMap: Record<string, string> = {}
        const eOpts: EmpresaOption[] = []
        for (const e of empresasApi) {
          const id = String(e.id ?? "")
          const nome = e.nome ?? ""
          eMap[id] = nome
          eOpts.push({ id, nome, tipo: e.tipo_empresa })
        }
        setEmpresasMap(eMap)
        setEmpresasOptions(eOpts)

        // usuarios
        const uis: Usuario[] = (usuariosApi || []).map((u) => ({
          id: (u.id ?? "").toString(),
          nome: u.nome,
          email: u.email,
          documento: undefined,
          endereco: undefined,
          perfil: (u.perfilId && pIdToName[u.perfilId]) || "cliente",
          empresaId: (u.empresaId ?? "").toString(),
          ativo: true,
          dataCriacao: undefined,
          dataAtualizacao: undefined,
        }))
        setUsuarios(uis)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const handleNovoUsuario = () => {
    setUsuarioParaEditar(undefined)
    setIsModalOpen(true)
  }

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario)
    setIsModalOpen(true)
  }

  const handleExcluirUsuario = async (id: string) => {
    if (!id) return
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return
    try {
      await api.delete(`/api/Usuario/${parseInt(id, 10)}`)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
    } catch (e) {
      console.error(e)
      alert("Falha ao excluir usuário")
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setUsuarioParaEditar(undefined)
  }

  const handleSalvarUsuario = async (usuarioData: UsuarioFormData) => {
    try {
      const perfilKey = usuarioData.perfil as "admin" | "tecnico" | "cliente"
      const perfilId = perfilNomeToId[perfilKey]
      const payload: BackendUsuario = {
        id: usuarioParaEditar?.id ? parseInt(usuarioParaEditar.id, 10) : undefined,
        nome: usuarioData.nome,
        email: usuarioData.email,
        senha: "changeme123",
        perfilId: perfilId ?? undefined,
        empresaId: usuarioData.empresaId ? parseInt(usuarioData.empresaId, 10) : undefined,
      }

      if (usuarioParaEditar?.id) {
        await api.put(`/api/Usuario/${payload.id}`, payload)
      } else {
        await api.post(`/api/Usuario`, payload)
      }

      const usuariosApi = await api.get<BackendUsuario[]>("/api/Usuario")
      const uis: Usuario[] = (usuariosApi || []).map((u) => ({
        id: (u.id ?? "").toString(),
        nome: u.nome,
        email: u.email,
        documento: undefined,
        endereco: undefined,
        perfil: (u.perfilId && perfisMap[u.perfilId]) || "cliente",
        empresaId: (u.empresaId ?? "").toString(),
        ativo: true,
        dataCriacao: undefined,
        dataAtualizacao: undefined,
      }))
      setUsuarios(uis)
      handleCloseModal()
    } catch (e) {
      console.error(e)
      alert("Falha ao salvar usuário")
    }
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

      <UsuariosTable
        onEditarUsuario={handleEditarUsuario}
        onExcluirUsuario={handleExcluirUsuario}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
        empresaNomeMap={empresasMap}
      />

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSalvar={handleSalvarUsuario}
        usuario={usuarioParaEditar}
        empresasOptions={empresasOptions}
      />
    </div>
  )
}

