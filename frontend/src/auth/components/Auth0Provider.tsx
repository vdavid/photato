import React, {useState, useEffect, useContext, createContext} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

/* Derive the client + user types from `createAuth0Client` so we don't depend on which names the
 * package happens to re-export. */
type Auth0Client = Awaited<ReturnType<typeof createAuth0Client>>;
type Auth0ClientOptions = Parameters<typeof createAuth0Client>[0];
export type Auth0User = NonNullable<Awaited<ReturnType<Auth0Client['getUser']>>>;

export interface Auth0ContextValue {
    isAuthenticated: boolean | undefined;
    user: Auth0User | undefined;
    loading: boolean;
    popupOpen: boolean;
    loginWithPopup: (parameters?: Parameters<Auth0Client['loginWithPopup']>[0]) => Promise<void>;
    handleRedirectCallback: () => Promise<void>;
    getIdTokenClaims: (...parameters: Parameters<Auth0Client['getIdTokenClaims']>) => ReturnType<Auth0Client['getIdTokenClaims']>;
    loginWithRedirect: (...parameters: Parameters<Auth0Client['loginWithRedirect']>) => ReturnType<Auth0Client['loginWithRedirect']>;
    getTokenSilently: (...parameters: Parameters<Auth0Client['getTokenSilently']>) => ReturnType<Auth0Client['getTokenSilently']>;
    getTokenWithPopup: (...parameters: Parameters<Auth0Client['getTokenWithPopup']>) => ReturnType<Auth0Client['getTokenWithPopup']>;
    logout: (...parameters: Parameters<Auth0Client['logout']>) => ReturnType<Auth0Client['logout']>;
}

const defaultRedirectCallback = () => window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = createContext<Auth0ContextValue>(undefined as unknown as Auth0ContextValue);
export const useAuth0 = (): Auth0ContextValue => useContext(Auth0Context); /* User data docs: https://auth0.com/docs/api/authentication#get-user-info */

interface Auth0ProviderProps extends Auth0ClientOptions {
    children: React.ReactNode;
    onRedirectCallback?: (appState?: unknown) => void;
}

export function Auth0Provider({children, onRedirectCallback = defaultRedirectCallback, ...initOptions}: Auth0ProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
    const [user, setUser] = useState<Auth0User>();
    const [auth0Client, setAuth0] = useState<Auth0Client>();
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        async function initAuth0() {
            /* API Docs on this object: https://auth0.github.io/auth0-spa-js/classes/auth0client.html */
            const auth0FromHook = await createAuth0Client(initOptions);
            setAuth0(auth0FromHook);

            if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
                const {appState} = await auth0FromHook.handleRedirectCallback();
                onRedirectCallback(appState);
            }

            const isAuthenticated = await auth0FromHook.isAuthenticated();

            setIsAuthenticated(isAuthenticated);

            if (isAuthenticated) {
                const user = await auth0FromHook.getUser();
                setUser(user);
            }

            setLoading(false);
        }

        // noinspection JSIgnoredPromiseFromCall
        initAuth0();
    }, []);

    // TODO: Start using this instead of the redirect somehow?
    async function loginWithPopup(parameters: Parameters<Auth0Client['loginWithPopup']>[0] = {}) {
        setPopupOpen(true);
        try {
            await auth0Client!.loginWithPopup(parameters);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client!.getUser();
        setUser(user);
        setIsAuthenticated(true);
    }

    async function handleRedirectCallback() {
        setLoading(true);
        await auth0Client!.handleRedirectCallback();
        // @ts-expect-error Pre-existing bug in dead code: `getUser()` returns a Promise, which has no
        // `getTokenSilently`. This method is never consumed anywhere; kept as-is pending removal.
        auth0Client!.getUser().getTokenSilently();
        const user = await auth0Client!.getUser();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(user);
    }

    return <Auth0Context.Provider value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...parameters) => auth0Client!.getIdTokenClaims(...parameters),
        loginWithRedirect: (...parameters) => auth0Client!.loginWithRedirect(...parameters),
        getTokenSilently: (...parameters) => auth0Client!.getTokenSilently(...parameters),
        getTokenWithPopup: (...parameters) => auth0Client!.getTokenWithPopup(...parameters),
        logout: (...parameters) => auth0Client!.logout(...parameters)
    }}>{children}</Auth0Context.Provider>;
}
