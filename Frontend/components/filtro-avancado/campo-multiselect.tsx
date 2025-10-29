"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, UserCog, X } from "lucide-react"
import type { FiltroConfig, FiltroValores } from "@/components/filtro-avancado"

interface CampoMultiSelectProps {
  config: FiltroConfig
  valores: FiltroValores
  onChange: (campo: string, valor: any) => void
  onMultiSelectChange: (campo: string, valor: string, checked: boolean) => void
  mostrarFiltroTexto?: boolean
}

export function CampoMultiSelect({
  config,
  valores,
  onChange,
  onMultiSelectChange,
  mostrarFiltroTexto = false,
}: CampoMultiSelectProps) {
  const valor = valores[config.campo] || []
  const filtroTexto = valores[`${config.campo}_texto`] || ""

  const opcoesFiltradasPorTexto =
    config.opcoes?.filter((opcao) => opcao.label.toLowerCase().includes(filtroTexto.toLowerCase())) || []

  return (
    <div className="space-y-3">
      {/* Campo de filtro por texto para cliente/técnico */}
      {mostrarFiltroTexto && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {config.campo === "cliente" ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <UserCog className="h-4 w-4 text-muted-foreground" />
            )}
            <Label className="text-xs font-medium text-muted-foreground">Buscar {config.label.toLowerCase()}</Label>
          </div>
          <Input
            placeholder={`Digite para filtrar ${config.label.toLowerCase()}...`}
            value={filtroTexto}
            onChange={(e) => onChange(`${config.campo}_texto`, e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* Lista de opções filtradas */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Selecionar {config.label.toLowerCase()}</Label>
        <ScrollArea className="h-32 w-full border rounded-md p-2">
          {opcoesFiltradasPorTexto.length > 0 ? (
            opcoesFiltradasPorTexto.map((opcao) => (
              <div key={opcao.value} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`${config.campo}-${opcao.value}`}
                  checked={valor.includes(opcao.value)}
                  onCheckedChange={(checked) => onMultiSelectChange(config.campo, opcao.value, checked as boolean)}
                />
                <Label htmlFor={`${config.campo}-${opcao.value}`} className="text-sm font-normal cursor-pointer">
                  {opcao.label}
                </Label>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-2">
              {filtroTexto ? "Nenhum resultado encontrado" : "Carregando..."}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Badges dos valores selecionados */}
      {valor.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {valor.map((val: string) => {
            const opcao = config.opcoes?.find((o) => o.value === val)
            return (
              <Badge key={val} variant="secondary" className="text-xs">
                {opcao?.label}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => onMultiSelectChange(config.campo, val, false)}
                />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
