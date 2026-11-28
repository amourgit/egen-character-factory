import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    css: true,
    // egen/ : archive de référence, non installable seule.
    exclude: [...configDefaults.exclude, 'egen/**'],
  },
  resolve: {
    alias: {
      buffer: 'buffer/'
    }
  }
})