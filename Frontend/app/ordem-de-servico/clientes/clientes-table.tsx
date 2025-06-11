"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, RefreshCw } from "lucide-react"
import { FiltroAvancado, type FiltroConfig, type FiltroValores } from "@/components/filtro-avancado"
import { Ordenacao } from "@/components/ordenacao"

interface Cliente {
  id: string
  nome: string
  contato: string
  telefone: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  codigo: string
}

interface ClientesTableProps {
  onEditarCliente: (cliente: Cliente) => void
}

// Dados de exemplo expandidos para clientes
const clientesIniciais: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    contato: "Maria Silva",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Flores",
    numero: "123",
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
    codigo: "CLI001",
  },
  {
    id: "2",
    nome: "Empresa ABC Ltda",
    contato: "Carlos Souza",
    telefone: "(11) 91234-5678",
    endereco: "Av. Paulista",
    numero: "1500",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
    codigo: "CLI002",
  },
  {
    id: "3",
    nome: "Comércio XYZ",
    contato: "Ana Oliveira",
    telefone: "(21) 98888-7777",
    endereco: "Rua do Comércio",
    numero: "45",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    codigo: "CLI003",
  },
  {
    id: "4",
    nome: "Restaurante Bom Sabor",
    contato: "Pedro Santos",
    telefone: "(31) 99999-8888",
    endereco: "Av. Afonso Pena",
    numero: "789",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    uf: "MG",
    codigo: "CLI004",
  },
  {
    id: "5",
    nome: "Supermercado Central",
    contato: "Lucia Costa",
    telefone: "(41) 97777-6666",
    endereco: "Rua XV de Novembro",
    numero: "456",
    bairro: "Centro",
    cidade: "Curitiba",
    uf: "PR",
    codigo: "CLI005",
  },
  {
    id: "6",
    nome: "Hotel Vista Mar",
    contato: "Roberto Lima",
    telefone: "(48) 96666-5555",
    endereco: "Av. Beira Mar",
    numero: "321",
    bairro: "Centro",
    cidade: "Florianópolis",
    uf: "SC",
    codigo: "CLI006",
  },
  {
    id: "7",
    nome: "Padaria Pão Dourado",
    contato: "Marina Alves",
    telefone: "(71) 95555-4444",
    endereco: "Rua da Padaria",
    numero: "654",
    bairro: "Pelourinho",
    cidade: "Salvador",
    uf: "BA",
    codigo: "CLI007",
  },
  {
    id: "8",
    nome: "Clínica Saúde Total",
    contato: "Dr. Fernando",
    telefone: "(85) 94444-3333",
    endereco: "Av. Dom Luís",
    numero: "987",
    bairro: "Meireles",
    cidade: "Fortaleza",
    uf: "CE",
    codigo: "CLI008",
  },
]

// Configuração dos filtros para clientes
const configuracaoFiltros: FiltroConfig[] = [
  {
    campo: "busca_geral",
    label: "Busca Geral",
    tipo: "texto",
    placeholder: "Nome, código, contato ou telefone...",
  },
  {
    campo: "codigo",
    label: "Código do Cliente",
    tipo: "texto",
    placeholder: "CLI001, CLI002...",
  },
  {
    campo: "uf",
    label: "Estado (UF)",
    tipo: "multiselect",
    opcoes: [
      { value: "SP", label: "São Paulo" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "MG", label: "Minas Gerais" },
      { value: "PR", label: "Paraná" },
      { value: "SC", label: "Santa Catarina" },
      { value: "BA", label: "Bahia" },
      { value: "CE", label: "Ceará" },
      { value: "RS", label: "Rio Grande do Sul" },
      { value: "ES", label: "Espírito Santo" },
      { value: "GO", label: "Goiás" },
      { value: "DF", label: "Distrito Federal" },
    ],
  },
  {
    campo: "cidade",
    label: "Cidade",
    tipo: "multiselect",
    opcoes: [
      { value: "São Paulo", label: "São Paulo" },
      { value: "Rio de Janeiro", label: "Rio de Janeiro" },
      { value: "Belo Horizonte", label: "Belo Horizonte" },
      { value: "Curitiba", label: "Curitiba" },
      { value: "Florianópolis", label: "Florianópolis" },
      { value: "Salvador", label: "Salvador" },
      { value: "Fortaleza", label: "Fortaleza" },
    ],
  },
  {
    campo: "bairro",
    label: "Bairro",
    tipo: "select",
    opcoes: [
      { value: "Centro", label: "Centro" },
      { value: "Bela Vista", label: "Bela Vista" },
      { value: "Pelourinho", label: "Pelourinho" },
      { value: "Meireles", label: "Meireles" },
    ],
  },
  {
    campo: "tipo_cliente",
    label: "Tipo de Cliente",
    tipo: "select",
    opcoes: [
      { value: "pessoa_fisica", label: "Pessoa Física" },
      { value: "pessoa_juridica", label: "Pessoa Jurídica" },
    ],
  },
]

// Campos disponíveis para ordenação
const camposOrdenacao = [
  { value: "codigo", label: "Código" },
  { value: "nome", label: "Nome" },
  { value: "cidade", label: "Cidade" },
  { value: "uf", label: "Estado" },
  { value: "contato", label: "Contato" },
]

export function ClientesTable({ onEditarCliente }: ClientesTableProps) {
  const [clientes, setClientes] = useState(clientesIniciais)
  const [filtros, setFiltros] = useState<FiltroValores>({})
  const [ordenacao, setOrdenacao] = useState({ campo: "nome", direcao: "asc" as "asc" | "desc" })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filtrosSalvos, setFiltrosSalvos] = useState<{ nome: string; filtro: FiltroValores }[]>([])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Aplicar filtros e ordenação
  const clientesFiltrados = useMemo(() => {
    let resultado = [...clientes]

    // Aplicar filtros
    Object.entries(filtros).forEach(([campo, valor]) => {
      if (!valor || (Array.isArray(valor) && valor.length === 0)) return

      switch (campo) {
        case "busca_geral":
          if (typeof valor === "string" && valor.trim()) {
            resultado = resultado.filter(
              (cliente) =>
                cliente.nome.toLowerCase().includes(valor.toLowerCase()) ||
                cliente.codigo.toLowerCase().includes(valor.toLowerCase()) ||
                cliente.contato.toLowerCase().includes(valor.toLowerCase()) ||
                cliente.telefone.includes(valor),
            )
          }
          break

        case "codigo":
          if (typeof valor === "string" && valor.trim()) {
            resultado = resultado.filter((cliente) => cliente.codigo.toLowerCase().includes(valor.toLowerCase()))
          }
          break

        case "uf":
          if (Array.isArray(valor) && valor.length > 0) {
            resultado = resultado.filter((cliente) => valor.includes(cliente.uf))
          }
          break

        case "cidade":
          if (Array.isArray(valor) && valor.length > 0) {
            resultado = resultado.filter((cliente) => valor.includes(cliente.cidade))
          }
          break

        case "bairro":
          if (typeof valor === "string" && valor.trim()) {
            resultado = resultado.filter((cliente) => cliente.bairro === valor)
          }
          break

        case "tipo_cliente":
          if (typeof valor === "string" && valor.trim()) {
            resultado = resultado.filter((cliente) => {
              const isPessoaJuridica =
                cliente.nome.includes("Ltda") ||
                cliente.nome.includes("S.A.") ||
                cliente.nome.includes("ME") ||
                cliente.nome.includes("Empresa") ||
                cliente.nome.includes("Comércio") ||
                cliente.nome.includes("Restaurante") ||
                cliente.nome.includes("Supermercado") ||
                cliente.nome.includes("Hotel") ||
                cliente.nome.includes("Padaria") ||
                cliente.nome.includes("Clínica")

              return valor === "pessoa_juridica" ? isPessoaJuridica : !isPessoaJuridica
            })
          }
          break
      }
    })

    // Aplicar ordenação
    resultado.sort((a, b) => {
      let valorA: any = a[ordenacao.campo as keyof Cliente]
      let valorB: any = b[ordenacao.campo as keyof Cliente]

      if (typeof valorA === "string") valorA = valorA.toLowerCase()
      if (typeof valorB === "string") valorB = valorB.toLowerCase()

      if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1
      if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1
      return 0
    })

    return resultado
  }, [clientes, filtros, ordenacao])

  const handleSalvarFiltro = (nome: string, filtro: FiltroValores) => {
    const novosFiltros = [...filtrosSalvos, { nome, filtro }]
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_clientes", JSON.stringify(novosFiltros))
  }

  const handleCarregarFiltro = (filtro: FiltroValores) => {
    setFiltros(filtro)
  }

  const handleExcluirFiltro = (nome: string) => {
    const novosFiltros = filtrosSalvos.filter((f) => f.nome !== nome)
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_clientes", JSON.stringify(novosFiltros))
  }

  return (
    <div className="space-y-4">
      <FiltroAvancado
        configuracao={configuracaoFiltros}
        valores={filtros}
        onFiltroChange={setFiltros}
        totalResultados={clientesFiltrados.length}
        onSalvarFiltro={handleSalvarFiltro}
        onCarregarFiltro={handleCarregarFiltro}
        filtrosSalvos={filtrosSalvos}
        onExcluirFiltro={handleExcluirFiltro}
        acoesDireita={
          <div className="flex gap-2">
            <Ordenacao
              camposOrdenacao={camposOrdenacao}
              ordenacaoAtual={ordenacao}
              onOrdenacaoChange={(campo, direcao) => setOrdenacao({ campo, direcao })}
            />
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Atualizar</span>
            </Button>
          </div>
        }
      />

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cód. Cliente</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Contato</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="hidden lg:table-cell">UF</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.codigo}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{cliente.contato}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{cliente.contato}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.telefone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{cliente.cidade}</TableCell>
                  <TableCell className="hidden lg:table-cell">{cliente.uf}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onEditarCliente(cliente)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
