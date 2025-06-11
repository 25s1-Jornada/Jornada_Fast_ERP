"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface OrdenacaoProps {
  camposOrdenacao: { value: string; label: string }[]
  ordenacaoAtual: { campo: string; direcao: "asc" | "desc" }
  onOrdenacaoChange: (campo: string, direcao: "asc" | "desc") => void
}

export function Ordenacao({ camposOrdenacao, ordenacaoAtual, onOrdenacaoChange }: OrdenacaoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getIconeOrdenacao = () => {
    if (ordenacaoAtual.direcao === "asc") {
      return <ArrowUp className="h-4 w-4" />
    } else if (ordenacaoAtual.direcao === "desc") {
      return <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

  const getLabelCampo = () => {
    const campo = camposOrdenacao.find((c) => c.value === ordenacaoAtual.campo)
    return campo?.label || "Ordenar"
  }

  const toggleDirecao = () => {
    const novaDirecao = ordenacaoAtual.direcao === "asc" ? "desc" : "asc"
    onOrdenacaoChange(ordenacaoAtual.campo, novaDirecao)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {getIconeOrdenacao()}
            <span className="hidden sm:inline">{getLabelCampo()}</span>
            <span className="hidden sm:inline">({ordenacaoAtual.direcao === "asc" ? "Crescente" : "Decrescente"})</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ordenar por</Label>
              <Select
                value={ordenacaoAtual.campo}
                onValueChange={(campo) => onOrdenacaoChange(campo, ordenacaoAtual.direcao)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  {camposOrdenacao.map((campo) => (
                    <SelectItem key={campo.value} value={campo.value}>
                      {campo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Direção</Label>
              <div className="flex gap-2">
                <Button
                  variant={ordenacaoAtual.direcao === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onOrdenacaoChange(ordenacaoAtual.campo, "asc")}
                  className="flex-1"
                >
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Crescente
                </Button>
                <Button
                  variant={ordenacaoAtual.direcao === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onOrdenacaoChange(ordenacaoAtual.campo, "desc")}
                  className="flex-1"
                >
                  <ArrowDown className="h-4 w-4 mr-1" />
                  Decrescente
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={toggleDirecao} className="w-full">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Alternar Direção
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
