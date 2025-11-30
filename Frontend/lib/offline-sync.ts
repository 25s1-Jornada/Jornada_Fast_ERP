import { Network } from "@capacitor/network"

import { offlineOsQueue, type OfflineOsAttachment, type OfflineOsRecord } from "./offline-os-store"

type SyncResult = {
  synced: OfflineOsRecord[]
  failed: OfflineOsRecord[]
  attempts: number
}

type Sender = (payload: OfflineOsRecord) => Promise<{ remoteId?: string }>
type SyncOptions = {
  onProgress?: (current: number, total: number, item: OfflineOsRecord) => void
  onLog?: (message: string, context?: Record<string, unknown>) => void
}

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

  const buildMultipart = (record: OfflineOsRecord) => {
    const form = new FormData()
    form.append("payload", JSON.stringify({ ...record.payload, localId: record.localId }))

    (record.payload.anexos ?? []).forEach((anexo: OfflineOsAttachment, index) => {
      if (anexo.data) {
        form.append("anexos", anexo.data, anexo.name)
      } else if (anexo.base64) {
        const bytes = Uint8Array.from(atob(anexo.base64), (c) => c.charCodeAt(0))
        form.append("anexos", new Blob([bytes], { type: anexo.mimeType }), anexo.name)
      } else {
        // Apenas metadata
        form.append(`anexosMetadata[${index}]`, JSON.stringify(anexo))
      }
    })

    return form
  }

  const sendWithRetry: Sender = async (record) => {
    let lastError: unknown
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const method = record.remoteId ? "PUT" : "POST"
        const url = record.remoteId ? `${osEndpoint}/${record.remoteId}` : osEndpoint
        const isMultipart = (record.payload.anexos?.length ?? 0) > 0
        const body = isMultipart ? buildMultipart(record) : JSON.stringify({ ...record.payload, localId: record.localId })
        const headers = isMultipart ? {} : { "Content-Type": "application/json" }

        const response = await fetch(url, {
          method,
          headers,
          body,
        })

        if (!response.ok) {
          const text = await response.text().catch(() => "")
          const message = `HTTP ${response.status} ${response.statusText} ${text}`.trim()
          // Erros de validação não entram em retry
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`VALIDATION:${message}`)
          }
          throw new Error(message)
        }

        const data = (await response.json().catch(() => ({}))) as { id?: string; remoteId?: string }
        return { remoteId: data.id ?? data.remoteId }
      } catch (error) {
        lastError = error
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.warn(`Tentativa ${attempt}/${maxRetries} falhou para OS ${record.localId}`, error)
        if (error instanceof Error && error.message.startsWith("VALIDATION:")) {
          break
        }
        if (attempt < maxRetries) {
          await sleep(delay)
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Falha ao enviar OS após tentativas")
  }

  const syncQueued = async (options?: SyncOptions): Promise<SyncResult> => {
    const senderToUse = sender ?? sendWithRetry
    if (isSyncing) return { synced: [], failed: [], attempts: 0 }

    isSyncing = true
    const synced: OfflineOsRecord[] = []
    const failed: OfflineOsRecord[] = []
    let attempts = 0

    try {
      const queued = await offlineOsQueue.listQueued()
      const total = queued.length

      for (const [index, item] of queued.entries()) {
        options?.onProgress?.(index + 1, total, item)
        try {
          attempts += 1
          await offlineOsQueue.markSyncing(item.localId)
          const result = await senderToUse(item)
          const updated = await offlineOsQueue.markSynced(item.localId, result.remoteId)
          if (updated) {
            // Limpa anexos locais após sincronizar com sucesso
            updated.payload.anexos = []
            await offlineOsQueue.saveDraft(updated.payload)
            synced.push(updated)
          }
        } catch (error) {
          options?.onLog?.("sync_failed", { localId: item.localId, error: String(error) })
          console.error("Erro ao sincronizar OS", item.localId, error)
          const message =
            error instanceof Error && error.message.startsWith("VALIDATION:")
              ? error.message.replace("VALIDATION:", "")
              : (error as Error)?.message
          const updated = await offlineOsQueue.markFailed(item.localId, message)
          if (updated) failed.push(updated)
        }
      }
    } finally {
      isSyncing = false
    }

    return { synced, failed, attempts }
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
