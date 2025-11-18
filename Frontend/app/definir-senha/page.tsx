"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export default function DefinirSenha() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Use ao menos 8 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.")
      return
    }

    try {
      setLoading(true)
      await api.post("/api/auth/first-password", { novaSenha: password })
      if (typeof window !== "undefined") {
        localStorage.removeItem("forcePasswordReset")
      }
      router.replace("/dashboard")
    } catch (err) {
      setError("Não foi possível definir a senha. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex w-full items-center justify-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Definir senha</h1>
        <p className="mt-2 text-sm text-gray-600">Cadastre sua senha para acessar o sistema.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua nova senha"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Salvar e acessar"}
          </Button>
        </form>
      </div>
    </section>
  )
}
