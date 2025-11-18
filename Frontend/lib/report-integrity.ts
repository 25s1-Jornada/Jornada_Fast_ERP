import { createHash } from "crypto"

export type ReportIntegrityEntry = {
  ordemServicoId: string
  cliente: string
  descricao: string
  tecnico: string
  status: string
  dataAbertura: string
  dataUltimaAtualizacao: string
  valor?: string | number | null
}

const sanitize = (value?: string | number | null) => {
  if (value === null || value === undefined) return ""
  return String(value).replace(/\s+/g, " ").trim()
}

const buildEntryString = (entry: ReportIntegrityEntry) =>
  [
    sanitize(entry.ordemServicoId),
    sanitize(entry.cliente),
    sanitize(entry.descricao),
    sanitize(entry.tecnico),
    sanitize(entry.status),
    sanitize(entry.dataAbertura),
    sanitize(entry.dataUltimaAtualizacao),
    sanitize(entry.valor),
  ].join("|")

export const generateReportIntegrityHash = (entries: ReportIntegrityEntry[]) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Não há dados para gerar o hash de integridade.")
  }

  const baseString = entries.map(buildEntryString).join("\n")
  const hash = createHash("sha256").update(baseString, "utf8").digest("hex")

  return { baseString, hash }
}
