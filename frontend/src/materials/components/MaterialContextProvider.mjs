import {createElement, createContext, useContext} from '../../web_modules/react.js';

export const MaterialContext = createContext();
export const useMaterialContext = () => useContext(MaterialContext);

/**
 * @param {ArticleMetadata} metadata
 * @param children
 * @returns {React.ReactElement}
 * @constructor
 */
export default function MaterialContextProvider({children, metadata}) {
    return createElement(MaterialContext.Provider, {
        value: {
            metadata,
        }
    }, children);
}