import { NextResponse, type NextRequest } from "next/server"

import { generateReportIntegrityHash, type ReportIntegrityEntry } from "@/lib/report-integrity"

type VerifyRequest = {
  entries?: ReportIntegrityEntry[]
  hash?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VerifyRequest
    if (!body.entries || !Array.isArray(body.entries) || body.entries.length === 0) {
      return NextResponse.json({ error: "entries é obrigatório e deve conter ao menos um item." }, { status: 400 })
    }

    const { hash } = generateReportIntegrityHash(body.entries)
    const informado = body.hash?.trim()

    return NextResponse.json({
      hashCalculado: hash,
      hashInformado: informado ?? null,
      valido: informado ? informado.toLowerCase() === hash.toLowerCase() : null,
    })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível verificar o hash de integridade." }, { status: 400 })
  }
}
