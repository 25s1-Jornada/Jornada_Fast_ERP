"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { FiltroConfig } from "@/components/filtro-avancado"

interface CampoIntervaloDataProps {
  config: FiltroConfig
  valor: { inicio: string; fim: string }
  onChange: (campo: string, valor: { inicio: string; fim: string }) => void
}

export function CampoIntervaloData({ config, valor, onChange }: CampoIntervaloDataProps) {
  const intervalo = valor || { inicio: "", fim: "" }

  const setPreset = (dias: number) => {
    const hoje = new Date()
    const diasAtras = new Date(hoje.getTime() - dias * 24 * 60 * 60 * 1000)
    onChange(config.campo, {
      inicio: diasAtras.toISOString().split("T")[0],
      fim: hoje.toISOString().split("T")[0],
    })
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Data Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {intervalo.inicio ? format(new Date(intervalo.inicio), "dd/MM", { locale: ptBR }) : "Início"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={intervalo.inicio ? new Date(intervalo.inicio) : undefined}
                onSelect={(date) =>
                  onChange(config.campo, {
                    ...intervalo,
                    inicio: date?.toISOString().split("T")[0] || "",
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs">Data Fim</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {intervalo.fim ? format(new Date(intervalo.fim), "dd/MM", { locale: ptBR }) : "Fim"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={intervalo.fim ? new Date(intervalo.fim) : undefined}
                onSelect={(date) =>
                  onChange(config.campo, {
                    ...intervalo,
                    fim: date?.toISOString().split("T")[0] || "",
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={() => setPreset(7)}>
          7 dias
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPreset(30)}>
          30 dias
        </Button>
      </div>
    </div>
  )
}
