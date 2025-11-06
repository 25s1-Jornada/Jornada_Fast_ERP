"use client"

import { Input } from "@/components/ui/input"

interface CampoNumeroProps {
  campo: string
  placeholder?: string
  valor: string | number
  onChange: (campo: string, valor: string) => void
}

export function CampoNumero({ campo, placeholder, valor, onChange }: CampoNumeroProps) {
  return (
    <Input type="number" placeholder={placeholder} value={valor} onChange={(e) => onChange(campo, e.target.value)} />
  )
}
