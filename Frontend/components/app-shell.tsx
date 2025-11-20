"use client"

import type { PropsWithChildren } from "react"

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16 bg-gray-50">
        <Sidebar />
        <main className="flex-1 md:ml-[220px] w-full min-w-0 px-3 pb-8 pt-4 sm:px-4 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <Toaster />
    </>
  )
}
