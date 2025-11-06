"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CampoSelectProps {
  campo: string
  opcoes: { value: string; label: string }[]
  valor: string
  onChange: (campo: string, valor: string) => void
  placeholder?: string
}

export function CampoSelect({ campo, opcoes, valor, onChange, placeholder }: CampoSelectProps) {
  return (
    <Select value={valor} onValueChange={(value) => onChange(campo, value)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Selecione..."} />
      </SelectTrigger>
      <SelectContent>
        {opcoes.map((opcao) => (
          <SelectItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
