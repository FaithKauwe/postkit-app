import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // See `src/shims/postkit-date-status-display.ts` — published barrel breaks Vitest/Node ESM.
      'postkit-date-status-display': path.join(
        projectRoot,
        'src/shims/postkit-date-status-display.ts',
      ),
      // Published package has no `index.js`; shim re-exports from published source.
      'postkit-storage-lib': path.join(projectRoot, 'src/shims/postkit-storage-lib.ts'),
    },
  },
  // Help Vitest/Vite bundle classmate ESM packages that use extensionless `./file` imports.
  ssr: {
    noExternal: [/^postkit-/],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Classmate packages often use extensionless `./file` imports in `dist/`; inline so Vite
    // resolves them the same way as the app dev server.
    server: {
      deps: {
        inline: [/^postkit-/],
      },
    },
  },
})
