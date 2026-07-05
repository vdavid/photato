<script lang="ts">
    import type {Component} from 'svelte';
    import {location, matchPath} from '../router.svelte';
    import {twemoji} from '../twemoji';
    import {areTranslationsLoaded} from '../../i18n/i18n.svelte';
    import {auth} from '../../auth/auth.svelte';

    import FullPageLoadingIndicator from './FullPageLoadingIndicator.svelte';
    import NavigationBar from './NavigationBar.svelte';
    import BugReportButton from '../../bug-report/components/BugReportButton.svelte';
    import Footer from './Footer.svelte';
    import Error404Page from './Error404Page.svelte';
    import Error403Page from './Error403Page.svelte';

    import FrontPage from '../../front-page/components/FrontPage.svelte';
    import AboutPage from '../../about/components/AboutPage.svelte';
    import FaqPage from '../../faq/components/FaqPage.svelte';
    import ContactPage from '../../contact/components/ContactPage.svelte';
    import MaterialsPage from '../../materials/components/MaterialsPage.svelte';
    import MaterialPage from '../../materials/components/MaterialPage.svelte';
    import BugReportPage from '../../bug-report/components/BugReportPage.svelte';
    import LoginPage from '../../auth/components/LoginPage.svelte';
    import LoginVerifyPage from '../../auth/components/LoginVerifyPage.svelte';
    import UploadPage from '../../upload/components/UploadPage.svelte';
    import CoursePage from '../../challenges/components/CoursePage.svelte';
    import ChallengePage from '../../challenges/components/ChallengePage.svelte';
    import AdminPage from '../../admin/components/AdminPage.svelte';
    import PhotatoMessagesPage from '../../admin/messages/components/PhotatoMessagesPage.svelte';
    import PhotatoMessagePage from '../../admin/messages/components/PhotatoMessagePage.svelte';
    import AdminPhotosPage from '../../admin/photos/components/AdminPhotosPage.svelte';
    import SitemapGeneratorPage from '../../admin/sitemap-generator/components/SitemapGeneratorPage.svelte';

    type Gate = 'public' | 'member' | 'admin';
    interface RouteDef {
        pattern: string;
        exact?: boolean;
        component: Component<any>;
        gate: Gate;
        extraProps?: Record<string, unknown>;
        /** Parse emoji into images across the whole page (the pages the old app wrapped in <Twemoji>). */
        parseEmoji?: boolean;
    }

    /* First match wins (like the old react-router <Switch>). Param routes are exact so they never
     * swallow a longer or shorter path. Member/admin gating is client-side convenience; the backend
     * enforces it regardless (401/403). */
    const routes: RouteDef[] = [
        {pattern: '/', exact: true, component: FrontPage, gate: 'public'},
        {pattern: '/about', exact: true, component: AboutPage, gate: 'public', parseEmoji: true},
        {pattern: '/faq', exact: true, component: FaqPage, gate: 'public', parseEmoji: true},
        {pattern: '/contact', exact: true, component: ContactPage, gate: 'public', parseEmoji: true},
        {pattern: '/materials', exact: true, component: MaterialsPage, gate: 'public'},
        {pattern: '/bug-report', exact: true, component: BugReportPage, gate: 'public'},
        {pattern: '/login', exact: true, component: LoginPage, gate: 'public'},
        {pattern: '/login/verify', exact: true, component: LoginVerifyPage, gate: 'public'},
        {pattern: '/:languageCode/article/:slug', exact: true, component: MaterialPage, gate: 'public', extraProps: {isExternalArticle: false}},
        {pattern: '/:languageCode/external-article/:slug', exact: true, component: MaterialPage, gate: 'public', extraProps: {isExternalArticle: true}},
        {pattern: '/upload', exact: true, component: UploadPage, gate: 'member'},
        {pattern: '/course', exact: true, component: CoursePage, gate: 'member'},
        {pattern: '/challenges/:weekIndex', exact: true, component: ChallengePage, gate: 'member'},
        {pattern: '/admin', exact: true, component: AdminPage, gate: 'admin'},
        {pattern: '/admin/messages', exact: true, component: PhotatoMessagesPage, gate: 'admin'},
        {pattern: '/admin/message/:slug', exact: true, component: PhotatoMessagePage, gate: 'admin'},
        {pattern: '/admin/photos', exact: true, component: AdminPhotosPage, gate: 'admin'},
        {pattern: '/admin/sitemap-generator', exact: true, component: SitemapGeneratorPage, gate: 'admin'},
    ];

    let fontsReady = $state(false);
    $effect(() => {
        void document.fonts.ready.then(() => {fontsReady = true;});
    });

    const ready = $derived(areTranslationsLoaded() && fontsReady && !auth.isLoading);

    const matched = $derived.by(() => {
        for (const route of routes) {
            const params = matchPath(route.pattern, location.pathname, {exact: route.exact});
            if (params) {
                return {route, params};
            }
        }
        return null;
    });

    /* Which component to render, applying the member/admin gate. */
    const view = $derived.by(() => {
        if (!matched) {
            return {component: Error404Page as Component<any>, props: {} as Record<string, unknown>, parseEmoji: false};
        }
        const {route, params} = matched;
        const allowed = route.gate === 'public'
            || (route.gate === 'member' && auth.isAuthenticated)
            || (route.gate === 'admin' && auth.isAdmin);
        if (!allowed) {
            return {component: Error403Page as Component<any>, props: {}, parseEmoji: false};
        }
        return {component: route.component, props: {...params, ...(route.extraProps ?? {})}, parseEmoji: route.parseEmoji === true};
    });
</script>

{#if ready}
    {@const View = view.component}
    <NavigationBar/>
    <BugReportButton/>
    <main use:twemoji={view.parseEmoji}>
        <View {...view.props}/>
    </main>
    <Footer/>
{:else}
    <FullPageLoadingIndicator/>
{/if}
