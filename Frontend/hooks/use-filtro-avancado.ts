"use client"

import { useState, useEffect, useCallback } from "react"
import type { FiltroValores } from "@/components/filtro-avancado"

export function useFiltroAvancado(valores: FiltroValores, onFiltroChange: (valores: FiltroValores) => void) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [nomeFiltroSalvar, setNomeFiltroSalvar] = useState("")
  const [filtrosSalvosExpanded, setFiltrosSalvosExpanded] = useState(false)

  // Debounce para atualizações em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("filtro_preferencias", JSON.stringify(valores))
    }, 500)
    return () => clearTimeout(timer)
  }, [valores])

  // Carregar preferências salvas
useEffect(() => {
  const preferencias = localStorage.getItem("filtro_preferencias")
  if (preferencias) {
    try {
      const filtroSalvo = JSON.parse(preferencias)
      if (Object.keys(filtroSalvo).length > 0) {
        onFiltroChange(filtroSalvo)
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error)
    }
  }
  // Executa apenas uma vez no primeiro render
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []) // <== ESSENCIAL

  const handleValorChange = useCallback(
    (campo: string, valor: any) => {
      const novosValores = { ...valores, [campo]: valor }
      onFiltroChange(novosValores)
    },
    [valores, onFiltroChange],
  )

  const handleMultiSelectChange = useCallback(
    (campo: string, valor: string, checked: boolean) => {
      const valoresAtuais = valores[campo] || []
      let novosValores: string[]

      if (checked) {
        novosValores = [...valoresAtuais, valor]
      } else {
        novosValores = valoresAtuais.filter((v: string) => v !== valor)
      }

      handleValorChange(campo, novosValores)
    },
    [valores, handleValorChange],
  )

  const limparFiltros = useCallback(() => {
    onFiltroChange({})
    localStorage.removeItem("filtro_preferencias")
  }, [onFiltroChange])

  const contarFiltrosAtivos = useCallback(
    (valoresFiltros?: FiltroValores) => {
      const filtrosParaContar = valoresFiltros || valores
      return Object.values(filtrosParaContar).filter((valor) => {
        if (Array.isArray(valor)) return valor.length > 0
        if (typeof valor === "string") return valor.trim() !== ""
        if (typeof valor === "object" && valor !== null) {
          return Object.values(valor).some((v) => v !== "" && v !== null && v !== undefined)
        }
        return valor !== "" && valor !== null && valor !== undefined
      }).length
    },
    [valores],
  )

  return {
    isExpanded,
    setIsExpanded,
    nomeFiltroSalvar,
    setNomeFiltroSalvar,
    filtrosSalvosExpanded,
    setFiltrosSalvosExpanded,
    handleValorChange,
    handleMultiSelectChange,
    limparFiltros,
    contarFiltrosAtivos,
  }
}
