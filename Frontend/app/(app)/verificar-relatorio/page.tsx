"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReportIntegrityEntry } from "@/lib/report-integrity"
import { useToast } from "@/hooks/use-toast"

type ResultadoVerificacao = {
  status: "idle" | "loading" | "sucesso" | "erro"
  valido?: boolean | null
  hashCalculado?: string
  hashInformado?: string | null
  mensagem?: string
}

const decodeBase64 = (value: string) =>
  decodeURIComponent(
    atob(value)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  )

export default function VerificarRelatorioPage() {
  const [hashInformado, setHashInformado] = useState("")
  const [entries, setEntries] = useState<ReportIntegrityEntry[]>([])
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string>("")
  const [resultado, setResultado] = useState<ResultadoVerificacao>({ status: "idle" })
  const { toast } = useToast()

  const previewEntries = useMemo(() => entries.slice(0, 5), [entries])

  const processarRelatorio = async (file: File) => {
    const extensao = file.name.split(".").pop()?.toLowerCase() ?? ""
    const isPdf = file.type === "application/pdf" || extensao === "pdf"
    const buffer = await file.arrayBuffer()
    const texto = isPdf
      ? new TextDecoder("latin1").decode(buffer)
      : new TextDecoder("utf-8", { fatal: false }).decode(buffer)

    const markerMatch = texto.match(/(?:%%|#)INTEGRITY_DATA:([A-Za-z0-9+/=]+)/)
    if (!markerMatch?.[1]) {
      throw new Error("Marker not found")
    }

    const payload = JSON.parse(decodeBase64(markerMatch[1])) as { entries: ReportIntegrityEntry[]; hash?: string }

    if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
      throw new Error("Payload inválido")
    }

    setEntries(payload.entries)
    if (payload.hash) {
      setHashInformado(payload.hash)
    }
    setRelatorioSelecionado(file.name)

    toast({
      title: "Relatório carregado",
      description: `${payload.entries.length} registros prontos para validação.`,
    })
  }

  const handleRelatorioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      await processarRelatorio(file)
    } catch (error) {
      console.error("Erro ao ler relatório:", error)
      toast({
        title: "Não foi possível ler o relatório",
        description: "Envie um PDF ou CSV exportado após a atualização de integridade.",
        variant: "destructive",
      })
    }
  }

  const verificarHash = async () => {
    if (!entries.length) {
      toast({
        title: "Importe o relatório",
        description: "Faça upload do PDF ou CSV exportado para carregar os dados internos.",
        variant: "destructive",
      })
      return
    }

    if (!hashInformado.trim()) {
      toast({
        title: "Informe o hash",
        description: "Cole o hash exibido no relatório exportado.",
        variant: "destructive",
      })
      return
    }

    setResultado({ status: "loading" })

    try {
      const resposta = await fetch("/api/report-integrity/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, hash: hashInformado.trim() }),
      })

      if (!resposta.ok) {
        throw new Error("Falha ao validar hash")
      }

      const data = (await resposta.json()) as { valido: boolean | null; hashCalculado: string; hashInformado: string | null }

      setResultado({
        status: "sucesso",
        valido: data.valido,
        hashCalculado: data.hashCalculado,
        hashInformado: data.hashInformado,
      })
    } catch (error) {
      console.error("Erro ao verificar hash:", error)
      setResultado({
        status: "erro",
        mensagem: "Não foi possível verificar a integridade. Tente novamente.",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 px-3 sm:px-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verificar integridade do relatório</h1>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Utilize esta página para validar o hash gerado em qualquer relatório exportado. Os arquivos PDF e CSV já transportam,
            de forma invisível, todas as informações necessárias para recalcular o hash.
          </p>
          <p className="text-sm">Basta enviar o relatório exportado e clicar em verificar — nada além do próprio arquivo é exigido.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Faça upload do relatório (PDF ou CSV)</CardTitle>
          <CardDescription>Envie o arquivo exportado para que possamos extrair o hash e os dados embutidos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="file" accept=".pdf,.csv" onChange={handleRelatorioChange} />
          <p className="text-sm text-muted-foreground">
            {relatorioSelecionado
              ? `Relatório selecionado: ${relatorioSelecionado}`
              : "Nenhum relatório importado ainda. Formatos aceitos: PDF ou CSV exportados do sistema."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Ajuste o hash, se necessário</CardTitle>
          <CardDescription>O hash é preenchido automaticamente após o upload, mas você pode substituí-lo manualmente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Ex.: 4c5d... (hash SHA-256)"
            value={hashInformado}
            onChange={(event) => setHashInformado(event.target.value)}
          />
          <Button onClick={verificarHash} disabled={resultado.status === "loading"} className="w-full sm:w-auto">
            {resultado.status === "loading" ? "Verificando..." : "Verificar integridade"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Resultado</CardTitle>
          <CardDescription>Confirmamos abaixo se o hash informado confere com o hash calculado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {resultado.status === "idle" && <p className="text-sm text-muted-foreground">Aguardando dados para validação.</p>}
          {resultado.status === "loading" && <p className="text-sm">Validando hash...</p>}
          {resultado.status === "erro" && (
            <p className="text-sm text-destructive">
              {resultado.mensagem ?? "Não foi possível verificar a integridade neste momento."}
            </p>
          )}
          {resultado.status === "sucesso" && (
            <div className="space-y-2">
              <p className={`font-semibold ${resultado.valido ? "text-green-600" : "text-red-600"}`}>
                {resultado.valido === null
                  ? "Hash calculado, mas nenhum hash informado foi comparado."
                  : resultado.valido
                    ? "Hash válido: o relatório não foi alterado."
                    : "Hash divergente: o relatório foi modificado."}
              </p>
              <p className="text-sm font-mono break-all">Hash calculado: {resultado.hashCalculado}</p>
              {resultado.hashInformado && (
                <p className="text-sm font-mono break-all">Hash informado: {resultado.hashInformado}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {previewEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia dos dados importados</CardTitle>
            <CardDescription>Exibindo até 5 registros para referência rápida.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última atualização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewEntries.map((entry) => (
                  <TableRow key={`${entry.ordemServicoId}-${entry.dataUltimaAtualizacao}`}>
                    <TableCell>{entry.ordemServicoId}</TableCell>
                    <TableCell>{entry.cliente}</TableCell>
                    <TableCell>{entry.tecnico}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                    <TableCell>{entry.dataUltimaAtualizacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
