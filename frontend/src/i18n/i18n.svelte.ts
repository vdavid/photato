import I18n, {type TranslationValues} from './I18n';
import {availableLocaleCodes} from './locales';
import {getDefaultLocaleCodeByNavigatorPreferences} from './i18nHelper';

/*
 * App-wide i18n as a reactive singleton. `instance` is `$state`, so any component that calls `__(...)`
 * or `getActiveLocaleCode()` in its template re-renders once translations finish loading. Locale is
 * pinned to hu-HU today (see i18nHelper) until a language switcher lands.
 */

let instance = $state<I18n | null>(null);

/** Load all locale bundles. Call once at boot; the app shows the loading indicator until it resolves. */
export async function loadTranslations(): Promise<void> {
    const i18n = new I18n({availableLocaleCodes, activeLocaleCode: getDefaultLocaleCodeByNavigatorPreferences()});
    await i18n.loadTranslations();
    instance = i18n;
}

/** True once the locale bundles have loaded. Reactive. */
export function areTranslationsLoaded(): boolean {
    return instance !== null;
}

/** Translate `phrase`, substituting any `{placeholders}` from `values`. Reactive. */
export function __(phrase: string, values?: TranslationValues, localeCode?: string): string {
    return instance ? instance.translate(phrase, values, localeCode) : phrase;
}

/** The active locale code, e.g. "hu-HU". Reactive. */
export function getActiveLocaleCode(): string {
    return instance ? instance.getActiveLocaleCode() : 'hu-HU';
}

export function setActiveLocale(localeCode: string): void {
    instance?.setActiveLocale(localeCode);
}
