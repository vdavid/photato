import type React from 'react';
import type {TranslationValues} from './components/I18nProvider';

/** A single translation entry. `translation` is usually a string, but some entries resolve to JSX
 * (marked `format: 'jsx'`), which is only ever rendered, never string-manipulated. */
export interface Translation {
    translation: string | React.ReactElement;
    /** Marker used by some entries (e.g. "jsx") to flag a non-string value; informational only. */
    format?: string;
}

export type TranslationMap = Record<string, Translation>;

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

        /* Load this data to keys in this._translations */
        localesAndTranslations.forEach(localeAndTranslation => this._translations[localeAndTranslation.localeCode] = localeAndTranslation.translations);
    }

    /**
     * @param localeCode Must be one of the active locales.
     */
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

    /**
     * This function replaces placeholders like {this-one} with the values provided.
     */
    private _replacePlaceholdersInLocalizedString(localizedString: string, values: TranslationValues): string {
        return localizedString.replace(/{([\w-]+?)}/g, (match, key: string) => (values[key] !== undefined) ? String(values[key]) : key);
    }

    private _logMissingPhrase(phrase: string, localeCode: string): void {
        console.warn('Missing phrase: "' + phrase + '". (Tried to translate it to ' + localeCode + '.)');
    }

    /**
     * @param phrase The phrase to translate.
     *        May contain placeholders in curly braces like in "Hello {name}!"
     * @param values Placeholder values.
     * @param localeCode The locale to translate to.
     * @returns The translated string. A handful of entries resolve to JSX (rendered as-is); the
     *          `string` return is a render-safe view of that — callers only ever render the result.
     */
    translate(phrase: string, values: TranslationValues = {}, localeCode: string = this._activeLocaleCode): string {
        if (this._translations[localeCode]) {
            if (typeof phrase === 'string') {
                const localizedString = this._translations[localeCode][phrase]?.translation;
                if (localizedString !== undefined) {
                    if (typeof localizedString === 'string') {
                        return this._replacePlaceholdersInLocalizedString(localizedString, values);
                    } else { /* JSX, placeholder replace is not supported. */
                        return localizedString as unknown as string;
                    }
                } else {
                    if (localeCode !== 'en-US') { /* We don't need translations for the base language. */
                        this._logMissingPhrase(phrase, localeCode);
                    }
                    return this._replacePlaceholdersInLocalizedString(phrase, values);
                }
            } else {
                throw new Error('The phrase must be a string! ' + phrase + ' is not a string.');
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
        const {translations} = await import(`./translations/${localeCode}.tsx`);
        return translations;
    }
}
