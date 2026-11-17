# Archive de l'intégration Character Factory issue du Core EGEN

Ce dossier préserve le travail réalisé quand Character Factory était une application du Core Frontend EGEN
(`packages/apps/esm-character-factory-app`, dépôt `amourgit/Frontend-esm-core`).

Depuis la réforme (voir `docs/egen/` et `docs/reforme-character.md` du Core), **Character est un projet autonome** :
l'application a été retirée du Core. Ce dossier est une **référence de reprise**, pas une application branchée.

## Contenu

| Chemin | Rôle |
|---|---|
| `core-integration/src/{domain,ports,adapters,features,services,runtime}` | Couche écrite par EGEN (ADR-001 : domaine, ports, adaptateurs, bibliothèque, compositions) |
| `core-integration/src/*.ts(x)` | Branchement à l'ancien shell ESM (`index.ts`, `root.component.tsx`, `route-sync.tsx`, `rail-panel`…) — spécifique au Core, à ne reprendre que par choix |
| `core-integration/tests/` | Tests de la couche EGEN |
| `core-integration/translations/` | Libellés fr/en |
| `core-integration/package.json`, `rspack.config.js`, loaders, `tsconfig.json`, `vitest.config.ts` | Configuration d'origine (références ESM : non installable seule) |
| `core-integration/public-overrides/style.css` | Seul asset modifié par rapport à l'amont |
| `patches/studio-adaptations.patch` | Les 12 fichiers de CharacterStudio adaptés pour le Core + suppression de `Main.jsx` |

## Reconstituer l'ancien `src/studio` du Core

```bash
cp -r src /tmp/studio && cd /tmp/studio && patch -p1 < <chemin>/egen/patches/studio-adaptations.patch
```

Vérifié : le code amont de `src/` + ce patch reproduit exactement l'ancien `src/studio` du Core (comparaison fichier par fichier).
Les assets (`public/`) sont identiques à l'amont, à l'exception de `style.css`.

## Licence
CharacterStudio (M3-org) est sous licence MIT : voir `LICENSE` à la racine. Les ajouts EGEN se trouvent sous `egen/`.

## Principe directeur
Character est autonome ; CharacterStudio M3-org est une implémentation remplaçable ; les contrats (`docs/egen/BACKEND-CONTRATS.md`) comptent plus que les outils ; EGEN consomme Character sans le posséder.
