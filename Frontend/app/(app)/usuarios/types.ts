// Tipos para Endereço
export interface Endereco {
  id: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
}

// Enum para Tipo de Empresa
export enum TipoEmpresa {
  ADMIN = "admin",
  REPRESENTANTE = "representante",
  TECNICO = "tecnico",
  CLIENTE = "cliente",
}

// Tipos para Empresa
export interface Empresa {
  id: string
  nome: string
  cnpj: string
  endereco_id: string
  endereco?: Endereco
  tipo_empresa: TipoEmpresa
  email: string
  created_at: string
  updated_at: string
}

// Dados mockados para Empresas
export const empresasMock: Empresa[] = [
  {
    id: "1",
    nome: "TechSolutions Ltda",
    cnpj: "12.345.678/0001-90",
    endereco_id: "1",
    endereco: {
      id: "1",
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
    },
    tipo_empresa: TipoEmpresa.ADMIN,
    email: "contato@techsolutions.com",
    created_at: new Date(2023, 0, 15).toISOString(),
    updated_at: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "2",
    nome: "Representações Silva",
    cnpj: "23.456.789/0001-01",
    endereco_id: "2",
    endereco: {
      id: "2",
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
    tipo_empresa: TipoEmpresa.REPRESENTANTE,
    email: "contato@repsilva.com",
    created_at: new Date(2023, 1, 20).toISOString(),
    updated_at: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: "3",
    nome: "TecMaster Serviços",
    cnpj: "34.567.890/0001-12",
    endereco_id: "3",
    endereco: {
      id: "3",
      logradouro: "Av. Brasil",
      numero: "500",
      bairro: "Jardim América",
      cidade: "Belo Horizonte",
      uf: "MG",
    },
    tipo_empresa: TipoEmpresa.TECNICO,
    email: "suporte@tecmaster.com",
    created_at: new Date(2023, 2, 10).toISOString(),
    updated_at: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: "4",
    nome: "Indústrias Machado S.A.",
    cnpj: "45.678.901/0001-23",
    endereco_id: "4",
    endereco: {
      id: "4",
      logradouro: "Rodovia BR-101",
      numero: "2500",
      bairro: "Distrito Industrial",
      cidade: "Joinville",
      uf: "SC",
    },
    tipo_empresa: TipoEmpresa.CLIENTE,
    email: "compras@machado.ind.br",
    created_at: new Date(2023, 3, 5).toISOString(),
    updated_at: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: "5",
    nome: "Comércio Eletrônicos Ltda",
    cnpj: "56.789.012/0001-34",
    endereco_id: "5",
    endereco: {
      id: "5",
      logradouro: "Av. das Nações",
      numero: "789",
      bairro: "Boa Viagem",
      cidade: "Recife",
      uf: "PE",
    },
    tipo_empresa: TipoEmpresa.CLIENTE,
    email: "vendas@eletronicos.com",
    created_at: new Date(2023, 4, 12).toISOString(),
    updated_at: new Date(2023, 4, 12).toISOString(),
  },
]

// Dados mockados para Endereços
export const enderecosMock: Endereco[] = [
  {
    id: "1",
    logradouro: "Av. Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
  },
  {
    id: "2",
    logradouro: "Rua das Flores",
    numero: "123",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    uf: "RJ",
  },
  {
    id: "3",
    logradouro: "Av. Brasil",
    numero: "500",
    bairro: "Jardim América",
    cidade: "Belo Horizonte",
    uf: "MG",
  },
  {
    id: "4",
    logradouro: "Rodovia BR-101",
    numero: "2500",
    bairro: "Distrito Industrial",
    cidade: "Joinville",
    uf: "SC",
  },
  {
    id: "5",
    logradouro: "Av. das Nações",
    numero: "789",
    bairro: "Boa Viagem",
    cidade: "Recife",
    uf: "PE",
  },
]

// Lista de UFs brasileiras
export const ufs = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]
