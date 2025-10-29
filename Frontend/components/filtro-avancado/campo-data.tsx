"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { FiltroConfig } from "@/components/filtro-avancado"

interface CampoDataProps {
  config: FiltroConfig
  valor: string
  onChange: (campo: string, valor: string) => void
}

export function CampoData({ config, valor, onChange }: CampoDataProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {valor ? format(new Date(valor), "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={valor ? new Date(valor) : undefined}
          onSelect={(date) => onChange(config.campo, date?.toISOString().split("T")[0] || "")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
