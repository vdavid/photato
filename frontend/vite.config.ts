import {defineConfig} from 'vite';

/*
 * Photato front end on Vite (Rolldown/Oxc based).
 *
 * The React components use the classic JSX transform (React.createElement, with `import React` in
 * every file). Vite 8's Oxc transformer keys JSX parsing off the file extension, so JSX source files
 * carry the `.tsx` extension (pure-logic modules are `.ts`). We pin the classic JSX runtime to match
 * the `"jsx": "react"` setting in tsconfig.json and reproduce the expected output — no React plugin
 * needed. Type checking is a separate gate (`tsc --noEmit`); Oxc strips types without checking them.
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
