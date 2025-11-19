"use client"

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"

type AuthState = {
  token?: string
  perfilNome?: string
  perfilId?: number
  email?: string
}

type AuthContextType = AuthState & { refresh: () => void }

const AuthContext = createContext<AuthContextType>({ refresh: () => {} })

function readAuth(): AuthState {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token") ?? undefined
  const perfilNome = localStorage.getItem("perfilNome") ?? undefined
  const perfilIdRaw = localStorage.getItem("perfilId")
  const perfilId = perfilIdRaw ? Number(perfilIdRaw) : undefined
  const email = localStorage.getItem("email") ?? undefined
  return { token, perfilNome, perfilId, email }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({})

  const refresh = () => {
    setState(readAuth())
  }

  useEffect(() => {
    refresh()
    const handler = () => refresh()
    window.addEventListener("storage", handler)
    window.addEventListener("auth-changed", handler as any)
    return () => {
      window.removeEventListener("storage", handler)
      window.removeEventListener("auth-changed", handler as any)
    }
  }, [])

  return <AuthContext.Provider value={{ ...state, refresh }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
