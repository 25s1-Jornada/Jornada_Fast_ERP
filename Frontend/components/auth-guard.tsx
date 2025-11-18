'use client'

import { useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { token, initializing } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const redirect = useMemo(() => {
    if (!pathname || pathname === "/") return null
    const search = searchParams?.toString()
    const destination = search ? `${pathname}?${search}` : pathname
    return `/?redirect=${encodeURIComponent(destination)}`
  }, [pathname, searchParams])

  useEffect(() => {
    if (!initializing && !token) {
      router.replace(redirect ?? "/")
    }
  }, [initializing, token, redirect, router])

  if (initializing) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Validando sessão...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return null
  }

  return <>{children}</>
}
