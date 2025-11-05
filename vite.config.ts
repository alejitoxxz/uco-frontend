import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

const reactRouterAliasPlugin = (): PluginOption => ({
  name: 'react-router-dom-alias',
  enforce: 'pre' as const,
  resolveId(source: string, importer?: string) {
    if (source !== 'react-router') {
      return null
    }

    if (importer?.includes('node_modules/react-router-dom')) {
      return null
    }

    return 'react-router-dom'
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactRouterAliasPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
  },
  server: {
    port: 5173,
    open: true,
  },
})
