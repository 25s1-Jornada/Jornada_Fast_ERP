import { UsuarioForm } from "../usuario-form"
import type { Usuario, PerfilUsuario } from "../types"

// Dados mockados para exemplo
const usuarioMock: Usuario = {
  id: "1",
  nome: "João Silva",
  email: "joao.silva@fastcom.com.br",
  documento: "123.456.789-00",
  perfil: "admin" as PerfilUsuario,
  empresaId: "1",
  ativo: true,
  dataCriacao: "2024-01-15",
  endereco: {
    logradouro: "Rua das Flores",
    numero: "123",
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01234-567",
  },
}

interface EditarUsuarioPageProps {
  params: {
    id: string
  }
}

export default function EditarUsuarioPage({ params }: EditarUsuarioPageProps) {
  // Em produção, você buscaria o usuário pela API usando o params.id
  const usuario = usuarioMock

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar Usuário</h1>
        <p className="text-muted-foreground">Atualize as informações do usuário {usuario.nome}.</p>
      </div>

      <UsuarioForm usuario={usuario} />
    </div>
  )
}
