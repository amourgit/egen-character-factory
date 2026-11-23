import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    // Le chargement réel des pages d'iframe est inutile (et bruyant) : on teste l'élément, pas le réseau.
    environmentOptions: { happyDOM: { settings: { disableIframePageLoading: true } } },
    mockReset: true,
    root: path.resolve(__dirname),
  },
});
