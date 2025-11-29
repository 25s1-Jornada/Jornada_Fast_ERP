import { Preferences } from "@capacitor/preferences"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const SECURE_KEY = process.env.NEXT_PUBLIC_SECURE_STORAGE_KEY || process.env.SECURE_STORAGE_KEY || ""

const deriveKey = async () => {
  if (!SECURE_KEY) return null
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECURE_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  )
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("fast-erp-offline-salt"),
      iterations: 100_000,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

const encrypt = async (value: string) => {
  const key = await deriveKey()
  if (!key) return value
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = encoder.encode(value)
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)
  const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength)
  buffer.set(iv, 0)
  buffer.set(new Uint8Array(encrypted), iv.byteLength)
  return btoa(String.fromCharCode(...buffer))
}

const decrypt = async (value: string) => {
  const key = await deriveKey()
  if (!key) return value
  const bytes = Uint8Array.from(atob(value), (c) => c.charCodeAt(0))
  const iv = bytes.slice(0, 12)
  const data = bytes.slice(12)
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)
  return decoder.decode(decrypted)
}

const memoryFallback = new Map<string, string>()

export const secureStorage = {
  async setItem(key: string, value: string) {
    try {
      const encrypted = await encrypt(value)
      await Preferences.set({ key, value: encrypted })
    } catch (error) {
      console.warn("SecureStorage fallback to memory:", error)
      memoryFallback.set(key, value)
    }
  },

  async getItem(key: string) {
    try {
      const result = await Preferences.get({ key })
      if (!result.value) return null
      try {
        return await decrypt(result.value)
      } catch {
        return result.value
      }
    } catch {
      return memoryFallback.get(key) ?? null
    }
  },

  async removeItem(key: string) {
    try {
      await Preferences.remove({ key })
    } catch {
      // ignore
    }
    memoryFallback.delete(key)
  },
}
