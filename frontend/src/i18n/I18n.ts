/** A single translation entry. `translation` is a string. A few entries are trusted HTML fragments
 * (marked `format: 'html'`), rendered at their call site with `{@html}` — see the `__` usages in
 * FullPageLoadingIndicator and MaterialsPage. */
export interface Translation {
    translation: string;
    /** Marker for HTML-fragment entries (`'html'`); informational only. */
    format?: string;
}

export type TranslationMap = Record<string, Translation>;

/** Placeholder values passed to a translation, e.g. `{weekIndex: 3}`. */
export type TranslationValues = Record<string, string | number>;

export default class I18n {
    private readonly _availableLocaleCodes: string[];
    private _activeLocaleCode: string;
    private _translations: Record<string, TranslationMap>;

    /**
     * @param availableLocaleCodes E.g. ['en-US', 'hu-HU']. The order doesn't matter.
     * @param activeLocaleCode E.g. "en-US"
     */
    constructor({availableLocaleCodes, activeLocaleCode}: {availableLocaleCodes: string[]; activeLocaleCode: string}) {
        this._availableLocaleCodes = availableLocaleCodes;
        this._activeLocaleCode = activeLocaleCode;
        this._translations = {};
    }

    async loadTranslations(): Promise<void> {
        /* Load translations in all locales in parallel */
        const localeAndTranslationPromises = this._availableLocaleCodes.map(
            async localeCode => ({localeCode, translations: await this._loadTranslationsForLocale(localeCode)}));
        const localesAndTranslations = await Promise.all(localeAndTranslationPromises);
        localesAndTranslations.forEach(localeAndTranslation => this._translations[localeAndTranslation.localeCode] = localeAndTranslation.translations);
    }

    /** @param localeCode Must be one of the active locales. */
    setActiveLocale(localeCode: string): void {
        if (this._availableLocaleCodes.includes(localeCode)) {
            this._activeLocaleCode = localeCode;
        } else {
            throw new Error('Invalid locale code to set as active: ' + localeCode);
        }
    }

    getActiveLocaleCode(): string {
        return this._activeLocaleCode;
    }

    /** Replaces placeholders like {this-one} with the values provided. */
    private _replacePlaceholdersInLocalizedString(localizedString: string, values: TranslationValues): string {
        return localizedString.replace(/{([\w-]+?)}/g, (match, key: string) => (values[key] !== undefined) ? String(values[key]) : key);
    }

    private _logMissingPhrase(phrase: string, localeCode: string): void {
        console.warn('Missing phrase: "' + phrase + '". (Tried to translate it to ' + localeCode + '.)');
    }

    /**
     * @param phrase The phrase to translate. May contain placeholders in curly braces like "Hello {name}!"
     * @param values Placeholder values.
     * @param localeCode The locale to translate to.
     * @returns The translated string (HTML-fragment entries return their HTML string; the caller renders
     *          those with `{@html}`).
     */
    translate(phrase: string, values: TranslationValues = {}, localeCode: string = this._activeLocaleCode): string {
        if (this._translations[localeCode]) {
            const localizedString = this._translations[localeCode][phrase]?.translation;
            if (localizedString !== undefined) {
                return this._replacePlaceholdersInLocalizedString(localizedString, values);
            } else {
                if (localeCode !== 'en-US') { /* We don't need translations for the base language. */
                    this._logMissingPhrase(phrase, localeCode);
                }
                return this._replacePlaceholdersInLocalizedString(phrase, values);
            }
        } else {
            if (Object.keys(this._translations).length !== 0) {
                throw new Error('Invalid locale code for translation: ' + localeCode);
            } else {
                throw new Error('Translations haven’t been loaded yet!');
            }
        }
    }

    private async _loadTranslationsForLocale(localeCode: string): Promise<TranslationMap> {
        /* Relative literal prefix so the bundler can statically discover every translation module
         * (Vite's dynamic-import glob). The files live in ./translations/ next to this file. */
        const {translations} = await import(`./translations/${localeCode}.ts`);
        return translations;
    }
}
