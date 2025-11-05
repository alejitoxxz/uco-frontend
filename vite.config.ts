import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const reactRouterEntry = require.resolve('react-router')
const reactRouterDomEntry = require.resolve('react-router-dom')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'react-router-dom': reactRouterDomEntry,
      'react-router': reactRouterEntry,
    },
  },
  optimizeDeps: {
    include: ['react-router', 'react-router-dom'],
    esbuildOptions: {
      plugins: [
        {
          name: 'react-router-fix',
          setup(build) {
            build.onResolve({ filter: /^react-router$/ }, () => ({
              path: reactRouterEntry,
            }))
          },
        },
      ],
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
