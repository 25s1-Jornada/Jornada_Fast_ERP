'use client'

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string)?.trim()
    const password = (formData.get("password") as string) ?? ""

    try {
      setIsSubmitting(true)
      setError(null)
      await login(email, password, remember)
      const redirect = searchParams.get("redirect") ?? "/dashboard"
      router.replace(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível realizar o login.")
    } finally {
      setIsSubmitting(false)
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
              name="email"
              type="email"
              placeholder="voce@empresa.com"
              autoComplete="email"
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
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(Boolean(checked))}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
                Manter credenciais salvas
              </Label>
            </div>
            <p className="text-xs text-gray-500">Seu acesso continua seguro.</p>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full py-6 text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? "Autenticando..." : "Acessar"}
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
