import {availableLocaleCodes, availableLanguageCodes, defaultLocaleCode} from './locales';

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
 * @returns Always fully qualified, available locale codes. E.g. "en-US". Defaults to "en-US".
 */
export function getDefaultLocaleCodeByNavigatorPreferences(navigatorPreferences: readonly string[] = window.navigator.languages): string {
    /* Find first preferred locale that we know */
    const preferredNavigatorLocale = navigatorPreferences.find(_getLocaleCodeByNavigatorPreference);

    /* Return our clean locale code */
    // TODO: Re-enable this once we have a language switcher
    //return preferredNavigatorLocale ? _getLocaleCodeByNavigatorPreference(preferredNavigatorLocale) : defaultLocaleCode;
    return 'hu-HU';
}