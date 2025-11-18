'use client'

import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react"

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

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readPersistedAuth = (): PersistedAuth | null => {
  if (typeof window === "undefined") {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as PersistedAuth
  } catch (error) {
    console.warn("Erro ao ler dados de autenticação persistidos", error)
    window.localStorage.removeItem(STORAGE_KEY)
    window.sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const persisted = readPersistedAuth()
    if (persisted) {
      setUser(persisted.user)
      setToken(persisted.token)
    }
    setInitializing(false)
  }, [])

  const persistAuth = useCallback((payload: PersistedAuth | null, remember: boolean) => {
    if (typeof window === "undefined") return

    window.localStorage.removeItem(STORAGE_KEY)
    window.sessionStorage.removeItem(STORAGE_KEY)

    if (payload) {
      const serialized = JSON.stringify(payload)
      const storage = remember ? window.localStorage : window.sessionStorage
      storage.setItem(STORAGE_KEY, serialized)
    }
  }, [])

  const login = useCallback(
    async (email: string, senha: string, remember = true) => {
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
      persistAuth(payload, remember)

      return payload.user
    },
    [persistAuth],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    persistAuth(null, true)
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
