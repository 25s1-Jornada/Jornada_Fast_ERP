"use client"

import { Input } from "@/components/ui/input"
import type { FiltroConfig } from "@/components/filtro-avancado"

interface CampoNumeroProps {
  config: FiltroConfig
  valor: string
  onChange: (campo: string, valor: string) => void
}

export function CampoNumero({ config, valor, onChange }: CampoNumeroProps) {
  return (
    <Input
      type="number"
      placeholder={config.placeholder || `Filtrar por ${config.label.toLowerCase()}...`}
      value={valor || ""}
      onChange={(e) => onChange(config.campo, e.target.value)}
      className="w-full"
    />
  )
}
