import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

/*
 * Photato front end: a plain Svelte 5 SPA (no SvelteKit). The app is inherently client-side — it picks
 * its backend environment at runtime from the hostname, stores the magic-link session in localStorage,
 * gates member/admin routes client-side, and lazy-loads ~80 article/challenge modules via dynamic
 * `import()`. So there's nothing to prerender; the build emits static files that Caddy serves with an
 * SPA fallback (`try_files {path} /index.html`), exactly as before.
 *
 * Static assets (emoji SVGs, favicons, fonts, logos, styles.css, robots.txt, sitemap.xml) live in
 * `public/` and keep their absolute `/website/...` URLs.
 */

// Non-standard high port so dev/preview never clash with other local services.
const PORT = 18730

export default defineConfig({
  plugins: [svelte()],
  server: { port: PORT, strictPort: true },
  // `allowedHosts` lets the Dockerized Playwright suite reach `vite preview` at
  // http://host.docker.internal:<port> for the pre-deploy pixel smoke. Production is served by Caddy
  // (the `vite build` output), which has no such host check, so this is a local/CI affordance only.
  preview: { port: PORT, strictPort: true, allowedHosts: ['host.docker.internal', 'localhost'] },
  build: { outDir: 'dist' },
})
