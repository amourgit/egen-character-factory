/** Langues de l'interface de Character Factory (clés de `lib/localization/translations.json`). */
export const SUPPORTED_LANGUAGES = ["en", "ru", "zh"]

/**
 * Langue de l'app correspondant à la langue du Core (`fr`, `en-GB`, `zh_CN`…) : sous-tag principal si l'app le
 * traduit, sinon `null` (l'app garde sa langue : repli d'i18next).
 */
export function resolveLanguage(coreLocale) {
  if (typeof coreLocale !== "string") return null
  const primary = coreLocale.trim().toLowerCase().split(/[-_]/)[0]
  return SUPPORTED_LANGUAGES.includes(primary) ? primary : null
}
