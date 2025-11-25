import { Network } from "@capacitor/network"

import { offlineOsQueue, type OfflineOsRecord } from "./offline-os-store"

type SyncResult = {
  synced: OfflineOsRecord[]
  failed: OfflineOsRecord[]
}

type Sender = (payload: OfflineOsRecord) => Promise<{ remoteId?: string }>

export const offlineSync = (() => {
  let isSyncing = false
  let sender: Sender | null = null
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? process.env.BACKEND_API_URL ?? "http://localhost:8080"
  const osEndpoint = `${apiBase}/api/ordem-de-servico`
  const maxRetries = 3
  const baseDelay = 500

  const setSender = (fn: Sender) => {
    sender = fn
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const sendWithRetry: Sender = async (record) => {
    let lastError: unknown
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const method = record.remoteId ? "PUT" : "POST"
        const url = record.remoteId ? `${osEndpoint}/${record.remoteId}` : osEndpoint
        const body = {
          ...record.payload,
          localId: record.localId,
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          const text = await response.text().catch(() => "")
          throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`.trim())
        }

        const data = (await response.json().catch(() => ({}))) as { id?: string; remoteId?: string }
        return { remoteId: data.id ?? data.remoteId }
      } catch (error) {
        lastError = error
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.warn(`Tentativa ${attempt}/${maxRetries} falhou para OS ${record.localId}`, error)
        if (attempt < maxRetries) {
          await sleep(delay)
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Falha ao enviar OS após tentativas")
  }

  const syncQueued = async (): Promise<SyncResult> => {
    const senderToUse = sender ?? sendWithRetry
    if (isSyncing) return { synced: [], failed: [] }

    isSyncing = true
    const synced: OfflineOsRecord[] = []
    const failed: OfflineOsRecord[] = []

    try {
      const queued = await offlineOsQueue.listQueued()

      for (const item of queued) {
        try {
          await offlineOsQueue.markSyncing(item.localId)
          const result = await senderToUse(item)
          const updated = await offlineOsQueue.markSynced(item.localId, result.remoteId)
          if (updated) synced.push(updated)
        } catch (error) {
          console.error("Erro ao sincronizar OS", item.localId, error)
          const updated = await offlineOsQueue.markFailed(item.localId, (error as Error)?.message)
          if (updated) failed.push(updated)
        }
      }
    } finally {
      isSyncing = false
    }

    return { synced, failed }
  }

  const registerNetworkListener = () => {
    if (typeof window === "undefined") return
    Network.addListener("networkStatusChange", async (status) => {
      if (status.connected) {
        try {
          await syncQueued()
        } catch (error) {
          console.error("Falha ao sincronizar ao voltar online", error)
        }
      }
    })
  }

  const init = () => {
    void registerNetworkListener()
  }

  return { setSender, syncQueued, init }
})()

// Conveniência para sincronizar explicitamente (pode ser importado direto).
export const syncQueuedOrders = offlineSync.syncQueued
