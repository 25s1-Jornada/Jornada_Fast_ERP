"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CampoIntervaloDataProps {
  campo: string
  valor: { inicio?: string; fim?: string }
  onChange: (campo: string, valor: { inicio?: string; fim?: string }) => void
}

export function CampoIntervaloData({ campo, valor, onChange }: CampoIntervaloDataProps) {
  const handleInicioChange = (inicio: string) => {
    onChange(campo, { ...valor, inicio })
  }

  const handleFimChange = (fim: string) => {
    onChange(campo, { ...valor, fim })
  }

  return (
    <div className="space-y-2">
      <div>
        <Label className="text-xs text-muted-foreground">De</Label>
        <Input type="date" value={valor.inicio || ""} onChange={(e) => handleInicioChange(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Até</Label>
        <Input type="date" value={valor.fim || ""} onChange={(e) => handleFimChange(e.target.value)} />
      </div>
    </div>
  )
}
