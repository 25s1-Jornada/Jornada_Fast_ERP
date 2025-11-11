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
  valores?: FiltroValores
  valor?: any
  onChange: (campo: string, valor: any) => void
  onMultiSelectChange?: (campo: string, valor: string, checked: boolean) => void
  mostrarFiltrosCliente?: boolean
  mostrarFiltrosTecnico?: boolean
}

export function RenderizadorCampo({
  config,
  valores = {},
  valor,
  onChange,
  onMultiSelectChange,
  mostrarFiltrosCliente = false,
  mostrarFiltrosTecnico = false,
}: RenderizadorCampoProps) {
  const valorAtual = valor ?? valores[config.campo]

  switch (config.tipo) {
    case "texto":
      return (
        <CampoTexto
          campo={config.campo}
          placeholder={config.placeholder}
          valor={valorAtual || ""}
          onChange={onChange}
          mostrarFiltrosCliente={mostrarFiltrosCliente}
          mostrarFiltrosTecnico={mostrarFiltrosTecnico}
        />
      )

    case "numero":
      return (
        <CampoNumero campo={config.campo} placeholder={config.placeholder} valor={valorAtual || ""} onChange={onChange} />
      )

    case "select":
      return (
        <CampoSelect
          campo={config.campo}
          opcoes={config.opcoes || []}
          valor={valorAtual || ""}
          onChange={onChange}
          placeholder={config.placeholder}
        />
      )

    case "multiselect":
      return (
        <CampoMultiSelect
          campo={config.campo}
          opcoes={config.opcoes || []}
          valores={valorAtual || []}
          onChange={onMultiSelectChange || (() => {})}
        />
      )

    case "data":
      return <CampoData campo={config.campo} valor={valorAtual || ""} onChange={onChange} />

    case "intervalo_data":
      return <CampoIntervaloData campo={config.campo} valor={valorAtual || {}} onChange={onChange} />

    case "checkbox":
      return <CampoCheckbox campo={config.campo} valor={valorAtual || false} onChange={onChange} />

    default:
      return null
  }
}
