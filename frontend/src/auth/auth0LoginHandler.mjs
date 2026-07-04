/**
 * @param {function(Object): void} loginWithRedirectFunction
 * @param {string} pathname
 */
export function saveUrlAndLoginWithRedirect(loginWithRedirectFunction, pathname) {
    localStorage.setItem('redirectPathAfterLogin', pathname);
    loginWithRedirectFunction({redirect_uri: window.location.origin + '/login-callback'});
}

/**
 * @returns {string}
 */
export function getAndRemoveRedirectPath() {
    const url = localStorage.getItem('redirectPathAfterLogin');
    localStorage.removeItem('redirectUrlAfterLogin');
    return url;
}
