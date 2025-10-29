export enum PerfilUsuario {
  ADMIN = "admin",
  TECNICO = "tecnico",
  CLIENTE = "cliente",
}

// Interface para Endereço
export interface Endereco {
  id?: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  cep: string
}

// Interface para Usuário
export interface Usuario {
  id?: string
  nome: string
  email: string
  documento?: string
  endereco?: Endereco
  perfil: PerfilUsuario
  empresaId: string
  ativo: boolean
  dataCriacao?: string
  dataAtualizacao?: string
}

// Interface para Dados de Formulário de Usuário
export interface UsuarioFormData {
  nome: string
  email: string
  documento?: string
  endereco?: Endereco
  perfil: PerfilUsuario
  empresaId: string
  ativo: boolean
}

// Dados mockados para Usuários
export const usuariosMock: Usuario[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@techsolutions.com",
    documento: "123.456.789-00",
    endereco: {
      id: "1",
      logradouro: "Rua das Palmeiras",
      numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01234-567",
    },
    perfil: PerfilUsuario.ADMIN,
    empresaId: "1",
    ativo: true,
    dataCriacao: new Date(2023, 0, 15).toISOString(),
    dataAtualizacao: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@tecmaster.com",
    documento: "987.654.321-00",
    endereco: {
      id: "2",
      logradouro: "Av. Brasil",
      numero: "500",
      bairro: "Jardim América",
      cidade: "Belo Horizonte",
      uf: "MG",
      cep: "02345-678",
    },
    perfil: PerfilUsuario.TECNICO,
    empresaId: "3",
    ativo: true,
    dataCriacao: new Date(2023, 2, 10).toISOString(),
    dataAtualizacao: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    email: "carlos@machado.ind.br",
    documento: "456.789.123-00",
    endereco: {
      id: "3",
      logradouro: "Rodovia BR-101",
      numero: "2500",
      bairro: "Distrito Industrial",
      cidade: "Joinville",
      uf: "SC",
      cep: "03456-789",
    },
    perfil: PerfilUsuario.CLIENTE,
    empresaId: "4",
    ativo: true,
    dataCriacao: new Date(2023, 3, 5).toISOString(),
    dataAtualizacao: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana.costa@eletronicos.com",
    perfil: PerfilUsuario.CLIENTE,
    empresaId: "5",
    empresa: {
      id: "5",
      nome: "Comércio Eletrônicos Ltda",
      cnpj: "56.789.012/0001-34",
      endereco_id: "5",
      tipo_empresa: "cliente" as any,
      email: "vendas@eletronicos.com",
      created_at: new Date(2023, 4, 12).toISOString(),
      updated_at: new Date(2023, 4, 12).toISOString(),
    },
    ativo: true,
    dataCriacao: new Date(2023, 4, 12).toISOString(),
    dataAtualizacao: new Date(2023, 4, 12).toISOString(),
  },
  {
    id: "5",
    nome: "Pedro Ferreira",
    email: "pedro@repsilva.com",
    documento: "789.123.456-00",
    perfil: PerfilUsuario.TECNICO,
    empresaId: "2",
    empresa: {
      id: "2",
      nome: "Representações Silva",
      cnpj: "23.456.789/0001-01",
      endereco_id: "2",
      tipo_empresa: "representante" as any,
      email: "contato@repsilva.com",
      created_at: new Date(2023, 1, 20).toISOString(),
      updated_at: new Date(2023, 1, 20).toISOString(),
    },
    ativo: false,
    dataCriacao: new Date(2023, 1, 20).toISOString(),
    dataAtualizacao: new Date(2023, 1, 20).toISOString(),
  },
]

// Labels para os perfis
export const perfilLabels = {
  [PerfilUsuario.ADMIN]: "Administrador",
  [PerfilUsuario.TECNICO]: "Técnico",
  [PerfilUsuario.CLIENTE]: "Cliente",
}
