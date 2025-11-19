import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.fasterp.app",
  appName: "Fast ERP",
  webDir: "out",
  server: process.env.CAP_SERVER_URL
    ? {
        url: process.env.CAP_SERVER_URL,
        cleartext: true,
      }
    : undefined,
}

export default config
