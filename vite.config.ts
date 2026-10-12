import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const src = fileURLToPath(new URL('./src', import.meta.url))
const base = process.env.PAGES_BASE || '/'

/** Content includes public asset URLs in TS and JSON; keep them under the deployment base. */
function publicAssetBase(): Plugin {
  return {
    name: 'portfolio-public-asset-base',
    enforce: 'pre',
    transform(code, id) {
      if (base === '/' || !id.replaceAll('\\', '/').includes('/src/') || !/\.(tsx?|json)$/.test(id)) return
      const transformed = code.replace(/(["'])\/(images|media|fonts)\//g, `$1${base}$2/`)
      if (transformed !== code) return { code: transformed, map: null }
    },
  }
}

/**
 * Inlines the entry stylesheet into index.html, so first paint waits on one request less (Lighthouse
 * render-blocking, 2026-10-03). The deploy CSP allows inline styles ('unsafe-inline' in style-src), so
 * no hash to keep in sync. The .css file still ships for anything that asks for it by URL.
 */
function inlineEntryCss(): Plugin {
  return {
    name: 'pv2-inline-entry-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        return html.replace(/<link rel="stylesheet"[^>]*href="[^"]*\/(assets\/[^"]+\.css)"[^>]*>/g, (tag, file: string) => {
          const asset = ctx.bundle?.[file]
          return asset?.type === 'asset' ? `<style>${String(asset.source)}</style>` : tag
        })
      },
    },
  }
}

export default defineConfig({
  base,
  plugins: [publicAssetBase(), react(), tailwindcss(), inlineEntryCss()],
  resolve: {
    alias: { '@': src },
  },
  // Public maps: Lighthouse flags large first-party JS without them, and DevTools traces read as source.
  build: { sourcemap: true },
})
