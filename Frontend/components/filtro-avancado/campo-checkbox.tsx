import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { FiltroConfig } from "@/components/filtro-avancado"

interface CampoCheckboxProps {
  config: FiltroConfig
  valor: boolean
  onChange: (campo: string, valor: boolean) => void
}

export function CampoCheckbox({ config, valor, onChange }: CampoCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={config.campo}
        checked={valor || false}
        onCheckedChange={(checked) => onChange(config.campo, checked as boolean)}
      />
      <Label htmlFor={config.campo} className="text-sm font-normal cursor-pointer">
        {config.label}
      </Label>
    </div>
  )
}
