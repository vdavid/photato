import {availableLocaleCodes, availableLanguageCodes} from './locales';

/**
 * @param navigatorLocaleCode E.g. "en-US" but also "en".
 * @returns E.g. "en-US"
 */
function _getLocaleCodeByNavigatorPreference(navigatorLocaleCode: string): string | undefined {
    return availableLocaleCodes.find(localeCode => localeCode === navigatorLocaleCode)
        || availableLanguageCodes.find(localeCode => localeCode === navigatorLocaleCode);
}

/**
 * @param navigatorPreferences Usually the user's "window.navigator.languages" array that may contain
 *        locale codes (e.g. "es-MX") or language codes (e.g. "es").
 * @returns Always a fully qualified, available locale code. Currently pinned to "hu-HU" until there's
 *          a language switcher.
 */
export function getDefaultLocaleCodeByNavigatorPreferences(navigatorPreferences: readonly string[] = window.navigator.languages): string {
    /* Find the first preferred locale that we know (kept for when the language switcher lands). */
    void navigatorPreferences.find(_getLocaleCodeByNavigatorPreference);

    // TODO: Re-enable navigator-based selection once we have a language switcher.
    return 'hu-HU';
}
