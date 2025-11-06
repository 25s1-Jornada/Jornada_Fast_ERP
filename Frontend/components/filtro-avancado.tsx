"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw, Search } from "lucide-react"
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

  const limparFiltros = useCallback(() => {
    onFiltroChange({})
  }, [onFiltroChange])

  const contarFiltrosAtivos = useCallback(() => {
    return Object.values(valores).filter((valor) => {
      if (Array.isArray(valor)) return valor.length > 0
      if (typeof valor === "string") return valor.trim() !== ""
      if (typeof valor === "object" && valor !== null) {
        return Object.values(valor).some((v) => v !== "" && v !== null && v !== undefined)
      }
      return valor !== "" && valor !== null && valor !== undefined
    }).length
  }, [valores])

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
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-6">
          <div className="rounded-lg border p-6 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configuracao.map((config) => (
                <div key={config.campo} className="space-y-3">
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
