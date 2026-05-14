import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Top-level routes declared in src/App.jsx. Each one gets its own
// directory + index.html copy in dist/ so GH Pages can serve them
// directly on cold load (no SPA-404 redirect needed for known routes).
// Keep this list in sync with App.jsx's <Route path="…"> entries.
const ROUTES = [
  'itinerary',
  'log',
  'checklist',
  'rules',
  'route',
  'agent',
  'map',
  'gallery',
  'folders',
  'viewer',
  'stays',
]

/**
 * After the bundle is written, copy dist/index.html into dist/<route>/index.html
 * for each known route. The contents are identical — same React app, same
 * asset paths — but GH Pages will serve the matching file when a user
 * visits /nep-26/log directly, so there's no redirect-bounce flash.
 */
function mirrorRoutesToIndex() {
  return {
    name: 'mirror-routes-to-index',
    apply: 'build',
    async closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      const srcIndex = path.join(outDir, 'index.html')
      const html = await fs.readFile(srcIndex, 'utf8')
      await Promise.all(
        ROUTES.map(async (route) => {
          const dir = path.join(outDir, route)
          await fs.mkdir(dir, { recursive: true })
          await fs.writeFile(path.join(dir, 'index.html'), html, 'utf8')
        })
      )
      console.log(`[mirror-routes] wrote ${ROUTES.length} route index.html files`)
    },
  }
}

// GH Pages serves at /<repo>/ — keep base in sync with the repo name.
// On user-pages (https://<user>.github.io/) base would be '/'.
export default defineConfig({
  plugins: [react(), mirrorRoutesToIndex()],
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
