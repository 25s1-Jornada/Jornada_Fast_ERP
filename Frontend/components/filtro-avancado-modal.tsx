"use client"

import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, RotateCcw, X } from "lucide-react"
import { RenderizadorCampo } from "./filtro-avancado/renderizador-campo"
import { FiltrosSalvos } from "./filtro-avancado/filtros-salvos"
import type { FiltroConfig, FiltroValores } from "./filtro-avancado"

interface FiltroAvancadoModalProps {
  configuracao: FiltroConfig[]
  valores: FiltroValores
  onFiltroChange: (valores: FiltroValores) => void
  totalResultados?: number
  aplicarEmTempoReal?: boolean
  onSalvarFiltro?: (nome: string, filtro: FiltroValores) => void
  onCarregarFiltro?: (filtro: FiltroValores) => void
  filtrosSalvos?: { nome: string; filtro: FiltroValores }[]
  onExcluirFiltro?: (nome: string) => void
}

export function FiltroAvancadoModal({
  configuracao,
  valores,
  onFiltroChange,
  totalResultados,
  aplicarEmTempoReal = false,
  onSalvarFiltro,
  onCarregarFiltro,
  filtrosSalvos = [],
  onExcluirFiltro,
}: FiltroAvancadoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<FiltroValores>({})

  // Função para contar filtros ativos
  const contarFiltrosAtivos = useCallback((filtros: FiltroValores) => {
    return Object.entries(filtros).filter(([_, valor]) => {
      if (Array.isArray(valor)) {
        return valor.length > 0
      }
      return valor !== undefined && valor !== null && valor !== ""
    }).length
  }, [])

  // Valores para exibir (temporários ou aplicados)
  const valoresParaExibir = aplicarEmTempoReal ? valores : filtrosTemporarios

  // Contagem de filtros ativos
  const filtrosAtivos = contarFiltrosAtivos(valoresParaExibir)
  const filtrosAplicados = contarFiltrosAtivos(valores)

  // Organizar filtros por categoria
  const categorias = useMemo(() => {
    const cats = {
      geral: configuracao.filter(
        (c) =>
          c.campo.includes("busca") ||
          c.campo.includes("status") ||
          c.campo.includes("defeito") ||
          c.campo.includes("codigo"),
      ),
      pessoas: configuracao.filter((c) => c.campo.includes("cliente") || c.campo.includes("tecnico")),
      datas: configuracao.filter((c) => c.tipo === "data" || c.tipo === "intervalo_data"),
    }

    // Adicionar campos restantes à categoria geral
    const camposUsados = new Set([
      ...cats.geral.map((c) => c.campo),
      ...cats.pessoas.map((c) => c.campo),
      ...cats.datas.map((c) => c.campo),
    ])

    const camposRestantes = configuracao.filter((c) => !camposUsados.has(c.campo))
    cats.geral.push(...camposRestantes)

    return cats
  }, [configuracao])

  // Contar filtros por categoria
  const contarFiltrosPorCategoria = useCallback(
    (categoria: FiltroConfig[]) => {
      return categoria.reduce((count, config) => {
        const valor = valoresParaExibir[config.campo]
        if (Array.isArray(valor) && valor.length > 0) return count + 1
        if (valor !== undefined && valor !== null && valor !== "") return count + 1
        return count
      }, 0)
    },
    [valoresParaExibir],
  )

  const sincronizarComFiltrosAplicados = useCallback(() => {
    if (!aplicarEmTempoReal) {
      setFiltrosTemporarios(valores)
    }
  }, [aplicarEmTempoReal, valores])

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      sincronizarComFiltrosAplicados()
    }
    setIsOpen(open)
  }

  const handleOpenModal = () => {
    sincronizarComFiltrosAplicados()
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    sincronizarComFiltrosAplicados()
    setIsOpen(false)
  }

  const handleCancelar = () => {
    sincronizarComFiltrosAplicados()
    setIsOpen(false)
  }

  const handleAplicar = () => {
    onFiltroChange(filtrosTemporarios)
    setIsOpen(false)
  }

  const handleFiltroChange = (campo: string, valor: any) => {
    const novosFiltros = { ...valoresParaExibir, [campo]: valor }

    if (aplicarEmTempoReal) {
      onFiltroChange(novosFiltros)
    } else {
      setFiltrosTemporarios(novosFiltros)
    }
  }

  const handleMultiSelectChange = (campo: string, valor: string, checked: boolean) => {
    const valoresAtuais = (valoresParaExibir[campo] as string[]) || []
    let novosValores: string[]

    if (checked) {
      novosValores = valoresAtuais.includes(valor) ? valoresAtuais : [...valoresAtuais, valor]
    } else {
      novosValores = valoresAtuais.filter((v) => v !== valor)
    }

    handleFiltroChange(campo, novosValores)
  }

  const limparFiltros = () => {
    const filtrosVazios = {}

    if (aplicarEmTempoReal) {
      onFiltroChange(filtrosVazios)
    } else {
      setFiltrosTemporarios(filtrosVazios)
    }
  }

  return (
    <>
      {/* Botão para abrir o modal */}
      <Button variant="outline" onClick={handleOpenModal} className="relative bg-transparent">
        <Filter className="h-4 w-4 mr-2" />
        Filtros
        {filtrosAplicados > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {filtrosAplicados}
          </Badge>
        )}
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent showCloseButton={false} className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avançados
                {totalResultados !== undefined && (
                  <Badge variant="outline">
                    {totalResultados} resultado{totalResultados !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col min-h-0">
            <Tabs defaultValue="geral" className="flex-1 flex flex-col">
              <TabsList className="!flex w-full flex-nowrap gap-2 flex-shrink-0 overflow-x-auto">
                <TabsTrigger value="geral" className="flex-1 flex items-center justify-center gap-2">
                  Geral
                  {contarFiltrosPorCategoria(categorias.geral) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      {contarFiltrosPorCategoria(categorias.geral)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pessoas" className="flex-1 flex items-center justify-center gap-2">
                  Pessoas
                  {contarFiltrosPorCategoria(categorias.pessoas) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      {contarFiltrosPorCategoria(categorias.pessoas)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="datas" className="flex-1 flex items-center justify-center gap-2">
                  Datas
                  {contarFiltrosPorCategoria(categorias.datas) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      {contarFiltrosPorCategoria(categorias.datas)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="salvos" className="flex-1 flex items-center justify-center gap-2">
                  Salvos
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0">
                <TabsContent value="geral" className="h-full mt-4">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-0">
                      {categorias.geral.map((config) => (
                        <div key={config.campo} className="space-y-3">
                          <RenderizadorCampo
                            config={config}
                            valores={valoresParaExibir}
                            onChange={handleFiltroChange}
                            onMultiSelectChange={handleMultiSelectChange}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="pessoas" className="h-full mt-4">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-0">
                      {categorias.pessoas.map((config) => (
                        <div key={config.campo} className="space-y-3">
                          <RenderizadorCampo
                            config={config}
                            valores={valoresParaExibir}
                            onChange={handleFiltroChange}
                            onMultiSelectChange={handleMultiSelectChange}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="datas" className="h-full mt-4">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-0">
                      {categorias.datas.map((config) => (
                        <div key={config.campo} className="space-y-3">
                          <RenderizadorCampo
                            config={config}
                            valores={valoresParaExibir}
                            onChange={handleFiltroChange}
                            onMultiSelectChange={handleMultiSelectChange}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="salvos" className="h-full mt-4">
                  <ScrollArea className="h-full pr-4">
                    <FiltrosSalvos
                      filtrosSalvos={filtrosSalvos}
                      onCarregarFiltro={onCarregarFiltro}
                      onExcluirFiltro={onExcluirFiltro}
                      onSalvarFiltro={onSalvarFiltro}
                      filtrosAtuais={valoresParaExibir}
                    />
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer com ações */}
          <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
            <div className="flex items-center gap-2">
              {filtrosAtivos > 0 && (
                <Button variant="outline" onClick={limparFiltros}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelar}>
                Cancelar
              </Button>
              {!aplicarEmTempoReal && <Button onClick={handleAplicar}>Aplicar Filtros</Button>}
              {aplicarEmTempoReal && <Button onClick={handleCloseModal}>Fechar</Button>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
