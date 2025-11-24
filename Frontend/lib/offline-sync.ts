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

  const setSender = (fn: Sender) => {
    sender = fn
  }

  const syncQueued = async (): Promise<SyncResult> => {
    if (!sender) throw new Error("Nenhum sender configurado para sincronizar OS.")
    if (isSyncing) return { synced: [], failed: [] }

    isSyncing = true
    const synced: OfflineOsRecord[] = []
    const failed: OfflineOsRecord[] = []

    try {
      const queued = await offlineOsQueue.listQueued()

      for (const item of queued) {
        try {
          await offlineOsQueue.markSynced(item.localId, item.remoteId)
          await offlineOsQueue.markSyncing(item.localId)
          const result = await sender(item)
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
