import { apiBaseUrl } from '../config'

/*
 * Magic-link session auth (replaces Auth0). Flow — see docs/auth-contract.md:
 *   1. Login page posts the email to `/auth/request-link`; the backend emails a link.
 *   2. The `/login/verify` route posts the link token to `/auth/verify`, which returns
 *      `{sessionToken, user}`.
 *   3. We keep `sessionToken` in localStorage and send it as `Authorization: Bearer …` on every API
 *      call. `/auth/me` re-hydrates the user on load; `/auth/logout` ends the session.
 *
 * `isAdmin` is authoritative truth from the backend (`ADMIN_EMAILS`), never derived client-side.
 */

export interface User {
  emailAddress: string
  isAdmin: boolean
}

const SESSION_TOKEN_STORAGE_KEY = 'sessionToken'

interface AuthState {
  user: User | null
  /** True until the initial `/auth/me` re-hydration settles, so the app can hold routing decisions. */
  isLoading: boolean
}

const state = $state<AuthState>({ user: null, isLoading: true })

/** Reactive auth snapshot. Read `auth.user` / `auth.isLoading` in templates. */
export const auth = {
  get user(): User | null {
    return state.user
  },
  get isLoading(): boolean {
    return state.isLoading
  },
  get isAuthenticated(): boolean {
    return state.user !== null
  },
  get isAdmin(): boolean {
    return state.user?.isAdmin === true
  },
}

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
}

function setSession(sessionToken: string, user: User): void {
  localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, sessionToken)
  state.user = user
}

function clearSession(): void {
  localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY)
  state.user = null
}

/** Re-hydrate the user from a stored session token. Call once at boot. Always resolves. */
export async function initAuth(): Promise<void> {
  const token = getSessionToken()
  if (!token) {
    state.isLoading = false
    return
  }
  try {
    const response = await fetch(apiBaseUrl + '/auth/me', {
      headers: { Authorization: 'Bearer ' + token },
    })
    if (response.ok) {
      state.user = (await response.json()) as User
    } else {
      clearSession()
    }
  } catch (error) {
    console.error('Failed to re-hydrate the session:', error)
  } finally {
    state.isLoading = false
  }
}

/** Request a magic link. Always resolves — the backend returns 200 regardless (no enumeration), and a
 * network hiccup is swallowed so the UI shows the same "check your inbox" state either way. */
export async function requestLink(email: string): Promise<void> {
  try {
    await fetch(apiBaseUrl + '/auth/request-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch (error) {
    console.error('Failed to request a login link:', error)
  }
}

/**
 * Exchange a magic-link token for a session. On success stores the token, sets the user, and returns
 * true. On a 401 (tampered / expired / already-used) returns false. Throws only on a network error.
 */
export async function verify(token: string): Promise<boolean> {
  const response = await fetch(apiBaseUrl + '/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!response.ok) {
    return false
  }
  const { sessionToken, user } = (await response.json()) as { sessionToken: string; user: User }
  setSession(sessionToken, user)
  return true
}

/** End the session. Best-effort server call, then clears local state regardless. */
export async function logout(): Promise<void> {
  const token = getSessionToken()
  if (token) {
    try {
      await fetch(apiBaseUrl + '/auth/logout', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
      })
    } catch (error) {
      console.error('Logout request failed (clearing local session anyway):', error)
    }
  }
  clearSession()
}
