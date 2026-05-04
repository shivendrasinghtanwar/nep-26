import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GH Pages serves at /<repo>/ — keep base in sync with the repo name.
// On user-pages (https://<user>.github.io/) base would be '/'.
export default defineConfig({
  plugins: [react()],
  base: '/nep-26/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: false,
  },
})
