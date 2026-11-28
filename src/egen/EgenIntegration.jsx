import { connectToEgen } from "@egen-civitas/esm-embed-client"
import { useEffect } from "react"
import i18n from "../lib/localization/i18n"
import { resolveLanguage } from "./locale"

/** Nom de module EGEN (= `name` de /egen-config.json). */
export const EGEN_MODULE_NAME = "@civitas/esm-character-app"

/** Origines du Shell autorisées, publiées au démarrage du conteneur (docker/16-egen-embed.sh). */
async function loadHostOrigins() {
  try {
    const response = await fetch("/egen-host-origins.json", { cache: "no-store" })
    const body = await response.json()
    return Array.isArray(body.hostOrigins) ? body.hostOrigins.filter((o) => typeof o === "string") : []
  } catch {
    return []
  }
}

/**
 * Intégration au Core EGEN via le SDK `esm-embed-client` (protocole v2). Ne rend rien ; sans effet hors iframe.
 * Navigation `none` : l'URL du Core ne reflète pas la page de l'app. Seule la langue du Core est suivie.
 */
export default function EgenIntegration() {
  useEffect(() => {
    if (window.self === window.top) return undefined // hors du Core : mode autonome
    let cancelled = false
    let client = null
    let unsubscribe = null

    ;(async () => {
      const hostOrigins = await loadHostOrigins()
      if (cancelled || hostOrigins.length === 0) return
      const egen = await connectToEgen({ moduleName: EGEN_MODULE_NAME, hostOrigins, capabilities: ["locale"] })
      if (cancelled) {
        egen.close()
        return
      }
      client = egen
      if (!egen.connected || !egen.has("locale")) return
      const apply = (locale) => {
        const language = resolveLanguage(locale)
        if (language) void i18n.changeLanguage(language)
      }
      egen.locale.get().then(apply, () => undefined)
      unsubscribe = egen.locale.onChange(apply)
    })()

    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe.then((off) => off(), () => undefined)
      client?.close()
    }
  }, [])

  return null
}
