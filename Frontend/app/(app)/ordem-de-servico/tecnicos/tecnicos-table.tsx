"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, RefreshCw } from "lucide-react"
import { FiltroAvancado, type FiltroConfig, type FiltroValores } from "@/components/filtro-avancado"
import { Ordenacao } from "@/components/ordenacao"

interface Tecnico {
  id: string
  nome: string
  empresa: string
  telefone: string
  email: string
  cidade: string
  uf: string
  especialidade?: string
  ativo?: boolean
  cnpj?: string
}

interface TecnicosTableProps {
  onEditarTecnico: (tecnico: Tecnico) => void
  tecnicos: Tecnico[]
  onRefresh?: () => Promise<void> | void
}

const configuracaoFiltros: FiltroConfig[] = [
  {
    campo: "busca_geral",
    label: "Busca Geral",
    tipo: "texto",
    placeholder: "Nome, empresa ou email...",
  },
  {
    campo: "especialidade",
    label: "Especialidade",
    tipo: "multiselect",
    opcoes: [
      { value: "refrigeracao", label: "Refrigeração" },
      { value: "iluminacao", label: "Iluminação" },
      { value: "estrutura", label: "Estrutura" },
      { value: "eletrica", label: "Elétrica" },
      { value: "hidraulica", label: "Hidráulica" },
      { value: "mecanica", label: "Mecânica" },
    ],
  },
  {
    campo: "uf",
    label: "Estado (UF)",
    tipo: "multiselect",
    opcoes: ["SP", "RJ", "MG", "PR", "SC", "BA", "CE", "RS"].map((uf) => ({ value: uf, label: uf })),
  },
  {
    campo: "cidade",
    label: "Cidade",
    tipo: "select",
    opcoes: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Florianópolis"].map((cidade) => ({
      value: cidade,
      label: cidade,
    })),
  },
  {
    campo: "ativo",
    label: "Apenas Técnicos Ativos",
    tipo: "checkbox",
  },
]

const camposOrdenacao = [
  { value: "nome", label: "Nome" },
  { value: "empresa", label: "Empresa" },
  { value: "cidade", label: "Cidade" },
  { value: "uf", label: "Estado" },
]

export function TecnicosTable({ onEditarTecnico, tecnicos, onRefresh }: TecnicosTableProps) {
  const [filtros, setFiltros] = useState<FiltroValores>({})
  const [ordenacao, setOrdenacao] = useState<{ campo: string; direcao: "asc" | "desc" }>({ campo: "nome", direcao: "asc" })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filtrosSalvos, setFiltrosSalvos] = useState<{ nome: string; filtro: FiltroValores }[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem("filtros_salvos_tecnicos")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const tecnicosFiltrados = useMemo(() => {
    let resultado = [...tecnicos]

    const busca = (filtros.busca_geral as string | undefined)?.toLowerCase()
    if (busca) {
      resultado = resultado.filter(
        (t) =>
          t.nome.toLowerCase().includes(busca) ||
          t.empresa.toLowerCase().includes(busca) ||
          t.email.toLowerCase().includes(busca),
      )
    }

    const estadosSelecionados = filtros.uf as string[] | undefined
    if (estadosSelecionados?.length) {
      resultado = resultado.filter((t) => estadosSelecionados.includes(t.uf))
    }

    const cidadeSelecionada = filtros.cidade as string | undefined
    if (cidadeSelecionada) {
      resultado = resultado.filter((t) => t.cidade === cidadeSelecionada)
    }

    if (filtros.ativo) {
      resultado = resultado.filter((t) => t.ativo !== false)
    }

    resultado.sort((a, b) => {
      const campo = ordenacao.campo as keyof Tecnico
      let valorA = a[campo] ?? ""
      let valorB = b[campo] ?? ""

      if (typeof valorA === "string") valorA = valorA.toLowerCase()
      if (typeof valorB === "string") valorB = valorB.toLowerCase()

      if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1
      if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1
      return 0
    })

    return resultado
  }, [tecnicos, filtros, ordenacao])

  const handleSalvarFiltro = (nome: string, filtro: FiltroValores) => {
    const novosFiltros = [...filtrosSalvos, { nome, filtro }]
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_tecnicos", JSON.stringify(novosFiltros))
  }

  const handleCarregarFiltro = (filtro: FiltroValores) => setFiltros(filtro)

  const handleExcluirFiltro = (nome: string) => {
    const novosFiltros = filtrosSalvos.filter((f) => f.nome !== nome)
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_tecnicos", JSON.stringify(novosFiltros))
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    try {
      setIsRefreshing(true)
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-4">
      <FiltroAvancado
        configuracao={configuracaoFiltros}
        valores={filtros}
        onFiltroChange={setFiltros}
        totalResultados={tecnicosFiltrados.length}
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
            {onRefresh && (
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="sr-only">Atualizar</span>
              </Button>
            )}
          </div>
        }
      />

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Técnico</TableHead>
              <TableHead className="hidden sm:table-cell">Empresa</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">E-mail</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="hidden lg:table-cell">UF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tecnicosFiltrados.length > 0 ? (
              tecnicosFiltrados.map((tecnico) => (
                <TableRow key={tecnico.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tecnico.nome}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{tecnico.empresa}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{tecnico.empresa}</TableCell>
                  <TableCell className="hidden md:table-cell">{tecnico.telefone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tecnico.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tecnico.cidade}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tecnico.uf}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tecnico.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tecnico.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onEditarTecnico(tecnico)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Nenhum técnico encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
