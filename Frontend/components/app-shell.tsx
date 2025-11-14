"use client"

import type { PropsWithChildren } from "react"

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-[220px] bg-gray-50 p-3 sm:p-4 lg:p-6 w-full min-w-0">{children}</main>
      </div>
      <Toaster />
    </>
  )
}
