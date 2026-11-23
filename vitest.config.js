import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    css: true,
    // integrations/ (enveloppe d'app externe : tests et dépendances propres) et egen/ (archive de référence, non installable seule).
    exclude: [...configDefaults.exclude, 'integrations/**', 'egen/**'],
  },
  resolve: {
    alias: {
      buffer: 'buffer/'
    }
  }
})