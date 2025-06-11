"use client"

import { memo } from "react"
import { CampoTexto } from "./campo-texto"
import { CampoNumero } from "./campo-numero"
import { CampoSelect } from "./campo-select"
import { CampoMultiSelect } from "./campo-multiselect"
import { CampoData } from "./campo-data"
import { CampoIntervaloData } from "./campo-intervalo-data"
import { CampoCheckbox } from "./campo-checkbox"
import type { FiltroConfig, FiltroValores } from "@/components/filtro-avancado"

interface RenderizadorCampoProps {
  config: FiltroConfig
  valores: FiltroValores
  onChange: (campo: string, valor: any) => void
  onMultiSelectChange: (campo: string, valor: string, checked: boolean) => void
  mostrarFiltrosCliente?: boolean
  mostrarFiltrosTecnico?: boolean
}

export const RenderizadorCampo = memo(function RenderizadorCampo({
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
      return <CampoTexto config={config} valor={valor} onChange={onChange} />

    case "numero":
      return <CampoNumero config={config} valor={valor} onChange={onChange} />

    case "select":
      return <CampoSelect config={config} valor={valor} onChange={onChange} />

    case "multiselect":
      const mostrarFiltroTexto =
        (config.campo === "cliente" && mostrarFiltrosCliente) || (config.campo === "tecnico" && mostrarFiltrosTecnico)

      return (
        <CampoMultiSelect
          config={config}
          valores={valores}
          onChange={onChange}
          onMultiSelectChange={onMultiSelectChange}
          mostrarFiltroTexto={mostrarFiltroTexto}
        />
      )

    case "data":
      return <CampoData config={config} valor={valor} onChange={onChange} />

    case "intervalo_data":
      return <CampoIntervaloData config={config} valor={valor} onChange={onChange} />

    case "checkbox":
      return <CampoCheckbox config={config} valor={valor} onChange={onChange} />

    default:
      return null
  }
})
