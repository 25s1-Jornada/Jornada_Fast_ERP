"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Trash2, Edit3, Repeat, ListChecks } from "lucide-react"

import { offlineOsQueue, type OfflineOsRecord } from "@/lib/offline-os-store"
import { syncQueuedOrders } from "@/lib/offline-sync"
import { useToast } from "@/hooks/use-toast"

export default function PendentesPage() {
  const [items, setItems] = useState<OfflineOsRecord[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [includeDrafts, setIncludeDrafts] = useState(false)
  const [progressText, setProgressText] = useState<string | null>(null)
  const { toast } = useToast()

  const load = async () => {
    const statuses: any[] = includeDrafts ? ["failed", "queued", "draft"] : ["failed", "queued"]
    const data = await offlineOsQueue.list({ status: statuses })
    setItems(data)
  }

  useEffect(() => {
    void load()
  }, [includeDrafts])

  const handleSync = async () => {
    setIsSyncing(true)
    const total = items.length
    toast({ title: "Sincronizando", description: `Enviando ${total} item(ns)...` })
    try {
      const result = await syncQueuedOrders({
        onProgress: (current, totalItems, item) => {
          setProgressText(`Enviando ${current}/${totalItems} • ${item.payload.clienteNome || item.localId}`)
        },
      })
      toast({
        title: "Sincronização concluída",
        description: `${result.synced.length} enviado(s), ${result.failed.length} falhou/ram.`,
        variant: result.failed.length > 0 ? "destructive" : "default",
      })
      await load()
    } catch (error) {
      console.error("Falha na sincronização manual", error)
      toast({ title: "Falha ao sincronizar", description: "Tente novamente online.", variant: "destructive" })
    } finally {
      setProgressText(null)
      setIsSyncing(false)
    }
  }

  const handleRetryOne = async (localId: string) => {
    setIsSyncing(true)
    try {
      await offlineOsQueue.markQueued(localId)
      const result = await syncQueuedOrders({
        onProgress: (current, totalItems, item) => {
          setProgressText(`Enviando ${current}/${totalItems} • ${item.payload.clienteNome || item.localId}`)
        },
      })
      toast({
        title: "Retentativa concluída",
        description: `${result.synced.length} enviado(s), ${result.failed.length} falhou/ram.`,
        variant: result.failed.length > 0 ? "destructive" : "default",
      })
      await load()
    } catch (error) {
      toast({ title: "Não foi possível reenviar", description: "Verifique a conexão e tente de novo.", variant: "destructive" })
    } finally {
      setProgressText(null)
      setIsSyncing(false)
    }
  }

  const handleDelete = async (localId: string) => {
    await offlineOsQueue.remove(localId)
    await load()
    toast({ title: "Removido", description: "O item foi removido da fila offline." })
  }

  return (
    <div className="container mx-auto py-6 px-3 sm:px-4 lg:px-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Envios pendentes</h1>
          <p className="text-sm text-muted-foreground">Revise, reenfileire ou remova registros offline antes do envio.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={includeDrafts ? "secondary" : "outline"}
            onClick={() => setIncludeDrafts((prev) => !prev)}
            className="gap-2"
          >
            <ListChecks className="h-4 w-4" />
            {includeDrafts ? "Mostrando rascunhos" : "Incluir rascunhos"}
          </Button>
          <Button onClick={handleSync} disabled={isSyncing || items.length === 0} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sincronizando..." : `Sincronizar (${items.length})`}
          </Button>
        </div>
      </div>

      {progressText ? (
        <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">{progressText}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Fila offline</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Local ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum item pendente.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={`${item.localId}-${index}`}>
                    <TableCell className="font-mono text-xs">{item.localId}</TableCell>
                    <TableCell>{item.payload.clienteNome || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "failed" ? "destructive" : "secondary"} className="capitalize">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.updatedAt).toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRetryOne(item.localId)} disabled={isSyncing}>
                        <Repeat className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/ordem-de-servico/chamados/novo?localId=${item.localId}`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.localId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
