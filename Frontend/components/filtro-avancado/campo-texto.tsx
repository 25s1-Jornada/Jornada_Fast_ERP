"use client"

import { Input } from "@/components/ui/input"

interface CampoTextoProps {
  campo: string
  placeholder?: string
  valor: string
  onChange: (campo: string, valor: string) => void
  mostrarFiltrosCliente?: boolean
  mostrarFiltrosTecnico?: boolean
}

export function CampoTexto({
  campo,
  placeholder,
  valor,
  onChange,
  mostrarFiltrosCliente = false,
  mostrarFiltrosTecnico = false,
}: CampoTextoProps) {
  return <Input placeholder={placeholder} value={valor} onChange={(e) => onChange(campo, e.target.value)} />
}
