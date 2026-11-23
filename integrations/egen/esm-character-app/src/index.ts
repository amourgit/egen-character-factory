import { defineConfigSchema, getConfig, getSyncLifecycle } from '@egen-civitas/esm-framework';
import { toLifecycleExport } from '@egen-civitas/esm-integration-utils';
import { configSchema } from './config-schema';
import { createCharacterLifecycle } from './embed';
import RailPanel from './rail-panel.component';

// =============================================================================
//  ESM TWEAKCN APP — application externe : affiche une instance EGEN Character Factory (éditeur de thèmes,
//  personnages 3D) dans la zone principale du Core, via une iframe. Voir README.md.
// =============================================================================

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@civitas/esm-character-app';

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// Page de la zone principale (route `character`) : l'iframe EGEN Character Factory.
export const root = toLifecycleExport(
  createCharacterLifecycle({
    moduleName,
    featureName: 'character',
    readConfig: () => getConfig(moduleName),
  }),
);

// Extension de navigation (slot `topbar-nav-slot`) : ne rend rien, seule sa `meta` (routes.json) est lue.
export const navEntry = getSyncLifecycle(() => null, { featureName: 'character-nav-entry', moduleName });

// Option globale du rail gauche (slot `shell-rail-left-slot`) : ses sous-options se chargent dans la zone gauche.
export const railPanel = getSyncLifecycle(RailPanel, { featureName: 'character-rail', moduleName });
