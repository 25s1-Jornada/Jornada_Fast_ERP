import Dexie, { type Table } from "dexie"

export type OfflineOsStatus = "draft" | "queued" | "syncing" | "synced" | "failed"

export type OfflineOsAttachment = {
  id: string
  name: string
  mimeType: string
  size: number
  data?: Blob
  base64?: string
}

export type OfflineOsPayload = {
  localId?: string
  remoteId?: string
  clienteId?: string
  clienteNome: string
  tecnicoId?: string
  tecnicoNome: string
  titulo?: string
  descricao?: string
  status?: string
  pedido?: string
  dataAbertura?: string
  dataVisita?: string
  dataFaturamento?: string
  garantia?: string
  valorTotal?: string
  descricoes?: Array<{
    numeroSerie?: string
    defeito?: string
    observacao?: string
  }>
  anexos?: OfflineOsAttachment[]
}

export type OfflineOsRecord = {
  localId: string
  remoteId?: string
  status: OfflineOsStatus
  payload: OfflineOsPayload
  syncAttempts: number
  lastError?: string
  createdAt: string
  updatedAt: string
}

class OfflineOsDB extends Dexie {
  os!: Table<OfflineOsRecord, string>

  constructor() {
    super("offlineOsDB")
    this.version(2)
      .stores({
        os: "&localId,status,updatedAt,createdAt",
      })
      .upgrade((tx) =>
        tx
          .table("os")
          .toCollection()
          .modify((record: any) => {
            if (record?.payload && Array.isArray(record.payload.anexos)) {
              record.payload.anexos = record.payload.anexos.map((anexo: any) => ({
                ...anexo,
                base64: anexo.base64 ?? undefined,
              }))
            }
          }),
      )
  }
}

let db: OfflineOsDB | null = null

const getDb = () => {
  if (typeof window === "undefined") {
    throw new Error("Offline DB só pode ser acessado no cliente.")
  }
  if (!db) db = new OfflineOsDB()
  return db
}

const generateLocalId = () => `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`

const now = () => new Date().toISOString()

export const offlineOsStore = {
  async upsertDraft(payload: OfflineOsPayload, status: OfflineOsStatus = "draft") {
    const database = getDb()
    const localId = payload.localId ?? generateLocalId()
    const record: OfflineOsRecord = {
      localId,
      remoteId: payload.remoteId,
      status,
      payload: { ...payload, localId },
      syncAttempts: 0,
      createdAt: now(),
      updatedAt: now(),
    }
    await database.os.put(record)
    return record
  },

  async markQueued(localId: string) {
    const database = getDb()
    const current = await database.os.get(localId)
    if (!current) return null
    const updated = { ...current, status: "queued", updatedAt: now(), syncAttempts: current.syncAttempts }
    await database.os.put(updated)
    return updated
  },

  async markSyncing(localId: string) {
    const database = getDb()
    const current = await database.os.get(localId)
    if (!current) return null
    const updated = { ...current, status: "syncing", updatedAt: now(), syncAttempts: current.syncAttempts + 1 }
    await database.os.put(updated)
    return updated
  },

  async markSynced(localId: string, remoteId?: string) {
    const database = getDb()
    const current = await database.os.get(localId)
    if (!current) return null
    const updated: OfflineOsRecord = {
      ...current,
      status: "synced",
      remoteId: remoteId ?? current.remoteId,
      updatedAt: now(),
      payload: { ...current.payload, remoteId: remoteId ?? current.remoteId },
    }
    await database.os.put(updated)
    return updated
  },

  async markFailed(localId: string, error?: string) {
    const database = getDb()
    const current = await database.os.get(localId)
    if (!current) return null
    const updated = { ...current, status: "failed", lastError: error, updatedAt: now() }
    await database.os.put(updated)
    return updated
  },

  async remove(localId: string) {
    const database = getDb()
    await database.os.delete(localId)
  },

  async list(filter?: { status?: OfflineOsStatus | OfflineOsStatus[] }) {
    const database = getDb()
    if (!filter?.status) {
      return database.os.orderBy("updatedAt").reverse().toArray()
    }
    const statuses = Array.isArray(filter.status) ? filter.status : [filter.status]
    return database.os.where("status").anyOf(statuses).reverse().sortBy("updatedAt")
  },

  async get(localId: string) {
    const database = getDb()
    return database.os.get(localId)
  },
}

export const offlineOsQueue = {
  async saveDraft(payload: OfflineOsPayload) {
    return offlineOsStore.upsertDraft(payload, "draft")
  },

  async queueForSync(payload: OfflineOsPayload) {
    return offlineOsStore.upsertDraft(payload, "queued")
  },

  async listQueued() {
    return offlineOsStore.list({ status: "queued" })
  },

  async markSynced(localId: string, remoteId?: string) {
    return offlineOsStore.markSynced(localId, remoteId)
  },

  async markFailed(localId: string, reason?: string) {
    return offlineOsStore.markFailed(localId, reason)
  },

  async getLatestDraft() {
    const drafts = await offlineOsStore.list({ status: "draft" })
    return drafts[0] ?? null
  },
}
