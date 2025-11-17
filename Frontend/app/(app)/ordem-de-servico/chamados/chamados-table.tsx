"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FiltroAvancadoModal, type FiltroConfig, type FiltroValores } from "@/components/filtro-avancado-modal"
import { Ordenacao } from "@/components/ordenacao"

// Tipos para os dados do chamado
interface Cliente {
  id: string
  nome: string
}

interface Tecnico {
  id: string
  nome: string
}

interface Descricao {
  id: string
  numeroSerie: string
  categoriaId: string
  observacao: string
}

interface Material {
  id: string
  material: string
  quantidade: string
  valorUnitario: string
  totalValor: string
}

interface CustoServico {
  id: string
  nome: string
  deslocamento: {
    hrSaidaEmpresa: string
    hrChegadaCliente: string
    hrSaidaCliente: string
    hrChegadaEmpresa: string
    totalHoras: string
    totalValor: string
  }
  horaTrabalhada: {
    hrInicio: string
    hrTermino: string
    totalHoras: string
    totalValor: string
  }
  km: {
    km: string
    valorPorKm: string
    totalValor: string
  }
  materiais: Material[]
  subtotal: string
}

export interface Chamado {
  id: string
  cliente: Cliente
  tecnico: Tecnico
  dataAbertura: string
  dataVisita: string
  status: string
  pedido: string
  dataFaturamento: string
  garantia: string
  descricoes: Descricao[]
  custosServico: CustoServico[]
  valorTotal: string
}

export type OrdenacaoChamado = { campo: string; direcao: "asc" | "desc" }

interface ChamadosTableProps {
  onEditarChamado: (chamado: Chamado) => void
  chamadosExternos?: Chamado[]
}

// Configuração dos filtros para chamados com categorias
const configuracaoFiltros: FiltroConfig[] = [
  {
    campo: "busca_geral",
    label: "Busca Geral",
    tipo: "texto",
    placeholder: "Cliente, técnico, defeito...",
    categoria: "geral",
  },
  {
    campo: "status",
    label: "Status",
    tipo: "multiselect",
    categoria: "geral",
    opcoes: [
      { value: "aberto", label: "Aberto" },
      { value: "em_andamento", label: "Em Andamento" },
      { value: "concluido", label: "Concluído" },
    ],
  },
  {
    campo: "defeito",
    label: "Tipo de Defeito",
    tipo: "multiselect",
    categoria: "geral",
    opcoes: [
      { value: "Refrigeração", label: "Refrigeração" },
      { value: "Iluminação", label: "Iluminação" },
      { value: "Estrutura", label: "Estrutura" },
    ],
  },
  {
    campo: "cliente",
    label: "Cliente",
    tipo: "multiselect",
    categoria: "pessoas",
    opcoes: [
      { value: "João Silva", label: "João Silva" },
      { value: "Empresa ABC Ltda", label: "Empresa ABC Ltda" },
      { value: "Comércio XYZ", label: "Comércio XYZ" },
      { value: "Restaurante Bom Sabor", label: "Restaurante Bom Sabor" },
      { value: "Supermercado Central", label: "Supermercado Central" },
      { value: "Hotel Vista Mar", label: "Hotel Vista Mar" },
      { value: "Padaria Pão Dourado", label: "Padaria Pão Dourado" },
      { value: "Clínica Saúde Total", label: "Clínica Saúde Total" },
    ],
  },
  {
    campo: "tecnico",
    label: "Técnico",
    tipo: "multiselect",
    categoria: "pessoas",
    opcoes: [
      { value: "Carlos Oliveira", label: "Carlos Oliveira" },
      { value: "Ana Silva", label: "Ana Silva" },
      { value: "Roberto Santos", label: "Roberto Santos" },
      { value: "Marina Costa", label: "Marina Costa" },
      { value: "Pedro Almeida", label: "Pedro Almeida" },
    ],
  },
  {
    campo: "data_abertura",
    label: "Data de Abertura",
    tipo: "intervalo_data",
    categoria: "datas",
  },
  {
    campo: "data_visita",
    label: "Data da Visita",
    tipo: "intervalo_data",
    categoria: "datas",
  },
  {
    campo: "valor_minimo",
    label: "Valor Mínimo (R$)",
    tipo: "numero",
    placeholder: "0.00",
    categoria: "valores",
  },
  {
    campo: "valor_maximo",
    label: "Valor Máximo (R$)",
    tipo: "numero",
    placeholder: "9999.99",
    categoria: "valores",
  },
]

// Campos disponíveis para ordenação
const camposOrdenacao = [
  { value: "id", label: "ID" },
  { value: "cliente", label: "Cliente" },
  { value: "tecnico", label: "Técnico" },
  { value: "dataAbertura", label: "Data Abertura" },
  { value: "dataVisita", label: "Data Visita" },
  { value: "status", label: "Status" },
  { value: "valorTotal", label: "Valor Total" },
]

// Dados iniciais vazios: serão preenchidos por chamadosExternos via props
const chamadosIniciais: Chamado[] = []

export {
  configuracaoFiltros as filtrosChamadosConfig,
  camposOrdenacao as camposOrdenacaoChamados,
  chamadosIniciais as chamadosMock,
}

export function filtrarChamados(
  chamados: Chamado[],
  filtros: FiltroValores,
  ordenacao: OrdenacaoChamado = { campo: "id", direcao: "asc" },
) {
  let resultado = [...chamados]

  Object.entries(filtros).forEach(([campo, valor]) => {
    if (!valor || (Array.isArray(valor) && valor.length === 0)) return

    switch (campo) {
      case "cliente_rapido":
      case "cliente_texto":
        if (typeof valor === "string" && valor.trim()) {
          resultado = resultado.filter((chamado) => chamado.cliente.nome.toLowerCase().includes(valor.toLowerCase()))
        }
        break

      case "tecnico_rapido":
      case "tecnico_texto":
        if (typeof valor === "string" && valor.trim()) {
          resultado = resultado.filter((chamado) => chamado.tecnico.nome.toLowerCase().includes(valor.toLowerCase()))
        }
        break
      case "busca_geral":
        if (typeof valor === "string" && valor.trim()) {
          resultado = resultado.filter(
            (chamado) =>
              chamado.cliente.nome.toLowerCase().includes(valor.toLowerCase()) ||
              chamado.tecnico.nome.toLowerCase().includes(valor.toLowerCase()) ||
              chamado.descricoes.some((desc) => desc.defeito.toLowerCase().includes(valor.toLowerCase())),
          )
        }
        break

      case "status":
        if (Array.isArray(valor) && valor.length > 0) {
          resultado = resultado.filter((chamado) => valor.includes(chamado.status))
        }
        break

      case "cliente":
        if (Array.isArray(valor) && valor.length > 0) {
          resultado = resultado.filter((chamado) => valor.includes(chamado.cliente.nome))
        }
        break

      case "tecnico":
        if (Array.isArray(valor) && valor.length > 0) {
          resultado = resultado.filter((chamado) => valor.includes(chamado.tecnico.nome))
        }
        break

      case "data_abertura":
        if (typeof valor === "object" && valor.inicio && valor.fim) {
          resultado = resultado.filter((chamado) => {
            const dataAbertura = new Date(chamado.dataAbertura)
            const inicio = new Date(valor.inicio)
            const fim = new Date(valor.fim)
            return dataAbertura >= inicio && dataAbertura <= fim
          })
        }
        break

      case "data_visita":
        if (typeof valor === "object" && valor.inicio && valor.fim) {
          resultado = resultado.filter((chamado) => {
            if (!chamado.dataVisita) return false
            const dataVisita = new Date(chamado.dataVisita)
            const inicio = new Date(valor.inicio)
            const fim = new Date(valor.fim)
            return dataVisita >= inicio && dataVisita <= fim
          })
        }
        break

      case "valor_minimo":
        if (typeof valor === "string" && valor.trim()) {
          const valorMin = Number.parseFloat(valor)
          resultado = resultado.filter((chamado) => Number.parseFloat(chamado.valorTotal) >= valorMin)
        }
        break

      case "valor_maximo":
        if (typeof valor === "string" && valor.trim()) {
          const valorMax = Number.parseFloat(valor)
          resultado = resultado.filter((chamado) => Number.parseFloat(chamado.valorTotal) <= valorMax)
        }
        break

      case "defeito":
        if (Array.isArray(valor) && valor.length > 0) {
          resultado = resultado.filter((chamado) => chamado.descricoes.some((desc) => valor.includes(desc.defeito)))
        }
        break
    }
  })

  resultado.sort((a, b) => {
    let valorA: any
    let valorB: any

    switch (ordenacao.campo) {
      case "cliente":
        valorA = a.cliente.nome.toLowerCase()
        valorB = b.cliente.nome.toLowerCase()
        break
      case "tecnico":
        valorA = a.tecnico.nome.toLowerCase()
        valorB = b.tecnico.nome.toLowerCase()
        break
      case "valorTotal":
        valorA = Number.parseFloat(a.valorTotal)
        valorB = Number.parseFloat(b.valorTotal)
        break
      case "dataAbertura":
        valorA = new Date(a.dataAbertura)
        valorB = new Date(b.dataAbertura)
        break
      case "dataVisita":
        valorA = a.dataVisita ? new Date(a.dataVisita) : new Date(0)
        valorB = b.dataVisita ? new Date(b.dataVisita) : new Date(0)
        break
      default:
        valorA = a[ordenacao.campo as keyof Chamado]
        valorB = b[ordenacao.campo as keyof Chamado]
        if (typeof valorA === "string") valorA = valorA.toLowerCase()
        if (typeof valorB === "string") valorB = valorB.toLowerCase()
    }

    if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1
    if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1
    return 0
  })

  return resultado
}

export function ChamadosTable({ onEditarChamado, chamadosExternos }: ChamadosTableProps) {
  const [chamados, setChamados] = useState(chamadosIniciais)
  const [filtros, setFiltros] = useState<FiltroValores>({})
  const [ordenacao, setOrdenacao] = useState<OrdenacaoChamado>({ campo: "id", direcao: "asc" })
  const [filtrosSalvos, setFiltrosSalvos] = useState<{ nome: string; filtro: FiltroValores }[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (chamadosExternos && chamadosExternos.length > 0) {
      setChamados((prev) => {
        const chamadosMap = new Map(prev.map((c) => [c.id, c]))
        chamadosExternos.forEach((c) => chamadosMap.set(c.id, c))
        return Array.from(chamadosMap.values())
      })
    }
  }, [chamadosExternos])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleSalvarFiltro = (nome: string, filtro: FiltroValores) => {
    const novosFiltros = [...filtrosSalvos, { nome, filtro }]
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_chamados", JSON.stringify(novosFiltros))
  }

  const handleCarregarFiltro = (filtro: FiltroValores) => {
    setFiltros(filtro)
  }

  const handleExcluirFiltro = (nome: string) => {
    const novosFiltros = filtrosSalvos.filter((f) => f.nome !== nome)
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_chamados", JSON.stringify(novosFiltros))
  }

  const chamadosFiltrados = useMemo(() => filtrarChamados(chamados, filtros, ordenacao), [chamados, filtros, ordenacao])

  const renderStatus = (status: string) => {
    switch (status) {
      case "concluido":
        return <Badge className="bg-green-500">Concluído</Badge>
      case "em_andamento":
        return <Badge className="bg-blue-500">Em Andamento</Badge>
      case "aberto":
        return <Badge className="bg-yellow-500">Aberto</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: string) => {
    const num = Number.parseFloat(value)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FiltroAvancadoModal
          configuracao={configuracaoFiltros}
          valores={filtros}
          onFiltroChange={setFiltros}
          totalResultados={chamadosFiltrados.length}
          onSalvarFiltro={handleSalvarFiltro}
          onCarregarFiltro={handleCarregarFiltro}
          filtrosSalvos={filtrosSalvos}
          onExcluirFiltro={handleExcluirFiltro}
          mostrarFiltrosCliente={true}
          mostrarFiltrosTecnico={true}
          aplicarEmTempoReal={false}
        />

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
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Técnico</TableHead>
              <TableHead className="hidden md:table-cell">Data Abertura</TableHead>
              <TableHead className="hidden md:table-cell">Data Visita</TableHead>
              <TableHead className="hidden lg:table-cell">Defeito</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Valor Total</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chamadosFiltrados.length > 0 ? (
              chamadosFiltrados.map((chamado) => (
                <TableRow key={chamado.id}>
                  <TableCell>{chamado.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{chamado.cliente.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{chamado.tecnico.nome}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{chamado.tecnico.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(chamado.dataAbertura)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(chamado.dataVisita)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{chamado.descricoes[0]?.categoriaId || "-"}</TableCell>
                  <TableCell>{renderStatus(chamado.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatCurrency(chamado.valorTotal)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditarChamado(chamado)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Nenhum chamado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

