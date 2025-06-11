"use client"

import { Input } from "@/components/ui/input"
import type { FiltroConfig } from "@/components/filtro-avancado"

interface CampoTextoProps {
  config: FiltroConfig
  valor: string
  onChange: (campo: string, valor: string) => void
}

export function CampoTexto({ config, valor, onChange }: CampoTextoProps) {
  return (
    <Input
      placeholder={config.placeholder || `Buscar por ${config.label.toLowerCase()}...`}
      value={valor || ""}
      onChange={(e) => onChange(config.campo, e.target.value)}
      className="w-full"
    />
  )
}
