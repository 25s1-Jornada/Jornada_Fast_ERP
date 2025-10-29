"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FiltroConfig } from "@/components/filtro-avancado"

interface CampoSelectProps {
  config: FiltroConfig
  valor: string
  onChange: (campo: string, valor: string) => void
}

export function CampoSelect({ config, valor, onChange }: CampoSelectProps) {
  return (
    <Select value={valor || ""} onValueChange={(value) => onChange(config.campo, value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Selecione ${config.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos</SelectItem>
        {config.opcoes?.map((opcao) => (
          <SelectItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
