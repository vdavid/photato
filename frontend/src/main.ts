import {mount} from 'svelte';
import {initializeConfig} from './config';
import {initRouter} from './website/router.svelte';
import {loadTranslations} from './i18n/i18n.svelte';
import {initAuth} from './auth/auth.svelte';
import App from './website/components/App.svelte';

/* Boot: pick the environment by hostname, start the router, then kick off translation loading and
 * session re-hydration (both flip reactive flags the app waits on before showing the UI). */
initializeConfig();
initRouter();
void loadTranslations();
void initAuth();

mount(App, {target: document.getElementById('app')!});
