'use client'

import type { FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/dashboard")
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
            <Input id="email" type="email" placeholder="voce@empresa.com" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                Esqueci minha senha
              </Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
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

          <Button type="submit" className="w-full py-6 text-base font-semibold">
            Acessar
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
