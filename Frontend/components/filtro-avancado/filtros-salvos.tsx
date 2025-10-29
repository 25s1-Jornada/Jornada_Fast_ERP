"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { FiltroValores } from "@/components/filtro-avancado"

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
  const salvarFiltro = () => {
    if (nomeFiltroSalvar.trim() && onSalvarFiltro) {
      onSalvarFiltro(nomeFiltroSalvar.trim(), valores)
      setNomeFiltroSalvar("")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Filtros Salvos</Label>
        <Button variant="ghost" size="sm" onClick={() => setFiltrosSalvosExpanded(!filtrosSalvosExpanded)}>
          {filtrosSalvosExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {filtrosSalvosExpanded && (
        <div className="space-y-2">
          {/* Salvar Filtro Atual */}
          {filtrosAtivos > 0 && onSalvarFiltro && (
            <div className="flex gap-2">
              <Input
                placeholder="Nome do filtro..."
                value={nomeFiltroSalvar}
                onChange={(e) => setNomeFiltroSalvar(e.target.value)}
                className="flex-1"
              />
              <Button onClick={salvarFiltro} disabled={!nomeFiltroSalvar.trim()}>
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}

          {/* Lista de Filtros Salvos */}
          {filtrosSalvos.length > 0 && (
            <div className="space-y-1">
              {filtrosSalvos.map((filtroSalvo, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{filtroSalvo.nome}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onCarregarFiltro?.(filtroSalvo.filtro)}>
                      Aplicar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onExcluirFiltro?.(filtroSalvo.nome)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
