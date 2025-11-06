import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CampoCheckboxProps {
  campo: string
  valor: boolean
  onChange: (campo: string, valor: boolean) => void
  label?: string
}

export function CampoCheckbox({ campo, valor, onChange, label }: CampoCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={campo} checked={valor} onCheckedChange={(checked) => onChange(campo, !!checked)} />
      {label && (
        <Label htmlFor={campo} className="text-sm cursor-pointer">
          {label}
        </Label>
      )}
    </div>
  )
}
