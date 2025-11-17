"use client"

import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"
import { FileText, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FiltroAvancadoModal, type FiltroValores } from "@/components/filtro-avancado-modal"
import {
  filtrarChamados,
  filtrosChamadosConfig,
  type Chamado,
  type OrdenacaoChamado,
} from "@/app/(app)/ordem-de-servico/chamados/chamados-table"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const formatCurrency = (value: string | number) => {
  const num = typeof value === "number" ? value : Number.parseFloat(value || "0")
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num)
}

const formatDate = (value?: string) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("pt-BR")
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    aberto: "Aberto",
    em_andamento: "Em andamento",
    concluido: "Concluído",
  }
  return map[status] ?? status
}

type NivelDetalhe = "resumido" | "detalhado"

const ordenacaoRelatorioPadrao: OrdenacaoChamado = { campo: "dataAbertura", direcao: "asc" }

const mapOsDtoToChamado = (os: any): Chamado => ({
  id: String(os.id ?? ""),
  cliente: { id: os.cliente?.id ?? "", nome: os.cliente?.nome ?? "" },
  tecnico: { id: os.tecnico?.id ?? "", nome: os.tecnico?.nome ?? "" },
  dataAbertura: os.dataAbertura ?? "",
  dataVisita: os.dataVisita ?? "",
  status: os.status ?? "",
  pedido: os.pedido ?? "",
  dataFaturamento: os.dataFaturamento ?? "",
  garantia: os.garantia ?? "",
  descricoes: (os.descricoes ?? []).map((d: any) => ({
    id: String(d.id ?? ""),
    numeroSerie: d.numeroSerie ?? "",
    defeito: d.defeito ?? "",
    observacao: d.observacao,
  })),
  custosServico: [
    {
      id: String(os.id ?? "custo"),
      nome: "Custos",
      deslocamento: {
        hrSaidaEmpresa: "",
        hrChegadaCliente: "",
        hrSaidaCliente: "",
        hrChegadaEmpresa: "",
        totalHoras: "",
        totalValor: "0",
      },
      horaTrabalhada: {
        hrInicio: "",
        hrTermino: "",
        totalHoras: "",
        totalValor: "0",
      },
      km: { km: "", valorPorKm: "", totalValor: "0" },
      materiais: [],
      subtotal: (os.valorTotal || "R$ 0,00").replace(/[R$\s]/g, ""),
    },
  ],
  valorTotal: (os.valorTotal || "R$ 0,00").replace(/[R$\s]/g, ""),
})

export default function RelatoriosPage() {
  const [filtros, setFiltros] = useState<FiltroValores>({})
  const [nivelDetalhe, setNivelDetalhe] = useState<NivelDetalhe>("resumido")
  const [chamados, setChamados] = useState<Chamado[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<any[]>("/api/OrdensServico/front-list")
        setChamados((data || []).map(mapOsDtoToChamado))
      } catch (error) {
        console.error(error)
        toast({
          title: "Não foi possível carregar as ordens de serviço",
          description: "Tente novamente em instantes.",
          variant: "destructive",
        })
      }
    }
    load()
  }, [toast])

  const chamadosFiltrados = useMemo(
    () => filtrarChamados(chamados, filtros, ordenacaoRelatorioPadrao),
    [chamados, filtros],
  )

  const valorTotal = useMemo(
    () => chamadosFiltrados.reduce((acc, chamado) => acc + Number.parseFloat(chamado.valorTotal || "0"), 0),
    [chamadosFiltrados],
  )

  const totalClientes = useMemo(() => new Set(chamadosFiltrados.map((chamado) => chamado.cliente.nome)).size, [chamadosFiltrados])

  const validarSelecao = () => {
    if (chamadosFiltrados.length === 0) {
      toast({
        title: "Nenhuma OS encontrada",
        description: "Ajuste os filtros para selecionar ao menos uma ordem de serviço.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const construirResumo = (chamado: Chamado) => ({
    ID: chamado.id,
    Cliente: chamado.cliente.nome,
    Técnico: chamado.tecnico.nome,
    Status: formatStatus(chamado.status),
    "Data Abertura": formatDate(chamado.dataAbertura),
    "Data Visita": formatDate(chamado.dataVisita),
    "Valor Total": formatCurrency(chamado.valorTotal),
  })

  const construirDetalhado = (chamado: Chamado) => {
    const defeitos = chamado.descricoes.map((desc) => `${desc.numeroSerie} • ${desc.defeito}`).join(" | ")
    const materiais = chamado.custosServico
      .flatMap((custo) => custo.materiais.map((mat) => `${mat.material} (${mat.quantidade}x)`))
      .join(" | ")

    return {
      ID: chamado.id,
      Pedido: chamado.pedido,
      Cliente: chamado.cliente.nome,
      Técnico: chamado.tecnico.nome,
      Status: formatStatus(chamado.status),
      Garantia: chamado.garantia,
      "Data Abertura": formatDate(chamado.dataAbertura),
      "Data Visita": formatDate(chamado.dataVisita),
      "Data Faturamento": chamado.dataFaturamento,
      Defeitos: defeitos || "-",
      Materiais: materiais || "-",
      "Custos Registrados": chamado.custosServico.length,
      "Valor Total": formatCurrency(chamado.valorTotal),
    }
  }

  const gerarCsv = () => {
    if (!validarSelecao()) return

    const linhas = chamadosFiltrados.map((chamado) =>
      nivelDetalhe === "resumido" ? construirResumo(chamado) : construirDetalhado(chamado),
    )

    const colunas = Object.keys(linhas[0])
    const conteudo = [
      colunas.join(";"),
      ...linhas.map((linha) =>
        colunas
          .map((coluna) => {
            const valor = String(linha[coluna as keyof typeof linha] ?? "")
            return `"${valor.replace(/"/g, '""')}"`
          })
          .join(";"),
      ),
    ].join("\n")

    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-os-${nivelDetalhe}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const gerarPdf = () => {
    if (!validarSelecao()) return

    const doc = new jsPDF({ orientation: "landscape" })
    const margem = 14
    const alturaMax = doc.internal.pageSize.getHeight() - margem
    let cursorY = 20

    doc.setFontSize(18)
    doc.text("Relatório de Ordens de Serviço", margem, cursorY)
    doc.setFontSize(11)
    cursorY += 8
    doc.text(
      `Gerado em ${new Date().toLocaleString("pt-BR")} • Total de OS: ${chamadosFiltrados.length} • Formato: ${
        nivelDetalhe === "resumido" ? "Resumido" : "Detalhado"
      }`,
      margem,
      cursorY,
    )
    cursorY += 8

    const escreverLinhas = (linhas: string[]) => {
      linhas.forEach((linha) => {
        const partes = doc.splitTextToSize(linha, doc.internal.pageSize.getWidth() - margem * 2)
        partes.forEach((parte) => {
          if (cursorY > alturaMax) {
            doc.addPage()
            cursorY = 20
          }
          doc.text(parte, margem, cursorY)
          cursorY += 6
        })
      })
      cursorY += 4
    }

    chamadosFiltrados.forEach((chamado) => {
      const linhas =
        nivelDetalhe === "resumido"
          ? [
              `OS ${chamado.id} • ${chamado.cliente.nome}`,
              `Técnico: ${chamado.tecnico.nome} | Status: ${formatStatus(chamado.status)}`,
              `Abertura: ${formatDate(chamado.dataAbertura)} | Visita: ${formatDate(
                chamado.dataVisita,
              )} | Valor: ${formatCurrency(chamado.valorTotal)}`,
            ]
          : [
              `OS ${chamado.id} • Pedido ${chamado.pedido}`,
              `Cliente: ${chamado.cliente.nome} | Técnico: ${chamado.tecnico.nome}`,
              `Status: ${formatStatus(chamado.status)} | Garantia: ${chamado.garantia} | Valor Total: ${formatCurrency(
                chamado.valorTotal,
              )}`,
              `Defeitos: ${
                chamado.descricoes.map((desc) => `${desc.numeroSerie} - ${desc.defeito}`).join(" | ") || "Não informado"
              }`,
              `Custos: ${
                chamado.custosServico.map((custo) => `${custo.nome} (${formatCurrency(custo.subtotal)})`).join(" | ") ||
                "Sem custos detalhados"
              }`,
              `Materiais: ${
                chamado.custosServico
                  .flatMap((custo) => custo.materiais.map((mat) => `${mat.material} (${mat.quantidade}x)`))
                  .join(" | ") || "Sem materiais"
              }`,
            ]

      escreverLinhas(linhas)
    })

    doc.save(`relatorio-os-${nivelDetalhe}.pdf`)
  }

  const tabelaPreview = chamadosFiltrados.slice(0, 8)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios de OS</h1>
          <p className="text-muted-foreground">
            Gere relatórios resumidos ou detalhados das ordens de serviço com os mesmos filtros utilizados em Chamados.
          </p>
        </div>
        <FiltroAvancadoModal
          configuracao={filtrosChamadosConfig}
          valores={filtros}
          onFiltroChange={setFiltros}
          totalResultados={chamadosFiltrados.length}
          aplicarEmTempoReal
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total de OS selecionadas</CardDescription>
            <CardTitle className="text-3xl">{chamadosFiltrados.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Valor acumulado</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(valorTotal)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Clientes impactados</CardDescription>
            <CardTitle className="text-3xl">{totalClientes}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do relatório</CardTitle>
          <CardDescription>Escolha o nível de detalhe e exporte no formato desejado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:w-1/3">
            <Select value={nivelDetalhe} onValueChange={(valor) => setNivelDetalhe(valor as NivelDetalhe)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resumido">Relatório resumido</SelectItem>
                <SelectItem value="detalhado">Relatório detalhado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={gerarPdf} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button onClick={gerarCsv} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pré-visualização das OS</CardTitle>
          <CardDescription>Mostrando até 8 ordens para referência rápida.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de abertura</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabelaPreview.length > 0 ? (
                tabelaPreview.map((chamado) => (
                  <TableRow key={chamado.id}>
                    <TableCell>{chamado.id}</TableCell>
                    <TableCell>{chamado.cliente.nome}</TableCell>
                    <TableCell>{chamado.tecnico.nome}</TableCell>
                    <TableCell>{formatStatus(chamado.status)}</TableCell>
                    <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                    <TableCell>{formatCurrency(chamado.valorTotal)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Ajuste os filtros para visualizar ordens de serviço.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
