# EGEN Character Factory — NOTES DE PROJET (à relire régulièrement)

## Infos fournies
1. Framework : https://github.com/amourgit/Frontend-esm-framework.git
2. Application/Core : https://github.com/amourgit/Frontend-esm-core.git (dépôt `Frontend-esm-core`)
3. Token GitHub : fourni dans la conversation, stocké UNIQUEMENT dans la variable d'env GH_TOKEN (jamais écrit dans un fichier ni dans une URL de remote persistante). À révoquer en fin de travail.
4. Consigne : forker proprement CharacterStudio, puis le déplacer dans le core ; suivre à la lettre toutes les étapes ; résultat "au top" dans le core ; ne pas perdre de temps (budget de tokens limité) ; consulter ce fichier pendant tout le travail.

## Cadrage
Avancer progressivement, sans anticiper les choix architecturaux du Core Frontend EGEN non encore étudié.
Périmètre Phase 1 : prendre CharacterStudio, le personnaliser complètement et l'intégrer comme application native du Core Frontend EGEN, conformément au modèle architectural OpenMRS ESM.
Pas encore : animations avancées, comportements, intégrations Ara/Blender/autres. Préserver une architecture permettant de les ajouter plus tard sans refonte majeure.

## Feuille de route — EGEN Character Factory

### Phase 1 — Étude et audit de CharacterStudio (comprendre avant de modifier)
Objectif : comprendre le fonctionnement interne avant transformation.
- Organisation des répertoires et packages
- Technologies et versions
- Architecture React et composants principaux
- Navigation et gestion des états
- Moteur 3D et bibliothèques associées
- Dépendances externes
- Chargement des modèles et ressources
- Possibilités de personnalisation et d'extension
- Fonctionnalités à conserver / modifier / supprimer
Livrable : rapport d'audit technique + cartographie des composants.

### Phase 2 — Compatibilité avec EGEN Frontend (comprendre le Core)
Objectif : déterminer comment adapter CharacterStudio pour être une app native du Core.
Étudier : structure réelle du Core ; monorepo et workspaces ; système de packages/applications ; conventions de dev ; mécanisme d'enregistrement des apps ; routing ; chargement des apps ; dépendances partagées ; build et déploiement ; conventions de communication backend.
Important : ne pas présumer de l'implémentation EGEN; l'analyse du code décide.
Livrable : matrice de compatibilité CharacterStudio/EGEN + plan d'intégration.

### Phase 3 — Fork et préparation
Objectif : base de dev propre pour EGEN Character Factory.
- Créer le dépôt dédié
- Forker CharacterStudio en conservant les références à l'origine
- Examiner et documenter les licences
- Nettoyer les éléments inutiles
- Préparer la structure du projet
- Identifier les composants à adapter
- Définir une stratégie de synchronisation avec la source
Livrable : dépôt EGEN Character Factory prêt pour la personnalisation.

### Phase 4 — Refactorisation et intégration au Core (intégration native)
- Adapter structure des packages, points d'entrée
- Intégrer le routing approprié
- Adapter le chargement de l'application
- Réutiliser fonctionnalités/services partagés du Core si pertinent
- Éliminer duplications inutiles
- Adapter dépendances et configurations
- Intégrer dans le système de build
Livrable : Character Factory intégrée au Core et compilable avec les autres apps.

### Phase 5 — Personnalisation complète de l'identité EGEN
- Refaire l'identité visuelle ; couleurs, composants, styles
- Revoir menus et navigation interne
- Adapter interfaces de création/personnalisation
- Uniformiser avec conventions graphiques EGEN
- Supprimer références visuelles/textuelles inutiles à CharacterStudio
- Expérience cohérente avec les autres apps EGEN
Livrable : interface EGEN Character Factory entièrement personnalisée.

### Phase 6 — Stabilisation des fonctionnalités existantes
Périmètre : création/personnalisation des personnages ; import personnages/ressources ; morphologies ; vêtements et accessoires ; matériaux et textures ; prévisualisation 3D ; couleurs ; export ; formats pris en charge.
Pas de nouveaux systèmes d'animation/comportement : stabilité uniquement.
Livrable : version fonctionnelle et testée.

### Phase 7 — Préparation de l'architecture d'extension
Points d'extension (sans les développer) : nouveaux types de personnages (humains, robots, créatures…) ; futures sources de modèles 3D ; bibliothèques de ressources ; animations ; expressions ; comportements ; moteurs de génération.
Principe : distinguer clairement fonctionnalités actuelles et extensions futures.
Livrable : architecture d'extension documentée, sans implémentation prématurée.

### Phase 8 — Build, déploiement, validation finale
- Build individuel de l'app (si le Core le permet)
- Build global du Core avec Character Factory
- Chargement depuis le système d'apps EGEN
- Routing ; gestion des dépendances ; absence de conflits
- 3D en environnement de déploiement ; performances et stabilité
Livrable : première version stable et intégrée.

### Synthèse
1 Audit → compréhension | 2 Compatibilité → plan validé | 3 Fork → base indépendante | 4 Refactorisation → app native | 5 Personnalisation → identité complète | 6 Stabilisation → fonctionnalités opérationnelles | 7 Extensibilité → archi prête | 8 Validation → intégrée et déployable

## Règles de conduite
1. Ne pas modifier le Core pour adapter artificiellement CharacterStudio : comprendre ses conventions d'abord, adapter CharacterStudio.
2. Ne pas réécrire inutilement ; conserver les fonctionnalités pertinentes.
3. Pas de nouvelles technologies prématurées ; chaque dépendance répond à un besoin identifié.
4. Préserver la modularité ; pas de dépendance à un moteur particulier.
5. Valider chaque étape avant la suivante ; critères d'acceptation et livrables vérifiables.

## Première étape concrète
Commencer exclusivement par la Phase 1, sans modifier de code. Examiner CharacterStudio en profondeur, puis seulement ensuite le Core EGEN. Ne proposer ni structure de packages, ni conventions, ni config de build sans éléments réels.
But : EGEN Character Factory conservant la richesse de CharacterStudio, pleinement intégrée, cohérente et indépendante dans l'écosystème EGEN.
Suivi : avancement hebdomadaire des phases.

## JOURNAL D'AVANCEMENT
- [x] Phase 1 audit (docs/egen/PHASE1-AUDIT.md)
- [x] Phase 2 matrice (docs/egen/PHASE2-COMPATIBILITE.md)
- [x] Fork amourgit/egen-character-factory créé
- [ ] Phase 3 nettoyage / Phase 4 intégration — en attente de validation des choix React18/rspack/TS
- [x] Choix validés par l'utilisateur: React18, rspack, TS entry, suppression blockchain+clés. EXIGENCE: aucune fonctionnalité supprimée/corrompue (hors blockchain validé). Baseline tests/build à comparer.
- [x] Phase 3 faite (fork nettoyé, 37 tests OK, build OK, poussé). Blockchain CONSERVÉE (couplage fort) -> isoler plus tard via flag. Prochaine: Phase 4 dans packages/apps/esm-character-factory-app du Core
- [~] Phase 4: app scaffold créée dans Core packages/apps/esm-character-factory-app (src/studio=upstream src, src/public=assets). Reste: yarn install, build rspack, fix erreurs, check-nav-routes, tests
- [x] Phase4: build rspack dev OK (peers alignés Core, zustand-legacy isolé, loader CSS). Reste: tests, nav check, tsc, build prod, commit Core+fork, push
- [x] Phase 4 poussée
- [x] Fix .gitignore lib + i18n Core (namespace character-factory, fr ajouté) poussé. Reste Phase 5: canvas dans zone shell (container+transform), rail panel, identité EGEN (App.jsx generalTitle 'Character Studio', download-utils authors)
- [x] Connexion shell complète poussée (grille, topbar sectionRoute, rail, test routes). En attente du retour navigateur de l'utilisateur
- [x] P6 partiel: dispose scène/audio/lookAt + cleanup route-sync (48 tests). Feuille de route détaillée P5-P15 écrite (docs/character-factory/ROADMAP-CHARACTER-FACTORY.md). Prochaine: P5 reste (thème tokens, visuels, 100vh) puis P6 F6.3-F6.5 puis P7 socle domaine. Décisions D1-D5 à valider par l'utilisateur.
- [x] F5.3 fait: UI bornée à la zone (cq units, style.css scopé, hauteur mesurée)
- [x] P6 code terminé (config assets, WebGL, erreurs, lazy moteur). Docs ASSETS-EXTERNES + MATRICE. vitest exit 0 (58 tests). Prochaine: P7 socle domaine (utiliser schéma manifeste lu dans CharacterManifestData.js: traits[{trait,name,iconSvg,collection[{id,name,directory,thumbnail,type,textureCollection,colorCollection,decalCollection,blendshapeTraits,restrictedItems}]}], textureCollections, colorCollections, traitRestrictions, requiredTraits, randomTraits, assetsLocation, traitsDirectory, thumbnailsDirectory, animationPath, exportScale)
