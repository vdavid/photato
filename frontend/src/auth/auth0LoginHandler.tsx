export function saveUrlAndLoginWithRedirect(loginWithRedirectFunction: (options: {redirect_uri: string}) => unknown, pathname: string): void {
    localStorage.setItem('redirectPathAfterLogin', pathname);
    loginWithRedirectFunction({redirect_uri: window.location.origin + '/login-callback'});
}

export function getAndRemoveRedirectPath(): string | null {
    const url = localStorage.getItem('redirectPathAfterLogin');
    localStorage.removeItem('redirectUrlAfterLogin');
    return url;
}
