"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { EnderecoModal } from "../endereco-modal-fixed"
import { MapPin, User, Mail, FileText, Building2, Shield } from "lucide-react"
import type { Usuario, UsuarioFormData, PerfilUsuario, Endereco } from "./types"

// Dados mockados das empresas (em produção viria de uma API)
const empresasMock = [
  { id: "1", nome: "Fast Com Tecnologia", tipo: "Administradora" },
  { id: "2", nome: "TechService Ltda", tipo: "Representante" },
  { id: "3", nome: "Assistência Técnica ABC", tipo: "Técnico" },
  { id: "4", nome: "Cliente Empresa XYZ", tipo: "Cliente" },
  { id: "5", nome: "Refrigeração Total", tipo: "Técnico" },
]

interface UsuarioFormProps {
  usuario?: Usuario
}

export function UsuarioForm({ usuario }: UsuarioFormProps) {
  const router = useRouter()
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false)

  const [formData, setFormData] = useState<UsuarioFormData>({
    nome: "",
    email: "",
    documento: "",
    endereco: undefined,
    perfil: "cliente" as PerfilUsuario,
    empresaId: "",
    ativo: true,
  })

  // Inicializar dados do formulário quando usuario prop mudar
  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        documento: usuario.documento || "",
        endereco: usuario.endereco,
        perfil: usuario.perfil,
        empresaId: usuario.empresaId,
        ativo: usuario.ativo,
      })
    }
  }, [usuario])

  const handleChange = (field: keyof UsuarioFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEnderecoSave = (endereco: Endereco) => {
    setFormData((prev) => ({ ...prev, endereco }))
    setIsEnderecoModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!formData.nome.trim()) {
      alert("Nome é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      alert("Email é obrigatório")
      return
    }

    if (!formData.empresaId) {
      alert("Empresa é obrigatória")
      return
    }

    // Aqui você implementaria a lógica para salvar o usuário
    console.log("Dados do usuário:", formData)

    // Redireciona para a lista de usuários
    router.push("/usuarios/usuarios")
  }

  const getPerfilLabel = (perfil: PerfilUsuario) => {
    const labels = {
      admin: "Administrador",
      tecnico: "Técnico",
      cliente: "Cliente",
    }
    return labels[perfil]
  }

  const getPerfilColor = (perfil: PerfilUsuario) => {
    const colors = {
      admin: "text-red-600",
      tecnico: "text-blue-600",
      cliente: "text-gray-600",
    }
    return colors[perfil]
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {usuario ? "Editar Usuário" : "Novo Usuário"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome *
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Nome completo do usuário"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documento" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documento
              </Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => handleChange("documento", e.target.value)}
                placeholder="CPF, RG ou CNPJ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfil" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Perfil *
              </Label>
              <Select value={formData.perfil} onValueChange={(value) => handleChange("perfil", value as PerfilUsuario)}>
                <SelectTrigger id="perfil">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <span className="text-red-600 font-medium">Administrador</span>
                  </SelectItem>
                  <SelectItem value="tecnico">
                    <span className="text-blue-600 font-medium">Técnico</span>
                  </SelectItem>
                  <SelectItem value="cliente">
                    <span className="text-gray-600 font-medium">Cliente</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Empresa *
              </Label>
              <Select value={formData.empresaId} onValueChange={(value) => handleChange("empresaId", value)}>
                <SelectTrigger id="empresa">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasMock.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      <div>
                        <div className="font-medium">{empresa.nome}</div>
                        <div className="text-sm text-muted-foreground">{empresa.tipo}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch checked={formData.ativo} onCheckedChange={(checked) => handleChange("ativo", checked)} />
                <span className={formData.ativo ? "text-green-600" : "text-red-600"}>
                  {formData.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEnderecoModalOpen(true)}>
                {formData.endereco ? "Editar Endereço" : "Adicionar Endereço"}
              </Button>
            </div>

            {formData.endereco && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">
                    {formData.endereco.logradouro}, {formData.endereco.numero}
                  </div>
                  {formData.endereco.complemento && (
                    <div className="text-muted-foreground">{formData.endereco.complemento}</div>
                  )}
                  <div className="text-muted-foreground">
                    {formData.endereco.bairro} - {formData.endereco.cidade}/{formData.endereco.uf}
                  </div>
                  <div className="text-muted-foreground">CEP: {formData.endereco.cep}</div>
                </div>
              </div>
            )}
          </div>

          {/* Resumo do Perfil */}
          {formData.perfil && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm">
                <div className="font-medium">Resumo do Perfil</div>
                <div className={`${getPerfilColor(formData.perfil)} font-medium`}>
                  {getPerfilLabel(formData.perfil)}
                </div>
                <div className="text-muted-foreground mt-1">
                  {formData.perfil === "admin" && "Acesso total ao sistema, pode gerenciar usuários e configurações"}
                  {formData.perfil === "tecnico" && "Acesso a chamados, ordens de serviço e estoque"}
                  {formData.perfil === "cliente" && "Acesso limitado aos próprios chamados e informações"}
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/usuarios/usuarios")}>
              Cancelar
            </Button>
            <Button type="submit">{usuario ? "Atualizar" : "Criar"} Usuário</Button>
          </div>
        </CardContent>
      </Card>

      <EnderecoModal
        isOpen={isEnderecoModalOpen}
        onClose={() => setIsEnderecoModalOpen(false)}
        onSalvar={handleEnderecoSave}
        endereco={formData.endereco}
      />
    </form>
  )
}
