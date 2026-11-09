# Phase 2 — Matrice de compatibilité CharacterStudio / Core EGEN (Frontend-esm-core 9.0.2)

Constats issus du code réel du Core (référence : `esm-annuaire-app`, `docs/guide-montage-apps-rails-zones.md`).

| Sujet | Core EGEN (constaté) | CharacterStudio | Écart / action |
|---|---|---|---|
| Monorepo | yarn 4.10, workspaces `packages/apps/*`, turbo | repo autonome, npm | Passage en workspace yarn ; suppression `package-lock.json` |
| Nom/package | `@egen/esm-<nom>-app`, `main: src/index.ts`, `browser: dist/egen-esm-<nom>-app.js` | `@m3-org/characterstudio` | Renommer en `@egen/esm-character-factory-app` |
| Build | rspack via `@egen-civitas/egen/default-rspack-config`, `rspack --mode=production` | Vite | Remplacer Vite par rspack (config du Core) |
| Langage | TypeScript (tsc, `typescript` task) | JS/JSX | Migration progressive : point d'entrée en TS, reste en JS accepté si tsconfig `allowJs` — à vérifier |
| React | 18.x (peer) | 19.2 | À RÉSOUDRE : rétrograder vers 18 (test de compat three-vrm/R3F-free : l'app n'utilise pas R3F) |
| Point d'entrée | `src/index.ts` exportant `startupApp`, `root` via `getSyncLifecycle/getAsyncLifecycle`, `importTranslation` | `Main.jsx` + createRoot | Créer `index.ts` ; `root` = App ; chargement async recommandé (3D lourde) |
| Routing | `src/routes.json` (pages[] + extensions[], slots) ; route ex. `annuaire` | ViewContext interne | `routes.json` : page `root` route `character-factory` ; ViewContext conservé en interne |
| Navigation shell | extensions `shell-rail-left-slot`, `topbar-nav-slot` + `navEntry`, validé par `tools/check-nav-routes.mjs` | menus propres | Déclarer rail + nav entries ; pas de sidebar/navbar propre (interdit) |
| i18n | `translations/*.json`, `importTranslation` lazy | i18next propre | Basculer sur le système de traductions du Core |
| Config | `defineConfigSchema(moduleName, configSchema)` | `VITE_ASSET_PATH` | Chemin des assets via config schema |
| Styles/UI | Carbon + tailwind-preset + thème EGEN | CSS Modules + styled-components | Phase 5 |
| Tests | vitest 5, happy-dom | vitest 3 | Aligner |
| Backend | `@egen-civitas/esm-api`, `esm-data-api` | aucun (sauf blockchain) | Aucun couplage requis en Phase 1 |

## Plan d'intégration (ordre)
1. Valider les choix React 18 / rspack / TS avec l'utilisateur
2. Phase 3 : nettoyage du fork (blockchain, clés, déploiement) sur le dépôt fork
3. Phase 4 : copier le fork nettoyé dans `packages/apps/esm-character-factory-app` du Core **sans toucher au reste du Core** (règle 1), exécuter `yarn install`, `yarn verify:nav`
4. Phases 5 à 8 selon la feuille de route
