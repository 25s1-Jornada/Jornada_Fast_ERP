'use client'

import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { secureStorage } from "@/lib/secure-storage"

type Usuario = {
  id: number
  nome: string
  email: string
  perfilId?: number | null
  perfilNome?: string | null
  empresaId?: number | null
}

type AuthContextValue = {
  user: Usuario | null
  token: string | null
  initializing: boolean
  login: (email: string, senha: string, remember?: boolean) => Promise<Usuario>
  logout: () => void
}

type PersistedAuth = {
  user: Usuario
  token: string
}

const STORAGE_KEY = "fast-erp-auth"
const BYPASS_AUTH_ENABLED = process.env.NEXT_PUBLIC_BYPASS_AUTH !== "false"
const BYPASS_USER_TEMPLATE: Usuario = {
  id: 0,
  nome: "Usuário Demo",
  email: "demo@fast-erp.local",
  perfilId: null,
  perfilNome: "Acesso Livre",
  empresaId: null,
}

const createBypassPayload = (): PersistedAuth => ({
  user: { ...BYPASS_USER_TEMPLATE },
  token: "bypass-token",
})

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  const persistAuth = useCallback(async (payload: PersistedAuth | null) => {
    if (typeof window === "undefined") return
    if (!payload) {
      await secureStorage.removeItem(STORAGE_KEY)
      return
    }
    const serialized = JSON.stringify(payload)
    await secureStorage.setItem(STORAGE_KEY, serialized)
  }, [])

  useEffect(() => {
    const init = async () => {
      if (BYPASS_AUTH_ENABLED) {
        const payload = createBypassPayload()
        setUser(payload.user)
        setToken(payload.token)
        await persistAuth(payload)
        setInitializing(false)
        return
      }

      try {
        const raw = await secureStorage.getItem(STORAGE_KEY)
        if (raw) {
          const persisted = JSON.parse(raw) as PersistedAuth
          setUser(persisted.user)
          setToken(persisted.token)
        }
      } catch (error) {
        console.warn("Erro ao carregar auth seguro", error)
        await secureStorage.removeItem(STORAGE_KEY)
      } finally {
        setInitializing(false)
      }
    }

    void init()
  }, [persistAuth])

  const login = useCallback(
    async (email: string, senha: string, remember = true) => {
      if (BYPASS_AUTH_ENABLED) {
        const payload = createBypassPayload()
        setUser(payload.user)
        setToken(payload.token)
        await persistAuth(payload)
        return payload.user
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        const message = errorBody?.message ?? "Não foi possível realizar o login."
        throw new Error(message)
      }

      const data = (await response.json()) as { token: string; usuario: Usuario }

      const payload: PersistedAuth = { user: data.usuario, token: data.token }
      setUser(payload.user)
      setToken(payload.token)
      await persistAuth(payload)

      return payload.user
    },
    [persistAuth],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    void persistAuth(null)
  }, [persistAuth])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      login,
      logout,
    }),
    [user, token, initializing, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
