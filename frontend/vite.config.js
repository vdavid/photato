import {defineConfig} from 'vite';

/*
 * Photato front end on Vite (Rolldown/Oxc based).
 *
 * The app predates a build step: its React components are JSX compiled by Babel's classic transform
 * (React.createElement, with `import React` in every file). Vite 8's Oxc transformer keys JSX parsing
 * off the file extension, so the JSX source files carry the `.jsx` extension (the old `.mjs`-with-JSX
 * was a no-bundler-era hack). We pin the classic JSX runtime to reproduce the old output exactly — no
 * behavior change, and no React plugin needed.
 *
 * Static assets (emoji SVGs, favicons, fonts, logos, styles.css, robots.txt, sitemap.xml) live in
 * `public/` and keep their absolute `/website/...` URLs. Translation and article modules load via
 * relative dynamic `import()`, which Vite discovers and bundles automatically.
 */

// Non-standard high port so dev/preview never clash with other local services.
const PORT = 18730;

export default defineConfig({
    oxc: {
        // Classic runtime = no auto JSX import; matches the React.createElement output the app expects.
        jsx: {runtime: 'classic'},
    },
    server: {port: PORT, strictPort: true},
    // `allowedHosts` lets the Dockerized Playwright suite reach `vite preview` at
    // http://host.docker.internal:<port> for the pre-deploy pixel smoke. Production is served by Caddy
    // (`vite build` output), which has no such host check, so this is a local/CI affordance only.
    preview: {port: PORT, strictPort: true, allowedHosts: ['host.docker.internal', 'localhost']},
    build: {outDir: 'dist'},
});
