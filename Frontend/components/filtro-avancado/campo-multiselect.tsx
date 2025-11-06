"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, X } from "lucide-react"

interface CampoMultiSelectProps {
  campo: string
  opcoes: { value: string; label: string }[]
  valores: string[]
  onChange: (campo: string, valor: string, checked: boolean) => void
}

export function CampoMultiSelect({ campo, opcoes, valores, onChange }: CampoMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRemoveItem = (valor: string) => {
    onChange(campo, valor, false)
  }

  const handleClearAll = () => {
    valores.forEach((valor) => {
      onChange(campo, valor, false)
    })
  }

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>
              {valores.length > 0 ? `${valores.length} selecionado${valores.length > 1 ? "s" : ""}` : "Selecione..."}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-y-auto p-2">
            {opcoes.map((opcao) => (
              <div key={opcao.value} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                <Checkbox
                  id={`${campo}-${opcao.value}`}
                  checked={valores.includes(opcao.value)}
                  onCheckedChange={(checked) => onChange(campo, opcao.value, !!checked)}
                />
                <label htmlFor={`${campo}-${opcao.value}`} className="text-sm cursor-pointer flex-1">
                  {opcao.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {valores.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {valores.map((valor) => {
            const opcao = opcoes.find((o) => o.value === valor)
            return (
              <Badge key={valor} variant="secondary" className="text-xs">
                {opcao?.label || valor}
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => handleRemoveItem(valor)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
          {valores.length > 1 && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleClearAll}>
              Limpar todos
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
