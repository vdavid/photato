import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

/*
 * Plain Svelte 5 SPA (no SvelteKit). `vitePreprocess` lets `<script lang="ts">` blocks use TypeScript;
 * type checking is a separate gate (`svelte-check`), same split the old Vite/tsc setup used.
 */
export default {
    preprocess: vitePreprocess(),
};
