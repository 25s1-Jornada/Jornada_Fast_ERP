"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { useFiltroAvancado } from "@/hooks/use-filtro-avancado"
import { RenderizadorCampo } from "./renderizador-campo"
import { FiltrosSalvos } from "./filtros-salvos"


export interface FiltroConfig {
  campo: string
  label: string
  tipo: "texto" | "numero" | "select" | "multiselect" | "data" | "intervalo_data" | "checkbox"
  opcoes?: { value: string; label: string }[]
  placeholder?: string
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
  const {
    isExpanded,
    setIsExpanded,
    nomeFiltroSalvar,
    setNomeFiltroSalvar,
    filtrosSalvosExpanded,
    setFiltrosSalvosExpanded,
    handleValorChange,
    handleMultiSelectChange,
    limparFiltros,
    contarFiltrosAtivos,
  } = useFiltroAvancado(valores, onFiltroChange)

  const filtrosAtivos = contarFiltrosAtivos()

  return (
    <div className="space-y-4">
      {/* Header do Filtro */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros Avançados
            {filtrosAtivos > 0 && (
              <Badge variant="secondary" className="ml-1">
                {filtrosAtivos}
              </Badge>
            )}
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {filtrosAtivos > 0 && (
            <Button variant="ghost" size="sm" onClick={limparFiltros}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            {totalResultados} resultado{totalResultados !== 1 ? "s" : ""} encontrado{totalResultados !== 1 ? "s" : ""}
          </div>
          {acoesDireita && acoesDireita}
        </div>
      </div>

      {/* Filtros Expandidos */}
      {isExpanded && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
          {/* Campos de Filtro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configuracao.map((config) => (
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

          <Separator />

          {/* Filtros Salvos */}
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
        </div>
      )}
    </div>
  )
}
