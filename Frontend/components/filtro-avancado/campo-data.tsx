"use client"

import { Input } from "@/components/ui/input"

interface CampoDataProps {
  campo: string
  valor: string
  onChange: (campo: string, valor: string) => void
}

export function CampoData({ campo, valor, onChange }: CampoDataProps) {
  return <Input type="date" value={valor} onChange={(e) => onChange(campo, e.target.value)} />
}
