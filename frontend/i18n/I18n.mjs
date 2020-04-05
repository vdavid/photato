export default class I18n {
    constructor({availableLocaleCodes, translationFolderPath, activeLocaleCode}) {
        this._availableLocaleCodes = availableLocaleCodes;
        this._translationFolderPath = translationFolderPath;
        this._activeLocaleCode = activeLocaleCode;
        this._translations = {};
    }

    /**
     * @returns {Promise<void>}
     */
    async loadTranslations() {
        /* Load translations in all locales in parallel */
        const localeAndTranslationPromises = this._availableLocaleCodes.map(
            async localeCode => ({localeCode, translations: await this._loadTranslationsForLocale(localeCode)}));
        const localesAndTranslations = await Promise.all(localeAndTranslationPromises);

        /* Load this data to keys in this._translations */
        localesAndTranslations.forEach(localeAndTranslation => this._translations[localeAndTranslation.localeCode] = localeAndTranslation.translations);
    }

    /**
     * @param {string} localeCode Must be one of the active locales.
     */
    setActiveLocale(localeCode) {
        if (this._availableLocaleCodes.includes(localeCode)) {
            this._activeLocaleCode = localeCode;
        } else {
            throw new Error('Invalid locale code to set as active: ' + localeCode);
        }
    }

    getActiveLocale() {
        return this._activeLocaleCode;
    }

    /**
     * @param {string} localizedString
     * @param {Object<string, string>} values
     * @returns {*}
     * @private
     */
    _replacePlaceholdersInLocalizedString(localizedString, values) {
        return localizedString.replace(/{([\w-]+?)}/g, (match, key) => values[key] || key);
    }

    _logMissingPhrase(phrase, localeCode) {
        console.warn('Missing phrase: "' + phrase + '". (Tried to translate it to ' + localeCode + '.)');
    }

    /**
     * @param {string} phrase The phrase to translate.
     *        May contain placeholders in curly braces like in "Hello {name}!"
     * @param {Object<string, string>} [values]
     * @param {string} [localeCode] The locale to translate to.
     */
    translate(phrase, values = {}, localeCode = this._activeLocaleCode) {
        if (this._translations[localeCode]) {
            const localizedString = (this._translations[localeCode][phrase] || {}).translation;
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
                throw new Error('Translations haven\'t been loaded yet!');
            }
        }
    }

    async _loadTranslationsForLocale(localeCode) {
        const {translations} = await import(this._translationFolderPath + localeCode + '.mjs');
        return translations;
    }
}