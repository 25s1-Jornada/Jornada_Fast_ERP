"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { LucideIcon } from "lucide-react"
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Users2,
  CalendarDays,
  Wallet2,
  Layers3,
  X,
} from "lucide-react"
import { RenderizadorCampo } from "./filtro-avancado/renderizador-campo"
import { FiltrosSalvos } from "./filtro-avancado/filtros-salvos"

export interface FiltroConfig {
  campo: string
  label: string
  tipo: "texto" | "numero" | "select" | "multiselect" | "data" | "intervalo_data" | "checkbox"
  opcoes?: { value: string; label: string }[]
  placeholder?: string
  categoria?: "geral" | "pessoas" | "datas" | "valores"
}

export interface FiltroValores {
  [key: string]: any
}

const categoriaOrdem = ["geral", "pessoas", "datas", "valores"] as const

const categoriaMetadados: Record<string, { label: string; icon: LucideIcon }> = {
  geral: { label: "Geral", icon: SlidersHorizontal },
  pessoas: { label: "Pessoas", icon: Users2 },
  datas: { label: "Datas", icon: CalendarDays },
  valores: { label: "Valores", icon: Wallet2 },
}

const formatarDataCurta = (valor: string) => {
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return valor
  return new Intl.DateTimeFormat("pt-BR").format(data)
}

const valorEstaAtivo = (valor: any) => {
  if (Array.isArray(valor)) return valor.length > 0
  if (valor === null || valor === undefined) return false
  if (typeof valor === "string") return valor.trim() !== ""
  if (typeof valor === "boolean") return valor === true
  if (typeof valor === "object") {
    return Object.values(valor).some((v) => v !== "" && v !== null && v !== undefined)
  }
  return true
}

interface FiltroAvancadoProps {
  configuracao: FiltroConfig[]
  valores: FiltroValores
  onFiltroChange: (valores: FiltroValores) => void
  totalResultados: number
  onSalvarFiltro?: (nome: string, filtro: FiltroValores) => void
  onCarregarFiltro?: (filtro: FiltroValores) => void
  filtrosSalvos?: { nome: string; filtro: FiltroValores }[]
  onExcluirFiltro?: (nome: string) => void
  acoesDireita?: React.ReactNode
  mostrarFiltrosCliente?: boolean
  mostrarFiltrosTecnico?: boolean
}

export function FiltroAvancado({
  configuracao,
  valores,
  onFiltroChange,
  totalResultados,
  onSalvarFiltro,
  onCarregarFiltro,
  filtrosSalvos = [],
  onExcluirFiltro,
  acoesDireita,
  mostrarFiltrosCliente = false,
  mostrarFiltrosTecnico = false,
}: FiltroAvancadoProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [nomeFiltroSalvar, setNomeFiltroSalvar] = useState("")
  const [filtrosSalvosExpanded, setFiltrosSalvosExpanded] = useState(false)

  const configuracaoAgrupada = useMemo(() => {
    return configuracao.reduce<Record<string, FiltroConfig[]>>((acc, item) => {
      const categoria = item.categoria || "geral"
      if (!acc[categoria]) acc[categoria] = []
      acc[categoria].push(item)
      return acc
    }, {})
  }, [configuracao])

  const categoriasVisiveis = useMemo(() => {
    const chaves = Object.keys(configuracaoAgrupada)
    const ordenadas = categoriaOrdem.filter((categoria) => chaves.includes(categoria))
    const extras = chaves.filter((categoria) => !categoriaOrdem.includes(categoria as (typeof categoriaOrdem)[number]))
    return [...ordenadas, ...extras]
  }, [configuracaoAgrupada])

  const formatarValorFiltro = useCallback((config: FiltroConfig, valor: any) => {
    if (!valorEstaAtivo(valor)) return ""

    switch (config.tipo) {
      case "multiselect":
        if (!Array.isArray(valor) || valor.length === 0) return ""
        return valor
          .map((item) => config.opcoes?.find((opcao) => opcao.value === item)?.label || item)
          .join(", ")
      case "intervalo_data": {
        const inicio = valor?.inicio
        const fim = valor?.fim
        if (!inicio && !fim) return ""
        const inicioFmt = inicio ? formatarDataCurta(inicio) : ""
        const fimFmt = fim ? formatarDataCurta(fim) : ""
        if (inicio && fim) return `${inicioFmt} — ${fimFmt}`
        return inicio ? `A partir de ${inicioFmt}` : `Até ${fimFmt}`
      }
      case "data":
        return valor ? formatarDataCurta(valor) : ""
      case "checkbox":
        return valor ? "Ativo" : ""
      default:
        if (typeof valor === "string") return valor
        if (typeof valor === "number") return valor.toString()
        if (Array.isArray(valor)) return valor.join(", ")
        return valor ?? ""
    }
  }, [])

  const filtroChips = useMemo(() => {
    return configuracao
      .map((config) => {
        const valor = valores[config.campo]
        if (!valorEstaAtivo(valor)) return null
        const display = formatarValorFiltro(config, valor)
        if (!display) return null
        return { campo: config.campo, label: config.label, display }
      })
      .filter(Boolean) as { campo: string; label: string; display: string }[]
  }, [configuracao, valores, formatarValorFiltro])

  const handleValorChange = useCallback(
    (campo: string, valor: any) => {
      const novosValores = { ...valores, [campo]: valor }
      onFiltroChange(novosValores)
    },
    [valores, onFiltroChange],
  )

  const handleMultiSelectChange = useCallback(
    (campo: string, valor: string, checked: boolean) => {
      const valoresAtuais = valores[campo] || []
      let novosValores: string[]

      if (checked) {
        novosValores = [...valoresAtuais, valor]
      } else {
        novosValores = valoresAtuais.filter((v: string) => v !== valor)
      }

      handleValorChange(campo, novosValores)
    },
    [valores, handleValorChange],
  )

  const handleRemoverFiltro = useCallback(
    (campo: string) => {
      const novosValores = { ...valores }
      delete novosValores[campo]
      onFiltroChange(novosValores)
    },
    [valores, onFiltroChange],
  )

  const limparFiltros = useCallback(() => {
    onFiltroChange({})
  }, [onFiltroChange])

  const contarFiltrosAtivos = useCallback(() => {
    return Object.values(valores).filter((valor) => valorEstaAtivo(valor)).length
  }, [valores])

  const contarFiltrosPorCategoria = useCallback(
    (categoriaConfigs: FiltroConfig[]) => {
      return categoriaConfigs.filter((config) => valorEstaAtivo(valores[config.campo])).length
    },
    [valores],
  )

  const filtrosAtivos = contarFiltrosAtivos()

  return (
    <div className="space-y-4">
      {/* Cabeçalho com contador de resultados e ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {filtrosAtivos > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filtrosAtivos}
                  </Badge>
                )}
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            {totalResultados} resultado{totalResultados !== 1 ? "s" : ""}
          </div>

          {filtrosAtivos > 0 && (
            <Button variant="outline" size="sm" onClick={limparFiltros}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {acoesDireita && <div className="flex items-center gap-2">{acoesDireita}</div>}
      </div>

      {/* Conteúdo expansível dos filtros */}
      {filtroChips.length > 0 && (
        <div className="rounded-lg border bg-muted/40 p-3 flex flex-wrap gap-2">
          {filtroChips.map((chip) => (
            <Badge
              key={chip.campo}
              variant="secondary"
              className="flex items-center gap-2 rounded-full px-3 py-1 text-xs"
            >
              <span className="font-semibold text-muted-foreground">{chip.label}:</span>
              <span>{chip.display}</span>
              <button
                type="button"
                onClick={() => handleRemoverFiltro(chip.campo)}
                className="rounded-full p-1 hover:bg-muted transition"
                aria-label={`Remover filtro ${chip.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-6">
          <div className="rounded-lg border p-6 bg-muted/50 space-y-6">
            {categoriasVisiveis.map((categoria) => {
              const configsCategoria = configuracaoAgrupada[categoria]
              if (!configsCategoria || configsCategoria.length === 0) return null

              const categoriaInfo =
                categoriaMetadados[categoria] || {
                  label: categoria.charAt(0).toUpperCase() + categoria.slice(1),
                  icon: Layers3,
                }
              const IconeCategoria = categoriaInfo.icon
              const ativosCategoria = contarFiltrosPorCategoria(configsCategoria)

              return (
                <div key={categoria} className="space-y-4 rounded-lg border bg-background p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <IconeCategoria className="h-4 w-4 text-muted-foreground" />
                      {categoriaInfo.label}
                    </div>
                    {ativosCategoria > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {ativosCategoria} ativo{ativosCategoria > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {configsCategoria.map((config) => (
                      <div key={config.campo} className="space-y-2">
                        <Label className="text-sm font-medium">{config.label}</Label>
                        <RenderizadorCampo
                          config={config}
                          valores={valores}
                          onChange={handleValorChange}
                          onMultiSelectChange={handleMultiSelectChange}
                          mostrarFiltrosCliente={mostrarFiltrosCliente}
                          mostrarFiltrosTecnico={mostrarFiltrosTecnico}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Seção de filtros salvos */}
            {(onSalvarFiltro || filtrosSalvos.length > 0) && (
              <>
                <Separator className="my-6" />
                <FiltrosSalvos
                  filtrosAtivos={filtrosAtivos}
                  nomeFiltroSalvar={nomeFiltroSalvar}
                  setNomeFiltroSalvar={setNomeFiltroSalvar}
                  filtrosSalvosExpanded={filtrosSalvosExpanded}
                  setFiltrosSalvosExpanded={setFiltrosSalvosExpanded}
                  onSalvarFiltro={onSalvarFiltro}
                  onCarregarFiltro={onCarregarFiltro}
                  filtrosSalvos={filtrosSalvos}
                  onExcluirFiltro={onExcluirFiltro}
                  valores={valores}
                />
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
