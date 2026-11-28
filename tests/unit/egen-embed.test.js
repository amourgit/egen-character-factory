import { validateManifest } from "@egen-civitas/esm-embed-protocol"
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import { resolveLanguage, SUPPORTED_LANGUAGES } from "../../src/egen/locale"

const ROOT = resolve(__dirname, "../..")
const SCRIPT = join(ROOT, "docker/16-egen-embed.sh")
const TEMPLATE = join(ROOT, "docker/egen-config.json.template")
const dirs = []

function run(env) {
  const html = mkdtempSync(join(tmpdir(), "egen-html-"))
  dirs.push(html)
  const result = spawnSync("sh", [SCRIPT], {
    env: { PATH: process.env.PATH, EGEN_HTML_DIR: html, EGEN_CONFIG_TEMPLATE: TEMPLATE, ...env },
    encoding: "utf8",
  })
  return { ...result, html }
}

afterEach(() => {
  while (dirs.length) rmSync(dirs.pop(), { recursive: true, force: true })
})

describe("déclaration egen-config.json (gabarit)", () => {
  const rendered = JSON.parse(readFileSync(TEMPLATE, "utf8").replace("__CHARACTER_PUBLIC_URL__", "https://character.exemple.org"))

  it("est valide selon le protocole du SDK", () => {
    expect(validateManifest(rendered).ok).toBe(true)
  })

  it("route character, navigation none, rail gauche groupe Conception", () => {
    expect(rendered).toMatchObject({
      name: "@civitas/esm-character-app",
      route: "character",
      technology: "react",
      navigation: { mode: "none" },
      placement: { rail: "left", group: "Conception", icon: "UserRound" },
    })
  })

  it("ne demande que la langue (moindre privilège : ni navigation, ni notifications, ni événements)", () => {
    expect(Object.keys(rendered.capabilities)).toEqual(["locale"])
  })

  it("droits d'iframe demandés, sans navigation du parent", () => {
    expect(rendered.iframe.sandbox).toEqual(["allow-downloads", "allow-modals", "allow-popups-to-escape-sandbox"])
    expect(rendered.iframe.allow).toEqual(["clipboard-read", "clipboard-write", "fullscreen"])
  })
})

describe("docker/16-egen-embed.sh : publication au démarrage", () => {
  it("publie la déclaration (valide) et les origines du Shell", () => {
    const r = run({ CHARACTER_PUBLIC_URL: "https://character.exemple.org/", CHARACTER_FRAME_ANCESTORS: "https://egen.exemple.org, http://localhost:9000" })
    expect(r.status).toBe(0)
    const manifest = JSON.parse(readFileSync(join(r.html, "egen-config.json"), "utf8"))
    expect(manifest.url).toBe("https://character.exemple.org")
    expect(validateManifest(manifest).ok).toBe(true)
    expect(JSON.parse(readFileSync(join(r.html, "egen-host-origins.json"), "utf8"))).toEqual({
      hostOrigins: ["https://egen.exemple.org", "http://localhost:9000"],
    })
  })

  it("variables vides : aucune déclaration publiée, aucune origine (comportement d'origine)", () => {
    const r = run({})
    expect(r.status).toBe(0)
    expect(existsSync(join(r.html, "egen-config.json"))).toBe(false)
    expect(JSON.parse(readFileSync(join(r.html, "egen-host-origins.json"), "utf8"))).toEqual({ hostOrigins: [] })
  })

  it("origines dédoublonnées", () => {
    const r = run({ CHARACTER_FRAME_ANCESTORS: "https://a.org https://a.org" })
    expect(JSON.parse(readFileSync(join(r.html, "egen-host-origins.json"), "utf8")).hostOrigins).toEqual(["https://a.org"])
  })

  it.each(["http://character.exemple.org", "https://user:pw@character.exemple.org", "https://a.org/chemin", "javascript:alert(1)", "https://a.org|touch /tmp/x"])(
    "refuse l'URL publique %j (démarrage en échec, rien de publié)",
    (url) => {
      const r = run({ CHARACTER_PUBLIC_URL: url })
      expect(r.status).not.toBe(0)
      expect(r.stderr).toMatch(/CHARACTER_PUBLIC_URL/)
      expect(existsSync(join(r.html, "egen-config.json"))).toBe(false)
    },
  )

  it("refuse une origine du Shell invalide (jamais *)", () => {
    for (const origin of ["*", "http://evil.org", "https://a.org/x"]) {
      const r = run({ CHARACTER_FRAME_ANCESTORS: origin })
      expect(r.status, origin).not.toBe(0)
      expect(r.stderr).toMatch(/CHARACTER_FRAME_ANCESTORS/)
    }
  })

  it("tolère http://localhost pour le développement", () => {
    const r = run({ CHARACTER_PUBLIC_URL: "http://localhost:8080" })
    expect(r.status).toBe(0)
    expect(JSON.parse(readFileSync(join(r.html, "egen-config.json"), "utf8")).url).toBe("http://localhost:8080")
  })
})

describe("langue du Core → langue de l'app", () => {
  it("sous-tag principal supporté", () => {
    expect(SUPPORTED_LANGUAGES).toEqual(["en", "ru", "zh"])
    expect(resolveLanguage("en-GB")).toBe("en")
    expect(resolveLanguage("ZH_cn")).toBe("zh")
    expect(resolveLanguage(" ru ")).toBe("ru")
  })

  it("langue non traduite ou invalide : l'app garde la sienne", () => {
    for (const value of ["fr", "fr-FR", "", undefined, null, 42]) expect(resolveLanguage(value)).toBeNull()
  })
})
