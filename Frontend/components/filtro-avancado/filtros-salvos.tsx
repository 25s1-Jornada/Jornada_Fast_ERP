"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Save, Trash2, Download } from "lucide-react"
import type { FiltroValores } from "../filtro-avancado"

interface FiltrosSalvosProps {
  filtrosAtivos: number
  nomeFiltroSalvar: string
  setNomeFiltroSalvar: (nome: string) => void
  filtrosSalvosExpanded: boolean
  setFiltrosSalvosExpanded: (expanded: boolean) => void
  onSalvarFiltro?: (nome: string, filtro: FiltroValores) => void
  onCarregarFiltro?: (filtro: FiltroValores) => void
  filtrosSalvos: { nome: string; filtro: FiltroValores }[]
  onExcluirFiltro?: (nome: string) => void
  valores: FiltroValores
}

export function FiltrosSalvos({
  filtrosAtivos,
  nomeFiltroSalvar,
  setNomeFiltroSalvar,
  filtrosSalvosExpanded,
  setFiltrosSalvosExpanded,
  onSalvarFiltro,
  onCarregarFiltro,
  filtrosSalvos,
  onExcluirFiltro,
  valores,
}: FiltrosSalvosProps) {
  const [salvandoFiltro, setSalvandoFiltro] = useState(false)

  const handleSalvarFiltro = () => {
    if (!nomeFiltroSalvar.trim() || !onSalvarFiltro) return

    setSalvandoFiltro(true)
    onSalvarFiltro(nomeFiltroSalvar, valores)
    setNomeFiltroSalvar("")
    setSalvandoFiltro(false)
  }

  const contarFiltrosNoFiltroSalvo = (filtro: FiltroValores) => {
    return Object.values(filtro).filter((valor) => {
      if (Array.isArray(valor)) return valor.length > 0
      if (typeof valor === "string") return valor.trim() !== ""
      return valor !== "" && valor !== null && valor !== undefined
    }).length
  }

  return (
    <div className="space-y-4">
      {/* Salvar filtro atual */}
      {onSalvarFiltro && filtrosAtivos > 0 && (
        <div className="flex gap-2">
          <Input
            placeholder="Nome do filtro..."
            value={nomeFiltroSalvar}
            onChange={(e) => setNomeFiltroSalvar(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSalvarFiltro} disabled={!nomeFiltroSalvar.trim() || salvandoFiltro} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      )}

      {/* Lista de filtros salvos */}
      {filtrosSalvos.length > 0 && (
        <Collapsible open={filtrosSalvosExpanded} onOpenChange={setFiltrosSalvosExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
              <span>Filtros Salvos ({filtrosSalvos.length})</span>
              {filtrosSalvosExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {filtrosSalvos.map((filtroSalvo, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{filtroSalvo.nome}</span>
                  <Badge variant="secondary" className="text-xs">
                    {contarFiltrosNoFiltroSalvo(filtroSalvo.filtro)} filtro
                    {contarFiltrosNoFiltroSalvo(filtroSalvo.filtro) !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  {onCarregarFiltro && (
                    <Button variant="ghost" size="sm" onClick={() => onCarregarFiltro(filtroSalvo.filtro)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {onExcluirFiltro && (
                    <Button variant="ghost" size="sm" onClick={() => onExcluirFiltro(filtroSalvo.nome)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
