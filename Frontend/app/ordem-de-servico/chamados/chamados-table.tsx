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
  defeito: string
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

interface Chamado {
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

// Atualizar os dados de exemplo para chamados com mais variedade
const chamadosIniciais: Chamado[] = [
  {
    id: "1",
    cliente: { id: "1", nome: "João Silva" },
    tecnico: { id: "1", nome: "Carlos Oliveira" },
    dataAbertura: "2023-05-15",
    dataVisita: "2023-05-18",
    status: "concluido",
    pedido: "PED123",
    dataFaturamento: "15/05/2023",
    garantia: "12 meses",
    descricoes: [
      {
        id: "1",
        numeroSerie: "SN12345",
        defeito: "Refrigeração",
        observacao: "Equipamento não está refrigerando adequadamente.",
      },
    ],
    custosServico: [
      {
        id: "custo-1",
        nome: "Custo Principal",
        deslocamento: {
          hrSaidaEmpresa: "08:00",
          hrChegadaCliente: "09:30",
          hrSaidaCliente: "14:00",
          hrChegadaEmpresa: "15:30",
          totalHoras: "5.5",
          totalValor: "275.00",
        },
        horaTrabalhada: {
          hrInicio: "09:30",
          hrTermino: "14:00",
          totalHoras: "4.5",
          totalValor: "225.00",
        },
        km: {
          km: "45",
          valorPorKm: "1.50",
          totalValor: "67.50",
        },
        materiais: [
          {
            id: "mat-1",
            material: "Gás R134a",
            quantidade: "2",
            valorUnitario: "45.00",
            totalValor: "90.00",
          },
          {
            id: "mat-2",
            material: "Filtro Secador",
            quantidade: "1",
            valorUnitario: "35.00",
            totalValor: "35.00",
          },
        ],
        subtotal: "692.50",
      },
    ],
    valorTotal: "692.50",
  },
  {
    id: "2",
    cliente: { id: "2", nome: "Empresa ABC Ltda" },
    tecnico: { id: "2", nome: "Ana Silva" },
    dataAbertura: "2023-06-22",
    dataVisita: "2023-06-25",
    status: "em_andamento",
    pedido: "PED456",
    dataFaturamento: "22/06/2023",
    garantia: "24 meses",
    descricoes: [
      {
        id: "2",
        numeroSerie: "IL789",
        defeito: "Iluminação",
        observacao: "Luzes piscando intermitentemente.",
      },
    ],
    custosServico: [
      {
        id: "custo-2",
        nome: "Diagnóstico Inicial",
        deslocamento: {
          hrSaidaEmpresa: "13:00",
          hrChegadaCliente: "14:15",
          hrSaidaCliente: "16:30",
          hrChegadaEmpresa: "17:45",
          totalHoras: "4.75",
          totalValor: "237.50",
        },
        horaTrabalhada: {
          hrInicio: "14:15",
          hrTermino: "16:30",
          totalHoras: "2.25",
          totalValor: "112.50",
        },
        km: {
          km: "32",
          valorPorKm: "1.50",
          totalValor: "48.00",
        },
        materiais: [],
        subtotal: "398.00",
      },
    ],
    valorTotal: "398.00",
  },
  {
    id: "3",
    cliente: { id: "3", nome: "Comércio XYZ" },
    tecnico: { id: "3", nome: "Roberto Santos" },
    dataAbertura: "2023-07-10",
    dataVisita: "",
    status: "aberto",
    pedido: "PED789",
    dataFaturamento: "10/07/2023",
    garantia: "6 meses",
    descricoes: [
      {
        id: "3",
        numeroSerie: "EST123",
        defeito: "Estrutura",
        observacao: "Suporte de parede com folga.",
      },
    ],
    custosServico: [
      {
        id: "custo-3",
        nome: "Avaliação Estrutural",
        deslocamento: {
          hrSaidaEmpresa: "",
          hrChegadaCliente: "",
          hrSaidaCliente: "",
          hrChegadaEmpresa: "",
          totalHoras: "0",
          totalValor: "0",
        },
        horaTrabalhada: {
          hrInicio: "",
          hrTermino: "",
          totalHoras: "0",
          totalValor: "0",
        },
        km: {
          km: "0",
          valorPorKm: "1.50",
          totalValor: "0",
        },
        materiais: [],
        subtotal: "0",
      },
    ],
    valorTotal: "0",
  },
  {
    id: "4",
    cliente: { id: "4", nome: "Restaurante Bom Sabor" },
    tecnico: { id: "1", nome: "Carlos Oliveira" },
    dataAbertura: "2023-08-05",
    dataVisita: "2023-08-07",
    status: "concluido",
    pedido: "PED890",
    dataFaturamento: "05/08/2023",
    garantia: "18 meses",
    descricoes: [
      {
        id: "4",
        numeroSerie: "FR456789",
        defeito: "Refrigeração",
        observacao: "Freezer não congela adequadamente. Temperatura oscilando.",
      },
      {
        id: "5",
        numeroSerie: "GE123456",
        defeito: "Refrigeração",
        observacao: "Geladeira com vazamento de gás.",
      },
    ],
    custosServico: [
      {
        id: "custo-4",
        nome: "Reparo Freezer",
        deslocamento: {
          hrSaidaEmpresa: "07:30",
          hrChegadaCliente: "08:45",
          hrSaidaCliente: "12:00",
          hrChegadaEmpresa: "13:15",
          totalHoras: "5.75",
          totalValor: "287.50",
        },
        horaTrabalhada: {
          hrInicio: "08:45",
          hrTermino: "12:00",
          totalHoras: "3.25",
          totalValor: "162.50",
        },
        km: {
          km: "28",
          valorPorKm: "1.50",
          totalValor: "42.00",
        },
        materiais: [
          {
            id: "mat-3",
            material: "Compressor 1/4 HP",
            quantidade: "1",
            valorUnitario: "320.00",
            totalValor: "320.00",
          },
          {
            id: "mat-4",
            material: "Gás R404a",
            quantidade: "1",
            valorUnitario: "65.00",
            totalValor: "65.00",
          },
        ],
        subtotal: "877.00",
      },
      {
        id: "custo-5",
        nome: "Reparo Geladeira",
        deslocamento: {
          hrSaidaEmpresa: "14:00",
          hrChegadaCliente: "15:15",
          hrSaidaCliente: "17:30",
          hrChegadaEmpresa: "18:45",
          totalHoras: "4.75",
          totalValor: "237.50",
        },
        horaTrabalhada: {
          hrInicio: "15:15",
          hrTermino: "17:30",
          totalHoras: "2.25",
          totalValor: "112.50",
        },
        km: {
          km: "28",
          valorPorKm: "1.50",
          totalValor: "42.00",
        },
        materiais: [
          {
            id: "mat-5",
            material: "Tubo Capilar",
            quantidade: "2",
            valorUnitario: "15.00",
            totalValor: "30.00",
          },
          {
            id: "mat-6",
            material: "Solda Prata",
            quantidade: "1",
            valorUnitario: "25.00",
            totalValor: "25.00",
          },
        ],
        subtotal: "447.00",
      },
    ],
    valorTotal: "1324.00",
  },
  {
    id: "5",
    cliente: { id: "5", nome: "Supermercado Central" },
    tecnico: { id: "4", nome: "Marina Costa" },
    dataAbertura: "2023-09-12",
    dataVisita: "2023-09-14",
    status: "em_andamento",
    pedido: "PED567",
    dataFaturamento: "12/09/2023",
    garantia: "36 meses",
    descricoes: [
      {
        id: "6",
        numeroSerie: "LED789012",
        defeito: "Iluminação",
        observacao: "Sistema de LED com falhas intermitentes em 3 corredores.",
      },
    ],
    custosServico: [
      {
        id: "custo-6",
        nome: "Diagnóstico LED",
        deslocamento: {
          hrSaidaEmpresa: "08:00",
          hrChegadaCliente: "09:00",
          hrSaidaCliente: "11:30",
          hrChegadaEmpresa: "12:30",
          totalHoras: "4.5",
          totalValor: "225.00",
        },
        horaTrabalhada: {
          hrInicio: "09:00",
          hrTermino: "11:30",
          totalHoras: "2.5",
          totalValor: "125.00",
        },
        km: {
          km: "18",
          valorPorKm: "1.50",
          totalValor: "27.00",
        },
        materiais: [
          {
            id: "mat-7",
            material: "Driver LED 50W",
            quantidade: "3",
            valorUnitario: "45.00",
            totalValor: "135.00",
          },
        ],
        subtotal: "512.00",
      },
    ],
    valorTotal: "512.00",
  },
  {
    id: "6",
    cliente: { id: "6", nome: "Hotel Vista Mar" },
    tecnico: { id: "5", nome: "Pedro Almeida" },
    dataAbertura: "2023-10-03",
    dataVisita: "2023-10-05",
    status: "concluido",
    pedido: "PED234",
    dataFaturamento: "03/10/2023",
    garantia: "24 meses",
    descricoes: [
      {
        id: "7",
        numeroSerie: "AC345678",
        defeito: "Refrigeração",
        observacao: "Ar condicionado central com baixo rendimento.",
      },
      {
        id: "8",
        numeroSerie: "ST901234",
        defeito: "Estrutura",
        observacao: "Suporte do condensador com vibração excessiva.",
      },
    ],
    custosServico: [
      {
        id: "custo-7",
        nome: "Manutenção AC Central",
        deslocamento: {
          hrSaidaEmpresa: "06:30",
          hrChegadaCliente: "08:00",
          hrSaidaCliente: "16:00",
          hrChegadaEmpresa: "17:30",
          totalHoras: "11.0",
          totalValor: "550.00",
        },
        horaTrabalhada: {
          hrInicio: "08:00",
          hrTermino: "16:00",
          totalHoras: "8.0",
          totalValor: "400.00",
        },
        km: {
          km: "85",
          valorPorKm: "1.50",
          totalValor: "127.50",
        },
        materiais: [
          {
            id: "mat-8",
            material: "Filtro de Ar Industrial",
            quantidade: "4",
            valorUnitario: "85.00",
            totalValor: "340.00",
          },
          {
            id: "mat-9",
            material: "Óleo Lubrificante",
            quantidade: "2",
            valorUnitario: "45.00",
            totalValor: "90.00",
          },
          {
            id: "mat-10",
            material: "Amortecedor Vibração",
            quantidade: "6",
            valorUnitario: "25.00",
            totalValor: "150.00",
          },
        ],
        subtotal: "1657.50",
      },
    ],
    valorTotal: "1657.50",
  },
  {
    id: "7",
    cliente: { id: "7", nome: "Padaria Pão Dourado" },
    tecnico: { id: "2", nome: "Ana Silva" },
    dataAbertura: "2023-11-15",
    dataVisita: "",
    status: "aberto",
    pedido: "PED678",
    dataFaturamento: "15/11/2023",
    garantia: "12 meses",
    descricoes: [
      {
        id: "9",
        numeroSerie: "FO567890",
        defeito: "Refrigeração",
        observacao: "Forno industrial com problema no sistema de resfriamento.",
      },
    ],
    custosServico: [
      {
        id: "custo-8",
        nome: "Avaliação Forno",
        deslocamento: {
          hrSaidaEmpresa: "",
          hrChegadaCliente: "",
          hrSaidaCliente: "",
          hrChegadaEmpresa: "",
          totalHoras: "0",
          totalValor: "0",
        },
        horaTrabalhada: {
          hrInicio: "",
          hrTermino: "",
          totalHoras: "0",
          totalValor: "0",
        },
        km: {
          km: "0",
          valorPorKm: "1.50",
          totalValor: "0",
        },
        materiais: [],
        subtotal: "0",
      },
    ],
    valorTotal: "0",
  },
  {
    id: "8",
    cliente: { id: "8", nome: "Clínica Saúde Total" },
    tecnico: { id: "3", nome: "Roberto Santos" },
    dataAbertura: "2023-12-01",
    dataVisita: "2023-12-03",
    status: "em_andamento",
    pedido: "PED345",
    dataFaturamento: "01/12/2023",
    garantia: "60 meses",
    descricoes: [
      {
        id: "10",
        numeroSerie: "AC789123",
        defeito: "Refrigeração",
        observacao: "Sistema de climatização da sala de cirurgia com falha.",
      },
      {
        id: "11",
        numeroSerie: "IL456789",
        defeito: "Iluminação",
        observacao: "Iluminação de emergência não funciona.",
      },
    ],
    custosServico: [
      {
        id: "custo-9",
        nome: "Climatização Cirúrgica",
        deslocamento: {
          hrSaidaEmpresa: "07:00",
          hrChegadaCliente: "08:30",
          hrSaidaCliente: "12:00",
          hrChegadaEmpresa: "13:30",
          totalHoras: "6.5",
          totalValor: "325.00",
        },
        horaTrabalhada: {
          hrInicio: "08:30",
          hrTermino: "12:00",
          totalHoras: "3.5",
          totalValor: "175.00",
        },
        km: {
          km: "42",
          valorPorKm: "1.50",
          totalValor: "63.00",
        },
        materiais: [
          {
            id: "mat-11",
            material: "Filtro HEPA",
            quantidade: "2",
            valorUnitario: "120.00",
            totalValor: "240.00",
          },
        ],
        subtotal: "803.00",
      },
      {
        id: "custo-10",
        nome: "Iluminação Emergência",
        deslocamento: {
          hrSaidaEmpresa: "14:00",
          hrChegadaCliente: "15:30",
          hrSaidaCliente: "17:00",
          hrChegadaEmpresa: "18:30",
          totalHoras: "4.5",
          totalValor: "225.00",
        },
        horaTrabalhada: {
          hrInicio: "15:30",
          hrTermino: "17:00",
          totalHoras: "1.5",
          totalValor: "75.00",
        },
        km: {
          km: "42",
          valorPorKm: "1.50",
          totalValor: "63.00",
        },
        materiais: [
          {
            id: "mat-12",
            material: "Bateria 12V",
            quantidade: "4",
            valorUnitario: "35.00",
            totalValor: "140.00",
          },
          {
            id: "mat-13",
            material: "Lâmpada LED Emergência",
            quantidade: "6",
            valorUnitario: "25.00",
            totalValor: "150.00",
          },
        ],
        subtotal: "653.00",
      },
    ],
    valorTotal: "1456.00",
  },
]

export function ChamadosTable({ onEditarChamado, chamadosExternos }: ChamadosTableProps) {
  const [chamados, setChamados] = useState(chamadosIniciais)
  const [filtros, setFiltros] = useState<FiltroValores>({})
  const [ordenacao, setOrdenacao] = useState({ campo: "id", direcao: "asc" as "asc" | "desc" })
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

  const chamadosFiltrados = useMemo(() => {
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
  }, [chamados, filtros, ordenacao])

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
                  <TableCell className="hidden lg:table-cell">{chamado.descricoes[0]?.defeito || "-"}</TableCell>
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
