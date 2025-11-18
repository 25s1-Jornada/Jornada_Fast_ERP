import { NextResponse, type NextRequest } from "next/server"

const BACKEND_URL =
  process.env.BACKEND_API_URL ?? process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const payload = await response.json().catch(() => ({}))
    return NextResponse.json(payload, { status: response.status })
  } catch (error) {
    console.error("Erro ao autenticar usuário", error)
    return NextResponse.json({ message: "Não foi possível comunicar com o servidor de autenticação." }, { status: 500 })
  }
}
