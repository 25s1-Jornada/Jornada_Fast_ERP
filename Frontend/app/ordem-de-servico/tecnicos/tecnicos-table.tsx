"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, RefreshCw } from "lucide-react"
import { FiltroAvancado, type FiltroConfig, type FiltroValores } from "@/components/filtro-avancado"
import { Ordenacao } from "@/components/ordenacao"
import { api } from "@/lib/api"

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
}

interface TecnicosTableProps {
  onEditarTecnico: (tecnico: Tecnico) => void
  tecnicos: Tecnico[]
  setTecnicos: (tecnicos: Tecnico[]) => void
}

// Dados iniciados via API

// Configuração dos filtros para técnicos
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
    opcoes: [
      { value: "SP", label: "São Paulo" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "MG", label: "Minas Gerais" },
      { value: "PR", label: "Paraná" },
      { value: "SC", label: "Santa Catarina" },
      { value: "BA", label: "Bahia" },
      { value: "CE", label: "Ceará" },
      { value: "RS", label: "Rio Grande do Sul" },
    ],
  },
  {
    campo: "cidade",
    label: "Cidade",
    tipo: "select",
    opcoes: [
      { value: "São Paulo", label: "São Paulo" },
      { value: "Rio de Janeiro", label: "Rio de Janeiro" },
      { value: "Belo Horizonte", label: "Belo Horizonte" },
      { value: "Curitiba", label: "Curitiba" },
      { value: "Florianópolis", label: "Florianópolis" },
    ],
  },
  {
    campo: "ativo",
    label: "Apenas Técnicos Ativos",
    tipo: "checkbox",
  },
]

// Campos disponíveis para ordenação
const camposOrdenacao = [
  { value: "nome", label: "Nome" },
  { value: "empresa", label: "Empresa" },
  { value: "cidade", label: "Cidade" },
  { value: "uf", label: "Estado" },
  { value: "especialidade", label: "Especialidade" },
]

export function TecnicosTable({ onEditarTecnico, tecnicos, setTecnicos }: TecnicosTableProps) {
  useEffect(() => {
    const load = async () => {
      try {
        const [usuarios, empresas] = await Promise.all([
          api.get<any[]>("/api/Usuario/lista?perfil=tecnico"),
          api.get<any[]>("/api/Empresa/lista"),
        ])

        const empresaMap = (empresas || []).reduce<Record<string, any>>((acc, empresa) => {
          const id = String(empresa.id ?? "")
          acc[id] = empresa
          return acc
        }, {})

        const mapped: Tecnico[] = (usuarios || []).map((u) => {
          const empresaId = String(u.empresaId ?? u.empresaID ?? u.empresa_id ?? "")
          const empresa = empresaMap[empresaId]
          return {
            id: String(u.id ?? ""),
            nome: u.nome ?? "",
            empresa: empresa?.nome ?? "-",
            telefone: u.telefone ?? "",
            email: u.email ?? "",
            cidade: empresa?.endereco?.cidade ?? "",
            uf: empresa?.endereco?.uf ?? "",
            especialidade: u.especialidade ?? "",
            ativo: true,
          }
        })

        setTecnicos(mapped)
      } catch (error) {
        console.error(error)
      }
    }

    load()
  }, [setTecnicos])

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
  const tecnicosFiltrados = useMemo(() => {
    let resultado = [...tecnicos]

    // Aplicar filtros
    Object.entries(filtros).forEach(([campo, valor]) => {
      if (!valor || (Array.isArray(valor) && valor.length === 0)) return

      switch (campo) {
        case "busca_geral":
          if (typeof valor === "string" && valor.trim()) {
            resultado = resultado.filter(
              (tecnico) =>
                tecnico.nome.toLowerCase().includes(valor.toLowerCase()) ||
                tecnico.empresa.toLowerCase().includes(valor.toLowerCase()) ||
                tecnico.email.toLowerCase().includes(valor.toLowerCase()),
            )
          }
          break

        case "especialidade":
          if (Array.isArray(valor) && valor.length > 0) {
            resultado = resultado.filter((tecnico) => tecnico.especialidade && valor.includes(tecnico.especialidade))
          }
          break

        case "uf":
          if (Array.isArray(valor) && valor.length > 0) {
            resultado = resultado.filter((tecnico) => valor.includes(tecnico.uf))
          }
          break

        case "cidade":
          if (typeof valor === "string" && valor.trim()) {
            resultado = resultado.filter((tecnico) => tecnico.cidade === valor)
          }
          break

        case "ativo":
          if (valor === true) {
            resultado = resultado.filter((tecnico) => tecnico.ativo === true)
          }
          break
      }
    })

    // Aplicar ordenação
    resultado.sort((a, b) => {
      let valorA: any = a[ordenacao.campo as keyof Tecnico]
      let valorB: any = b[ordenacao.campo as keyof Tecnico]

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

  const handleCarregarFiltro = (filtro: FiltroValores) => {
    setFiltros(filtro)
  }

  const handleExcluirFiltro = (nome: string) => {
    const novosFiltros = filtrosSalvos.filter((f) => f.nome !== nome)
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem("filtros_salvos_tecnicos", JSON.stringify(novosFiltros))
  }

  const getEspecialidadeLabel = (especialidade?: string) => {
    const especialidades = {
      refrigeracao: "Refrigeração",
      iluminacao: "Iluminação",
      estrutura: "Estrutura",
      eletrica: "Elétrica",
      hidraulica: "Hidráulica",
      mecanica: "Mecânica",
    }
    return especialidades[especialidade as keyof typeof especialidades] || especialidade
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
              <TableHead>Técnico</TableHead>
              <TableHead className="hidden sm:table-cell">Empresa</TableHead>
              <TableHead className="hidden md:table-cell">Especialidade</TableHead>
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
                  <TableCell className="hidden md:table-cell">{getEspecialidadeLabel(tecnico.especialidade)}</TableCell>
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
                <TableCell colSpan={9} className="text-center py-4">
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
