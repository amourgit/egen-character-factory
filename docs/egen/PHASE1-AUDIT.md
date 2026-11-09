# Phase 1 — Audit technique de CharacterStudio (source : M3-org/CharacterStudio v0.5.0)

## Stack
- Vite 7 + plugin React SWC, JavaScript (pas de TypeScript), npm, sortie `./build`
- React 19.2, react-dom 19.2, zustand 3.5, styled-components 5 + CSS Modules, i18next/react-i18next
- 3D : three 0.183, @pixiv/three-vrm 3.5 (VRM), postprocessing, three-mesh-bvh, ktx2-encoder
- Tests : vitest 3 + testing-library ; lint : eslint 8 + prettier 2
- Licence : MIT (Atlas Foundation, 2022) — compatible avec réutilisation/fork, conserver l'avis de copyright

## Organisation (src/, 166 fichiers)
- `Main.jsx`, `App.jsx` : points d'entrée ; `pages/` : écrans (dont Load.jsx)
- `components/` : UI (menus, export, mint, wallet, émotions, miniatures…)
- `context/` : Scene, View, Account, Audio, Language, Sound
- `library/` (~16 500 lignes) : coeur métier — `characterManager.js` (orchestrateur), `vrmManager`, `manifestDataManager`, exporters VRM, optimisations (merge-geometry, cull-mesh, texture atlas), animation/blink/lookat/lipsync/émotions
- `services/`, `security/`, `constants/`, `lib/`
- `public/` : ~115 Mo (3d, textures, ktx2, hdr, sons, manifest.json) ; assets externes via `npm run get-assets` (loot-assets)

## Navigation / état
- Navigation par ViewContext (pas de react-router) ; état 3D par SceneContext + store zustand (`library/store.js`)

## Chargement des modèles
- Pilotés par manifest JSON (`public/manifest.json`), chemin via `VITE_ASSET_PATH`

## Classement des fonctionnalités
| Domaine | Décision proposée |
|---|---|
| Création/personnalisation, morphologie, vêtements, matériaux, couleurs, preview 3D, import/export VRM, optimisation | CONSERVER (périmètre Phase 6) |
| Animations, émotions, blink, lookat, lipsync | CONSERVER tel quel, ne pas étendre (hors périmètre) ; isoler derrière des points d'extension (Phase 7) |
| Blockchain : ethers, web3-react, solana, metaplex, mint, wallet, Contract.jsx, walletCollections, solanaManager, security/secureBlockchainWrapper | SUPPRIMER/DÉSACTIVER (aucun besoin identifié côté EGEN, lourd) — à valider |
| gh-pages, wrangler, vite-plugin-mkcert/basic-ssl, cert.pem/key.pem | SUPPRIMER (déploiement propre à l'upstream ; clés privées à ne pas conserver) |
| Branding (titres, logos, sticker, textes CharacterStudio) | REMPLACER (Phase 5) |

## Points de vigilance
- React 19 côté CharacterStudio vs peer `react 18.x` dans le Core : verrou majeur d'intégration
- three/three-vrm doivent rester une dépendance de l'app (pas partagée par le framework)
- Poids des assets : ne pas les embarquer dans le bundle ; servir en statique
- Contextes globaux et store zustand doivent être scopés à l'app (montage/démontage single-spa)
