/*
 * Tiny history-based client-side router for the SPA.
 *
 * The app serves real paths (not hash routes) — Caddy's `try_files {path} /index.html` fallback returns
 * index.html for any deep link, and this router takes over from there. It exposes a reactive `location`,
 * a `navigate()` that pushes/replaces history, and `matchPath()` for `:param` patterns. Internal links
 * go through the `Link` / `NavLinkButton` components (which call `navigate`); plain `<a href>` stays a
 * full-page load, matching the old react-router behavior (only its `Link`/`NavLink` were intercepted).
 */

export interface RouterLocation {
    pathname: string;
    search: string;
    hash: string;
}

function readLocation(): RouterLocation {
    return {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
    };
}

/** Reactive current location. Components read `location.pathname` etc. and re-render on change. */
export const location: RouterLocation = $state(readLocation());

function syncLocation(): void {
    const next = readLocation();
    location.pathname = next.pathname;
    location.search = next.search;
    location.hash = next.hash;
}

/** Start listening for browser back/forward. Call once at boot. */
export function initRouter(): void {
    window.addEventListener('popstate', syncLocation);
}

/**
 * Navigate to an in-app path. Pushes history (or replaces), syncs the reactive location, and — on a
 * push to a new path — scrolls to the top, reproducing the old `ScrollToTop` behavior.
 */
export function navigate(to: string, {replace = false}: {replace?: boolean} = {}): void {
    const current = window.location.pathname + window.location.search + window.location.hash;
    if (replace) {
        window.history.replaceState({}, '', to);
    } else {
        window.history.pushState({}, '', to);
    }
    const isNewPath = current !== to;
    syncLocation();
    if (!replace && isNewPath) {
        window.scrollTo(0, 0);
    }
}

/**
 * Match a path pattern with `:param` segments against a pathname.
 * Returns the extracted params object on a match, or `null` on no match.
 * Trailing-segment patterns match a prefix (like react-router v5 non-exact routes).
 */
export function matchPath(pattern: string, pathname: string, {exact = false}: {exact?: boolean} = {}): Record<string, string> | null {
    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = pathname.split('/').filter(Boolean);

    if (exact ? pathSegments.length !== patternSegments.length : pathSegments.length < patternSegments.length) {
        return null;
    }

    const params: Record<string, string> = {};
    for (let i = 0; i < patternSegments.length; i++) {
        const patternSegment = patternSegments[i];
        const pathSegment = pathSegments[i];
        if (patternSegment.startsWith(':')) {
            params[patternSegment.slice(1)] = decodeURIComponent(pathSegment);
        } else if (patternSegment !== pathSegment) {
            return null;
        }
    }
    return params;
}

/** Is `to` the active route for the current pathname? Prefix match unless `exact`. */
export function isActive(to: string, {exact = false}: {exact?: boolean} = {}): boolean {
    const pathname = location.pathname;
    if (exact) {
        return pathname === to;
    }
    return pathname === to || pathname.startsWith(to.endsWith('/') ? to : to + '/');
}
