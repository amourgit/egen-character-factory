# Phase 3 — Fork et préparation

- Dépôt : amourgit/egen-character-factory (fork de M3-org/CharacterStudio, remote `upstream` conservé)
- Licence : MIT (Copyright (c) 2022 Atlas Foundation) — le fichier LICENSE d'origine est conservé et doit l'être dans toute redistribution. Le code ajouté par EGEN est sous la licence du Core (MPL-2.0) ; les fichiers issus de CharacterStudio restent MIT.
- Nettoyage effectué : cert.pem/key.pem (clés privées de dev) retirés ; gh-pages, wrangler, vite-plugin-mkcert, @vitejs/plugin-basic-ssl retirés (non utilisés par le code applicatif) ; scripts deploy/predeploy retirés.
- Conservé volontairement : code blockchain (NFT-lock, wallet, mint) — fortement couplé aux manifestes et pages ; son isolation (flag de config) est reportée après l'intégration pour garantir zéro régression.
- Synchronisation upstream : `git fetch upstream && git merge upstream/main` sur le fork ; les modifications EGEN se limitent à des fichiers ajoutés (index.ts, routes.json, config) et à des changements minimes de fichiers existants, pour limiter les conflits. Re-copie vers le Core après chaque sync.
