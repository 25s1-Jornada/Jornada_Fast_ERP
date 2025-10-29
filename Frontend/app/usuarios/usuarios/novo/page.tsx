import { UsuarioForm } from "../usuario-form"

export default function NovoUsuarioPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Novo Usuário</h1>
        <p className="text-muted-foreground">Preencha as informações abaixo para criar um novo usuário no sistema.</p>
      </div>

      <UsuarioForm />
    </div>
  )
}
