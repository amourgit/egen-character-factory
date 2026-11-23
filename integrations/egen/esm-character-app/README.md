# @civitas/esm-character-app

Application **externe** d'EGEN qui affiche une instance [EGEN Character Factory](https://github.com/amourgit/egen-character-factory) dans la zone principale du Core
(route `character`), avec une option dans le rail gauche. C'est une enveloppe d'une centaine de lignes : EGEN Character Factory reste une
application autonome, déployée à son adresse (Docker, voir `docs/egen/DEPLOIEMENT.md`), et embarquée par `iframe` via
[`@egen-civitas/esm-nextjs-utils`](https://www.npmjs.com/package/@egen-civitas/esm-nextjs-utils).

C'est le scénario **C3** du document `docs/integration-apps/15-scenarios-integration-externe.md` du Core.

## Ce que fait l'enveloppe

- lit sa configuration au montage (`characterUrl`, `title`, `heightOffset`) et la **valide** : https obligatoire
  (http toléré pour `localhost`), pas d'identifiants dans l'URL ; sinon une alerte lisible remplace l'iframe ;
- délègue l'embarquement à `getEmbedLifecycle` : origine **explicite** (jamais `*`), bac à sable, messages vérifiés ;
- ne transmet **aucune donnée de session** à EGEN Character Factory (`sessionFields: []`) : EGEN Character Factory a sa propre authentification ;
- ajoute ce dont EGEN Character Factory a besoin : droits de bac à sable (téléchargements, dialogues), permissions presse-papiers
  (`allow="clipboard-read; clipboard-write; fullscreen"`), hauteur = espace visible (EGEN Character Factory occupe toute la fenêtre
  et n'annonce pas sa hauteur).

## Configuration (par instance de Core, sans reconstruire)

Dans la configuration du Core :

```json
{ "@civitas/esm-character-app": { "characterUrl": "https://character.exemple.org", "title": "EGEN Character Factory", "heightOffset": 0 } }
```

| Clé | Défaut | Rôle |
| --- | --- | --- |
| `characterUrl` | _(obligatoire)_ | URL publique de l'instance EGEN Character Factory |
| `title` | `EGEN Character Factory` | titre accessible de l'iframe |
| `heightOffset` | `0` | pixels à laisser libres sous l'iframe (ex. pied de page fixe) |

## Développer, tester, construire

```bash
npm install --legacy-peer-deps
npm test          # 24 tests (configuration, bac à sable, hauteur, démontage, erreurs)
npx tsc           # types
npm run build     # dist/civitas-esm-character-app.js + dist/routes.json estampillé
npm run pack:tarball   # civitas-esm-character-app-<version>.tgz
```

## L'intégrer à un Core

1. Lancer Character Factory : **en local** (`npm run dev`, `http://localhost:5173` ; Vite n'impose aucune restriction d'iframe) ou **déployé**
   (`docker compose up -d --build`, port 8080, avec `CHARACTER_FRAME_ANCESTORS` = origine du Core ; voir `docs/egen/DEPLOIEMENT.md`).
2. Diffuser le paquet : le workflow `.github/workflows/egen-character-app.yml` attache le tarball à une release GitHub
   (tag `egen-app-v<version>`), ou publier sur un registre npm.
3. Dans le Core, `external-apps.json` :
   ```json
   { "apps": { "@civitas/esm-character-app": "https://github.com/amourgit/egen-character-factory/releases/download/egen-app-v1.0.0/civitas-esm-character-app-1.0.0.tgz" } }
   ```
4. **À froid** : dans le Core, **`yarn prepare:prod`** (une commande : contrôles, `external:sync --strict`,
   vérification du verrou, précompression), puis **redémarrer** le Core (`yarn start:prod`) ou le redéployer.
   Le Core lit le verrou au démarrage et revérifie l'empreinte SHA-256 du bundle.
5. Renseigner `characterUrl` dans la configuration du Core.
