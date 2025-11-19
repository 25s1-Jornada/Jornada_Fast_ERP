"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await api.post<any>("/api/auth/login", {
        email,
        senha: password,
      })
      const token = response?.token ?? response?.Token
      const requiresReset = response?.requiresPasswordReset ?? response?.RequiresPasswordReset
      const userId = response?.userId ?? response?.UserId
      const perfilNome = response?.perfilNome ?? response?.PerfilNome
      const perfilId = response?.perfilId ?? response?.PerfilId
      const returnedEmail = response?.email ?? response?.Email

      if (!token) {
        throw new Error("Token não retornado.")
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        if (perfilNome) localStorage.setItem("perfilNome", perfilNome)
        if (perfilId) localStorage.setItem("perfilId", String(perfilId))
        if (returnedEmail) localStorage.setItem("email", returnedEmail)
        if (requiresReset) {
          localStorage.setItem("forcePasswordReset", "true")
          if (userId) {
            localStorage.setItem("userId", String(userId))
          }
        } else {
          localStorage.removeItem("forcePasswordReset")
        }
        window.dispatchEvent(new Event("auth-changed"))
      }
      router.push(requiresReset ? "/definir-senha" : "/dashboard")
    } catch (err) {
      setError("Credenciais inválidas. Verifique email e senha.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex w-full items-center justify-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/90">FAST ERP</p>
          <h1 className="text-3xl font-semibold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500">
            Acesse sua conta para gerenciar estoque, ordens de serviço e relatórios.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail corporativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@empresa.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
                Manter credenciais salvas
              </Label>
            </div>
            <p className="text-xs text-gray-500">Seu acesso continua seguro.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full py-6 text-base font-semibold" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Precisa de ajuda?{" "}
          <Link href="#" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Fale com o suporte
          </Link>
        </p>
      </div>
    </section>
  )
}
