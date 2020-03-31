import {createElement, useState, useEffect, useContext, createContext} from '/web_modules/react.js';

const defaultRedirectCallback = () => window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = createContext();
export const useAuth0 = () => useContext(Auth0Context);

export function Auth0Provider({children, onRedirectCallback = defaultRedirectCallback, ...initOptions}) {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [user, setUser] = useState();
    const [auth0Client, setAuth0] = useState();
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

    async function loginWithPopup(params = {}) {
        setPopupOpen(true);
        try {
            await auth0Client.loginWithPopup(params);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client.getUser();
        setUser(user);
        setIsAuthenticated(true);
    }

    async function handleRedirectCallback() {
        setLoading(true);
        await auth0Client.handleRedirectCallback();
        const user = await auth0Client.getUser();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(user);
    }

    return createElement(Auth0Context.Provider,
        {
            value: {
                isAuthenticated,
                user,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (...parameters) => auth0Client.getIdTokenClaims(...parameters),
                loginWithRedirect: (...parameters) => auth0Client.loginWithRedirect(...parameters),
                getTokenSilently: (...parameters) => auth0Client.getTokenSilently(...parameters),
                getTokenWithPopup: (...parameters) => auth0Client.getTokenWithPopup(...parameters),
                logout: (...parameters) => auth0Client.logout(...parameters)
            }
        }, children);
}