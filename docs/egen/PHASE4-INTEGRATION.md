# Phase 4 — Intégration au Core (état)

Branche Core : `feature/character-factory` (amourgit/Frontend-esm-core) — app `packages/apps/esm-character-factory-app`.

## Réalisé
- App native : `index.ts` (startupApp, root async, navEntry), `routes.json` (route `character-factory`, topbar-nav-slot), `config-schema.ts`, traductions, peerDependencies alignées sur le Core (Module Federation).
- Code hérité conservé tel quel dans `src/studio/` (seul changement : fetch du manifeste, chemins `./` → base d'assets) ; assets dans `src/public/` → `dist/character-factory-assets`.
- Adaptations dans `rspack.config.js` de l'app uniquement (config partagée du Core non modifiée) : `.jsx`, `import.meta.env`, audio/polices, loaders de réécriture des chemins d'assets (CSS et JS).
- Isolation : zustand v3 → `zustand-legacy` (alias limité à src/studio) ; react-i18next/i18next de l'app NON partagés (CharacterStudio appelle initReactI18next, ce qui écraserait l'i18n du shell).
- React 19 → 18 (le Core) : build et tests OK.

## Vérifications (toutes OK)
- Tests d'origine : 37/37 (1 mock adapté à Vitest 5)
- `tsc` propre ; `rspack` dev + prod OK ; `tools/check-nav-routes.mjs` OK ; esm-annuaire-app compile toujours.
- Versions racine du Core inchangées (zustand 4.5.5, i18next 25, react-i18next 16, react 18.3.1).

## Reste à vérifier / faire
- Test navigateur réel (WebGL, chargement VRM, ktx2, export) dans le shell EGEN : non réalisé en environnement sans navigateur.
- Canvas 3D en `position: fixed` plein écran (comportement d'origine) : à intégrer proprement dans la zone principale du shell (Phase 5).
- Blockchain conservée (NFT-lock, wallet, mint) : isolation par config en Phase 7.
- Poids : ~115 Mo d'assets dans le dépôt Core (envisager Git LFS / CDN via `assetBaseUrl`).

## Phase 5 (première partie) — Disposition dans le shell
- Zone principale : page `root` (route `character-factory`) ; canvas 3D et panneaux hérités bornés à la zone (bloc contenant via `transform`, hauteur `100dvh - navbar - footer`) ; moteur 3D dimensionné sur son conteneur (ResizeObserver).
- Rail gauche : option globale « Character Factory » (`shell-rail-left-slot`) → `SectionNavPanel section="character-factory"`.
- Sous-options (`topbar-nav-slot`) : Accueil (`character-factory`), Créer (`/creer`), Charger (`/charger`), Export par lot (`/export-lot`), Manifestes par lot (`/manifestes`) — reliées aux vues LANDING, CREATE, LOAD, BATCHDOWNLOAD, BATCHMANIFEST via `route-sync.tsx`. APPEARANCE/SAVE/OPTIMIZER restent des étapes internes du parcours.
- i18n : espace de noms `character-factory` dans l'instance partagée du Core (en/fr/ru/zh).
- Branding : titre, métadonnées d'export. Reste : thème (tokens `--colors-*`) sur les CSS hérités, visuels de la page d'accueil, panneaux d'édition vers les zones droite/basse.
