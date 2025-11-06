"use client"

import { CampoTexto } from "./campo-texto"
import { CampoNumero } from "./campo-numero"
import { CampoSelect } from "./campo-select"
import { CampoMultiSelect } from "./campo-multiselect"
import { CampoData } from "./campo-data"
import { CampoIntervaloData } from "./campo-intervalo-data"
import { CampoCheckbox } from "./campo-checkbox"
import type { FiltroConfig, FiltroValores } from "../filtro-avancado"

interface RenderizadorCampoProps {
  config: FiltroConfig
  valores: FiltroValores
  onChange: (campo: string, valor: any) => void
  onMultiSelectChange?: (campo: string, valor: string, checked: boolean) => void
  mostrarFiltrosCliente?: boolean
  mostrarFiltrosTecnico?: boolean
}

export function RenderizadorCampo({
  config,
  valores,
  onChange,
  onMultiSelectChange,
  mostrarFiltrosCliente = false,
  mostrarFiltrosTecnico = false,
}: RenderizadorCampoProps) {
  const valor = valores[config.campo]

  switch (config.tipo) {
    case "texto":
      return (
        <CampoTexto
          campo={config.campo}
          placeholder={config.placeholder}
          valor={valor || ""}
          onChange={onChange}
          mostrarFiltrosCliente={mostrarFiltrosCliente}
          mostrarFiltrosTecnico={mostrarFiltrosTecnico}
        />
      )

    case "numero":
      return (
        <CampoNumero campo={config.campo} placeholder={config.placeholder} valor={valor || ""} onChange={onChange} />
      )

    case "select":
      return (
        <CampoSelect
          campo={config.campo}
          opcoes={config.opcoes || []}
          valor={valor || ""}
          onChange={onChange}
          placeholder={config.placeholder}
        />
      )

    case "multiselect":
      return (
        <CampoMultiSelect
          campo={config.campo}
          opcoes={config.opcoes || []}
          valores={valor || []}
          onChange={onMultiSelectChange || (() => {})}
        />
      )

    case "data":
      return <CampoData campo={config.campo} valor={valor || ""} onChange={onChange} />

    case "intervalo_data":
      return <CampoIntervaloData campo={config.campo} valor={valor || {}} onChange={onChange} />

    case "checkbox":
      return <CampoCheckbox campo={config.campo} valor={valor || false} onChange={onChange} />

    default:
      return null
  }
}
