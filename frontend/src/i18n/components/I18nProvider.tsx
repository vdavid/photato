import React, {createContext, useState, useEffect, useContext} from 'react';
import I18n from '../I18n';

/** Placeholder values passed to a translation, e.g. `{weekIndex: 3}`. */
export type TranslationValues = Record<string, string | number>;

/** The `__` translate helper. Returns a string; a handful of translations resolve to JSX, which is
 * only ever consumed in a render position, so a `string` type is sound at every call site. */
export type Translate = (phrase: string, values?: TranslationValues, localeCode?: string) => string;

export interface I18nContextValue {
    setActiveLocale: (localeCode: string) => void;
    getActiveLocaleCode: () => string;
    areTranslationsLoaded: boolean;
    __: Translate;
}

/* No default value exists before a provider mounts; every real read happens under the provider. */
export const I18nContext = createContext<I18nContextValue>(undefined as unknown as I18nContextValue);
export const useI18n = (): I18nContextValue => useContext(I18nContext);

interface I18nProviderProps {
    children: React.ReactNode;
    /** E.g. ["en-US", "hu-HU"], the order doesn't matter. */
    availableLocaleCodes: string[];
    /** E.g. "en-US". */
    activeLocaleCode: string;
}

export default function I18nProvider({children, availableLocaleCodes, activeLocaleCode}: I18nProviderProps) {
    const [i18n, setI18n] = useState<I18n | null>(null);

    useEffect(() => {
        async function loadTranslations() {
            const i18n = new I18n({availableLocaleCodes, activeLocaleCode});
            await i18n.loadTranslations();
            setI18n(i18n);
        }

        // noinspection JSIgnoredPromiseFromCall
        loadTranslations();
    }, []);

    const value: I18nContextValue = {
        setActiveLocale: i18n ? i18n.setActiveLocale.bind(i18n) : (undefined as unknown as I18nContextValue['setActiveLocale']),
        getActiveLocaleCode: i18n ? i18n.getActiveLocaleCode.bind(i18n) : (undefined as unknown as I18nContextValue['getActiveLocaleCode']),
        areTranslationsLoaded: !!i18n,
        __: (...args: Parameters<Translate>) => (i18n ? i18n.translate(...args) : args[0]),
    };

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
