"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, SlidersHorizontal, RotateCcw, Check, X, Filter, Calendar, Users, Settings } from "lucide-react"
import { FiltrosSalvos } from "./filtros-salvos"
import { RenderizadorCampo } from "./renderizador-campo"
//import { RenderizadorCampo } from "./filtro-avancado/renderizador-campo"
//import { FiltrosSalvos } from "./filtro-avancado/filtros-salvos"

export interface FiltroConfig {
  campo: string
  label: string
  tipo: "texto" | "numero" | "select" | "multiselect" | "data" | "intervalo_data" | "checkbox"
  opcoes?: { value: string; label: string }[]
  placeholder?: string
  categoria?: "geral" | "pessoas" | "datas" | "valores"
}

export interface FiltroValores {
  [key: string]: any
}

interface FiltroAvancadoModalProps {
  configuracao: FiltroConfig[]
  valores: FiltroValores
  onFiltroChange: (valores: FiltroValores) => void
  totalResultados: number
  onSalvarFiltro?: (nome: string, filtro: FiltroValores) => void
  onCarregarFiltro?: (filtro: FiltroValores) => void
  filtrosSalvos?: { nome: string; filtro: FiltroValores }[]
  onExcluirFiltro?: (nome: string) => void
  mostrarFiltrosCliente?: boolean
  mostrarFiltrosTecnico?: boolean
  aplicarEmTempoReal?: boolean
}

export function FiltroAvancadoModal({
  configuracao,
  valores,
  onFiltroChange,
  totalResultados,
  onSalvarFiltro,
  onCarregarFiltro,
  filtrosSalvos = [],
  onExcluirFiltro,
  mostrarFiltrosCliente = false,
  mostrarFiltrosTecnico = false,
  aplicarEmTempoReal = false,
}: FiltroAvancadoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<FiltroValores>({})
  const [nomeFiltroSalvar, setNomeFiltroSalvar] = useState("")
  const [filtrosSalvosExpanded, setFiltrosSalvosExpanded] = useState(false)

  // Sincronizar filtros temporários quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setFiltrosTemporarios(valores)
    }
  }, [isOpen, valores])

  // Função para contar filtros ativos
  const contarFiltrosAtivos = (valoresFiltros: FiltroValores) => {
    return Object.entries(valoresFiltros).filter(([_, valor]) => {
      if (Array.isArray(valor)) return valor.length > 0
      if (typeof valor === "string") return valor.trim() !== ""
      if (typeof valor === "object" && valor !== null) {
        return Object.values(valor).some((v) => v !== "" && v !== null && v !== undefined)
      }
      return valor !== "" && valor !== null && valor !== undefined
    }).length
  }

  const handleValorChange = (campo: string, valor: any) => {
    if (aplicarEmTempoReal) {
      const novosValores = { ...valores, [campo]: valor }
      onFiltroChange(novosValores)
    } else {
      const novosValores = { ...filtrosTemporarios, [campo]: valor }
      setFiltrosTemporarios(novosValores)
    }
  }

  const handleMultiSelectChange = (campo: string, valor: string, checked: boolean) => {
    const valoresAtuais = aplicarEmTempoReal ? valores[campo] || [] : filtrosTemporarios[campo] || []
    let novosValores: string[]

    if (checked) {
      novosValores = [...valoresAtuais, valor]
    } else {
      novosValores = valoresAtuais.filter((v: string) => v !== valor)
    }

    handleValorChange(campo, novosValores)
  }

  const aplicarFiltros = () => {
    if (!aplicarEmTempoReal) {
      onFiltroChange(filtrosTemporarios)
    }
    setIsOpen(false)
  }

  const limparFiltros = () => {
    const filtrosVazios = {}

    // Sempre limpa ambos os estados
    setFiltrosTemporarios(filtrosVazios)
    onFiltroChange(filtrosVazios)

    // Limpa localStorage também
    localStorage.removeItem("filtro_preferencias")

    console.log("Filtros limpos:", { filtrosVazios, aplicarEmTempoReal })
  }

  const cancelar = () => {
    if (!aplicarEmTempoReal) {
      setFiltrosTemporarios(valores)
    }
    setIsOpen(false)
  }

  // Determina quais valores usar para exibição
  const valoresParaExibir = aplicarEmTempoReal ? valores : filtrosTemporarios
  const filtrosAtivos = contarFiltrosAtivos(valoresParaExibir)

  const filtrosAtivosPorCategoria = {
    geral: configuracao.filter(
      (c) =>
        (!c.categoria || c.categoria === "geral") &&
        valoresParaExibir[c.campo] &&
        (Array.isArray(valoresParaExibir[c.campo])
          ? valoresParaExibir[c.campo].length > 0
          : Boolean(valoresParaExibir[c.campo])),
    ),
    pessoas: configuracao.filter(
      (c) =>
        c.categoria === "pessoas" &&
        valoresParaExibir[c.campo] &&
        (Array.isArray(valoresParaExibir[c.campo])
          ? valoresParaExibir[c.campo].length > 0
          : Boolean(valoresParaExibir[c.campo])),
    ),
    datas: configuracao.filter(
      (c) =>
        c.categoria === "datas" &&
        valoresParaExibir[c.campo] &&
        (Array.isArray(valoresParaExibir[c.campo])
          ? valoresParaExibir[c.campo].length > 0
          : Boolean(valoresParaExibir[c.campo])),
    ),
    valores: configuracao.filter(
      (c) =>
        c.categoria === "valores" &&
        valoresParaExibir[c.campo] &&
        (Array.isArray(valoresParaExibir[c.campo])
          ? valoresParaExibir[c.campo].length > 0
          : Boolean(valoresParaExibir[c.campo])),
    ),
  }

  const renderFiltrosPorCategoria = (categoria: "geral" | "pessoas" | "datas" | "valores") => {
    const filtrosCategoria = configuracao.filter((config) => {
      if (categoria === "geral") return !config.categoria || config.categoria === "geral"
      return config.categoria === categoria
    })

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtrosCategoria.map((config) => (
          <div key={config.campo} className="space-y-3">
            <Label className="text-sm font-medium">{config.label}</Label>
            <RenderizadorCampo
              config={config}
              valores={valoresParaExibir}
              onChange={handleValorChange}
              onMultiSelectChange={handleMultiSelectChange}
              mostrarFiltrosCliente={mostrarFiltrosCliente}
              mostrarFiltrosTecnico={mostrarFiltrosTecnico}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {contarFiltrosAtivos(valores) > 0 && (
            <Badge variant="secondary" className="ml-1">
              {contarFiltrosAtivos(valores)}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filtros Avançados
            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
              <Search className="h-4 w-4" />
              {totalResultados} resultado{totalResultados !== 1 ? "s" : ""}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs defaultValue="geral" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Geral
                {filtrosAtivosPorCategoria.geral.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {filtrosAtivosPorCategoria.geral.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pessoas" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pessoas
                {filtrosAtivosPorCategoria.pessoas.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {filtrosAtivosPorCategoria.pessoas.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="datas" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datas
                {filtrosAtivosPorCategoria.datas.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {filtrosAtivosPorCategoria.datas.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="salvos" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Salvos
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 min-h-0">
              <ScrollArea className="h-full pr-4">
                <TabsContent value="geral" className="mt-0 space-y-6">
                  {renderFiltrosPorCategoria("geral")}
                </TabsContent>

                <TabsContent value="pessoas" className="mt-0 space-y-6">
                  {renderFiltrosPorCategoria("pessoas")}
                </TabsContent>

                <TabsContent value="datas" className="mt-0 space-y-6">
                  {renderFiltrosPorCategoria("datas")}
                </TabsContent>

                <TabsContent value="salvos" className="mt-0 space-y-6">
                  <FiltrosSalvos
                    filtrosAtivos={filtrosAtivos}
                    nomeFiltroSalvar={nomeFiltroSalvar}
                    setNomeFiltroSalvar={setNomeFiltroSalvar}
                    filtrosSalvosExpanded={filtrosSalvosExpanded}
                    setFiltrosSalvosExpanded={setFiltrosSalvosExpanded}
                    onSalvarFiltro={onSalvarFiltro}
                    onCarregarFiltro={(filtro) => {
                      if (aplicarEmTempoReal) {
                        onCarregarFiltro?.(filtro)
                      } else {
                        setFiltrosTemporarios(filtro)
                      }
                    }}
                    filtrosSalvos={filtrosSalvos}
                    onExcluirFiltro={onExcluirFiltro}
                    valores={valoresParaExibir}
                  />
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        <Separator className="flex-shrink-0" />

        <DialogFooter className="flex justify-between flex-shrink-0">
          <div className="flex gap-2">
            {(contarFiltrosAtivos(valores) > 0 || filtrosAtivos > 0) && (
              <Button variant="outline" onClick={limparFiltros}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={cancelar}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={aplicarFiltros}>
              <Check className="h-4 w-4 mr-2" />
              {aplicarEmTempoReal ? "Fechar" : "Aplicar Filtros"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
