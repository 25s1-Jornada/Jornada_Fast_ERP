"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"
import { FileText, Download } from "lucide-react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FiltroAvancadoModal, type FiltroValores } from "@/components/filtro-avancado-modal"
import {
  chamadosMock,
  filtrarChamados,
  filtrosChamadosConfig,
  type Chamado,
  type OrdenacaoChamado,
} from "@/app/(app)/ordem-de-servico/chamados/chamados-table"
import { useToast } from "@/hooks/use-toast"

const HASH_VERIFY_HINT = "Para validar automaticamente, acesse:"

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

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const toUint8Array = (value: ArrayBuffer | Uint8Array) => (value instanceof Uint8Array ? value : new Uint8Array(value))

const encodeBase64 = (value: string) => btoa(unescape(encodeURIComponent(value)))

type NivelDetalhe = "resumido" | "detalhado"

const ordenacaoRelatorioPadrao: OrdenacaoChamado = { campo: "dataAbertura", direcao: "asc" }

type ReportIntegrityEntryPayload = {
  ordemServicoId: string
  cliente: string
  descricao: string
  tecnico: string
  status: string
  dataAbertura: string
  dataUltimaAtualizacao: string
  valor?: string
}

const construirDescricaoRelatorio = (chamado: Chamado) => {
  if (!chamado.descricoes || chamado.descricoes.length === 0) return "-"

  return chamado.descricoes
    .map((descricao) =>
      [descricao.numeroSerie, descricao.defeito, descricao.observacao]
        .filter(Boolean)
        .join(" - "),
    )
    .join(" || ")
}

const obterDataUltimaAtualizacao = (chamado: Chamado) =>
  chamado.dataVisita || chamado.dataFaturamento || chamado.dataAbertura

export default function RelatoriosPage() {
  const [filtros, setFiltros] = useState<FiltroValores>({})
  const [nivelDetalhe, setNivelDetalhe] = useState<NivelDetalhe>("resumido")
  const [hashIntegridade, setHashIntegridade] = useState("")
  const [hashStatus, setHashStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [verifyPageUrl, setVerifyPageUrl] = useState("/verificar-relatorio")
  const [verifyEndpointUrl, setVerifyEndpointUrl] = useState("/api/report-integrity/verify")
  const { toast } = useToast()

  const chamadosFiltrados = useMemo(
    () => filtrarChamados(chamadosMock, filtros, ordenacaoRelatorioPadrao),
    [filtros],
  )

  const valorTotal = useMemo(
    () => chamadosFiltrados.reduce((acc, chamado) => acc + Number.parseFloat(chamado.valorTotal || "0"), 0),
    [chamadosFiltrados],
  )

  const totalClientes = useMemo(() => new Set(chamadosFiltrados.map((chamado) => chamado.cliente.nome)).size, [chamadosFiltrados])

  const entradasIntegridade = useMemo<ReportIntegrityEntryPayload[]>(
    () =>
      chamadosFiltrados.map((chamado) => ({
        ordemServicoId: chamado.id,
        cliente: chamado.cliente.nome,
        descricao: construirDescricaoRelatorio(chamado),
        tecnico: chamado.tecnico.nome,
        status: chamado.status,
        dataAbertura: chamado.dataAbertura,
        dataUltimaAtualizacao: obterDataUltimaAtualizacao(chamado),
        valor: chamado.valorTotal,
      })),
    [chamadosFiltrados],
  )

  const calcularHashRelatorio = useCallback(async () => {
    if (entradasIntegridade.length === 0) {
      setHashIntegridade("")
      setHashStatus("idle")
      return ""
    }

    setHashStatus("loading")
    try {
      const resposta = await fetch("/api/report-integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: entradasIntegridade }),
      })

      if (!resposta.ok) throw new Error("Falha ao gerar hash")

      const data = (await resposta.json()) as { hash?: string }
      if (!data.hash) throw new Error("Hash ausente")

      setHashIntegridade(data.hash)
      setHashStatus("ready")
      return data.hash
    } catch (error) {
      setHashIntegridade("")
      setHashStatus("error")
      toast({
        title: "Erro ao gerar hash",
        description: "Não foi possível gerar o hash de integridade do relatório.",
        variant: "destructive",
      })
      return ""
    }
  }, [entradasIntegridade, toast])

  useEffect(() => {
    void calcularHashRelatorio()
  }, [calcularHashRelatorio])

  useEffect(() => {
    if (typeof window === "undefined") return
    const origin = window.location.origin
    setVerifyPageUrl(`${origin}/verificar-relatorio`)
    setVerifyEndpointUrl(`${origin}/api/report-integrity/verify`)
  }, [])

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

  const gerarCsv = async () => {
    if (!validarSelecao()) return

    const hash = (await calcularHashRelatorio()) || hashIntegridade || "N/D"

    const linhas = chamadosFiltrados.map((chamado) =>
      nivelDetalhe === "resumido" ? construirResumo(chamado) : construirDetalhado(chamado),
    )

    const colunas = Object.keys(linhas[0])
    const conteudoBase = [
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

    const payload = {
      hash,
      geradoEm: new Date().toISOString(),
      nivelDetalhe,
      filtrosAtivos: filtros,
      entries: entradasIntegridade,
    }
    const payloadBase64 = encodeBase64(JSON.stringify(payload))

    const conteudo = `${conteudoBase}\n\nHash de Integridade: ${hash}\n${HASH_VERIFY_HINT} ${verifyPageUrl}\n#INTEGRITY_DATA:${payloadBase64}`

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

  const gerarPdf = async () => {
    if (!validarSelecao()) return

    const hash = (await calcularHashRelatorio()) || hashIntegridade || "N/D"

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

    escreverLinhas([`Hash de Integridade: ${hash}`, `${HASH_VERIFY_HINT} ${verifyPageUrl}`])

  

    const payload = {
      hash,
      geradoEm: new Date().toISOString(),
      nivelDetalhe,
      filtrosAtivos: filtros,
      entries: entradasIntegridade,
    }
    const payloadBase64 = encodeBase64(JSON.stringify(payload))
    const marker = `\n%%INTEGRITY_DATA:${payloadBase64}\n`

    const pdfArrayBuffer = doc.output("arraybuffer") as ArrayBuffer
    const pdfBytes = toUint8Array(pdfArrayBuffer)
    const markerBytes = new TextEncoder().encode(marker)
    const merged = new Uint8Array(pdfBytes.length + markerBytes.length)
    merged.set(pdfBytes)
    merged.set(markerBytes, pdfBytes.length)

    const blob = new Blob([merged], { type: "application/pdf" })
    downloadBlob(blob, `relatorio-os-${nivelDetalhe}.pdf`)
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

      <Card>
        <CardHeader>
          <CardTitle>Integridade do relatório</CardTitle>
          <CardDescription>Hash SHA-256 gerado a partir dos dados exportados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-mono text-sm break-all">
            Hash de Integridade:{" "}
            {hashStatus === "ready"
              ? hashIntegridade
              : hashStatus === "loading"
                ? "Gerando hash de integridade..."
                : chamadosFiltrados.length === 0
                  ? "Nenhuma OS selecionada."
                  : "Não foi possível gerar o hash no momento."}
          </p>
          <p className="text-sm text-muted-foreground">
            {HASH_VERIFY_HINT}{" "}
            <a href={verifyPageUrl} target="_blank" rel="noreferrer" className="underline text-primary">
              {verifyPageUrl}
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Os arquivos PDF/CSV já carregam os dados invisíveis necessários para validação, mantendo o fluxo simples para o usuário final.
          </p>
          <Button variant="outline" asChild>
            <Link href="/verificar-relatorio">Abrir verificador</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
