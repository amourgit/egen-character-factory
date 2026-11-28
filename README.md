# EGEN Character Factory

> **Statut (2026-11-23).** Projet **autonome** de l'écosystème EGEN (CIVITAS), construit sur **CharacterStudio** (M3-org, MIT), implémentation de départ **remplaçable**.
> Le Core EGEN ne contient plus aucun code de Character : il n'affiche que cette application, déployée à part, dans une iframe (application **embarquée** par le SDK `esm-embed-client`, protocole v2 : déclaration `egen-config.json` publiée par l'app).
> `main` porte, en plus de l'amont : la déclaration d'intégration au Core (`docker/egen-config.json.template`), le client SDK (`src/egen/`), l'image Docker et la CI.

| Où | Contenu |
|---|---|
| `docker/egen-config.json.template`, `docker/16-egen-embed.sh`, `src/egen/` | Déclaration d'intégration (route `character`, navigation `none`), publication au démarrage, client SDK (langue du Core), 16 tests |
| `Dockerfile`, `docker-compose.yml`, `nginx.conf.template`, `docker/` | Image de production : build Vite puis nginx statique, non-root, port 8080, santé `GET /health` ; `CHARACTER_FRAME_ANCESTORS` autorise l'iframe du Core (vide = aucun en-tête) |
| `docs/egen/` | Contrats (`BACKEND-CONTRATS.md`), déploiement (`DEPLOIEMENT.md`), ADR, réforme |

**Ce qui n'est pas vérifié.** L'image Docker est préparée mais **n'a jamais été construite** (aucun Docker dans l'environnement de travail ; les étapes du `Dockerfile` ont été rejouées à la main). L'affichage dans un navigateur, à l'intérieur du Core, n'est pas vérifié (WebGL).

Licence : l'amont est sous MIT (`LICENSE`). Les ajouts EGEN se trouvent sous `docker/` et `src/egen/`.

---

# Documentation amont — CharacterStudio (M3-org)


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Discord](https://img.shields.io/discord/770382203782692945?label=Discord&logo=Discord)](https://discord.gg/8zBvTMb8SU)
[![Twitter Follow](https://img.shields.io/twitter/follow/m3org)](https://twitter.com/m3org)


An open, collaborative, and evolving 3D avatar studio for making glTF / VRM avatars with.

![image](https://github.com/M3-org/CharacterStudio/assets/32600939/fad3002f-78cd-4cd2-8eae-0c1663a86d25)

:star: **NEW: DOCS!!!** https://m3-org.github.io/characterstudio-docs/ ⭐

# Installation

> Note: You need loot-assets imported to public folder for this to work! https://github.com/m3-org/loot-assets

```bash
# Clone the repo and change directory into it
git clone https://github.com/M3-org/CharacterStudio
cd CharacterStudio

# Install dependencies with legacy peer deps flag to ignore React errors
npm install
npm run dev

# Install default assets
npm run get-assets
```

---

## Load Your Assets

We separate the program from the asset packs. We have some sample assets here: https://github.com/memelotsqui/character-assets
![Screenshot from 2023-10-17 17-10-38](https://github.com/M3-org/CharacterStudio/assets/32600939/23768dc3-b834-4f70-a986-a4a0141c4014)

Refer to docs to add your own 3d models

## Features
- **Personalized Creation**: Point and click to build 3D characters
    - Drag and drop local 3D files (VRM) and textures
    - Color picker for adding a personal touch
    - Export creatoins as glb and VRM + screenshots
- **Dynamic animation**: Variety of programmable animations
- **Effortless Optimization** One-click VRM optimizer
    - Merge skinned meshes + Texture atlassing
        - Can reduce avatars to a single draw call!
- **Batch Export**: Randomize or adhere to metadata schemas
- **Transparent Development**: Open-source MIT licensed codebase
- **Robust Rendering**: Using Three.js, WebGL, and React
    - Recently refactored to NOT need React as a dependency
    - Logic is now all inside `CharacterManager` class
- **Face auto culling**: Automatically cull undereneath faces with custom layer system

---

## Special Thanks

Shoutout to [original repo by Webaverse](https://github.com/webaverse/characterstudio)

Thanks m00n, memelotsqui, boomboxhead, jin, and many others for contributing
