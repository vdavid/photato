import React, {createContext, useState, useEffect, useContext} from 'react';
import I18n from '../I18n.jsx';

export const I18nContext = createContext();
export const useI18n = () => useContext(I18nContext);

/**
 * @param children
 * @param {string[]} availableLocaleCodes E.g. ["en-US", "hu-HU"], the order doesn't matter.
 * @param {string} activeLocaleCode E.g. "en-US"
 * @returns {React.ReactElement}
 * @constructor
 */
export default function I18nProvider({children, availableLocaleCodes, activeLocaleCode}) {
    const [i18n, setI18n] = useState(null);

    useEffect(() => {
        async function loadTranslations() {
            const i18n = new I18n({availableLocaleCodes, activeLocaleCode});
            await i18n.loadTranslations();
            setI18n(i18n);
        }

        // noinspection JSIgnoredPromiseFromCall
        loadTranslations();
    }, []);

    return <I18nContext.Provider value={{
        setActiveLocale: i18n ? i18n.setActiveLocale.bind(i18n) : undefined,
        getActiveLocaleCode: i18n ? i18n.getActiveLocaleCode.bind(i18n) : undefined,
        areTranslationsLoaded: !!i18n,
        __: (...args) => i18n ? i18n.translate.apply(i18n, args) : args[0]
    }}>{children}</I18nContext.Provider>;
}