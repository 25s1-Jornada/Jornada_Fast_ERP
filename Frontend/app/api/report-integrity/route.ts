import { NextResponse, type NextRequest } from "next/server"

import { generateReportIntegrityHash, type ReportIntegrityEntry } from "@/lib/report-integrity"

type ReportIntegrityRequest = {
  entries?: ReportIntegrityEntry[]
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReportIntegrityRequest
    const entries = body.entries

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "entries é obrigatório e deve conter ao menos um item." }, { status: 400 })
    }

    const { hash } = generateReportIntegrityHash(entries)

    return NextResponse.json({ hash })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível gerar o hash de integridade." }, { status: 400 })
  }
}
