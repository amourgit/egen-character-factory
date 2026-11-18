# Character Factory — déploiement (image Docker)

Principe : **aucune modification du code applicatif**. L'image sert le build Vite de l'amont (assets embarqués inclus) avec nginx,
et la **bibliothèque de personnages (`loot-assets`) est séparée** : un volume distinct servi sous `/loot-assets/`.

## Commandes

```bash
git clone https://github.com/amourgit/egen-character-factory.git
cd egen-character-factory
git checkout feature/reforme-character
docker compose up -d --build            # http://localhost:8080  (santé : /health)
```

Bibliothèque de personnages locale (optionnel — voir « Personnages » ci-dessous) :

```bash
docker compose --profile assets run --rm assets-sync
```

Image seule : `docker build -t egen-character-factory:latest .` puis `docker run -d -p 8080:8080 -v loot-assets:/srv/loot-assets:ro egen-character-factory:latest`

## Installation hors Docker (développement)

```bash
node -v                                  # >= 20.19 (.nvmrc : 20)
npm ci                                   # le .npmrc règle les peer dependencies : aucune option à ajouter
npm run test:run
npm run build                            # -> build/
```

## Architecture de l'image

| Élément | Choix |
|---|---|
| Build | `node:20-bookworm-slim` (glibc : binaires natifs SWC/Rollup garantis) |
| Exécution | `nginxinc/nginx-unprivileged` (non-root, port 8080), site statique |
| Santé | `GET /health` → `200 ok` |
| Cache | `index.html` et `manifest*.json` : `no-cache` ; bundles `/assets/<nom>-<empreinte>.js|css` : 1 an ; reste : 1 jour ; `/loot-assets/` : 1 h |
| Routes inconnues | `404` (pas de repli SPA : un asset absent ne doit pas renvoyer `index.html`) |
| Compression | gzip (js, css, json, svg, wasm) |
| Argument de build | `VITE_ASSET_PATH` (défaut `./`) : base du manifeste racine, lue par `src/App.jsx` |

## Personnages (séparation des bibliothèques d'assets)

Le manifeste racine (`public/manifest.json`) liste 4 personnages :

| Personnage | Source |
|---|---|
| Anata (femme), ON1FORCE, Tubby Cat | **distants** : `https://m3-org.github.io/loot-assets/...` (accès Internet requis) |
| Anata (homme) | **local** : `./loot-assets/anata/male/manifest.json` → servi depuis le volume `loot-assets` |

Sans synchronisation du volume, Anata (homme) est indisponible (404 explicite). `assets-sync` clone `M3-org/loot-assets` dans le volume
(équivalent de `npm run get-assets`). **Décision D2 (docs/egen/ASSETS-EXTERNES.md) : vérifier les licences de cette bibliothèque avant tout usage
en production** — c'est pourquoi elle n'est jamais embarquée dans l'image ni synchronisée automatiquement.
Autre source : `LOOT_ASSETS_REPO=<url git>`.

Un manifeste racine personnalisé peut être monté par-dessus : `-v ./mon-manifest.json:/usr/share/nginx/html/manifest.json:ro`.

## Ce qui n'a PAS été modifié (volontairement)
- Code de l'application, identité visuelle, assets embarqués : identiques à l'amont.
- Fonctions NFT / wallet / mint (variables `VITE_HELIUS_KEY`, `VITE_OPENSEA_KEY`, `VITE_PINATA_*`, `VITE_VALIDATION_SERVER_URL`) : non configurées, donc inactives. Leur retrait relève de la réforme (phase 15 du plan), pas du déploiement.
- `.env` (versionné par l'amont, valeur `VITE_ASSET_PATH=./`) et `.github/workflows/main.yml` (publication GitHub Pages sur `main` uniquement) : laissés tels quels. `.dockerignore` exclut `.env*` de l'image.
- L'archive `egen/` (intégration issue du Core) n'est pas incluse dans l'image.

## Changements apportés pour le déploiement
`.npmrc` (`legacy-peer-deps`, `engine-strict`), `.nvmrc`, champ `engines` de `package.json`, `Dockerfile`, `nginx.conf`, `docker-compose.yml`, `.dockerignore`.

## Validation effectuée / non effectuée
Validé : `npm ci` à froid sans option (Node 20.20), 37 tests, build sans `.env`, argument `VITE_ASSET_PATH` pris en compte, configuration nginx exécutée sur le build réel
(MIME, gzip, cache, `/health`, `/loot-assets/`, 404), script `assets-sync` rejoué (dont volume déjà rempli).
**Non exécuté : `docker build` et `docker compose`** (Docker indisponible dans l'environnement de test).
