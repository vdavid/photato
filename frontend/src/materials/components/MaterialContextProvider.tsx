import React, {createContext, useContext} from 'react';
import type {ArticleMetadata} from '../types';

export interface MaterialContextValue {
    metadata: ArticleMetadata;
}

export const MaterialContext = createContext<MaterialContextValue>(undefined as unknown as MaterialContextValue);
export const useMaterialContext = (): MaterialContextValue => useContext(MaterialContext);

interface MaterialContextProviderProps {
    children: React.ReactNode;
    metadata: ArticleMetadata;
}

export default function MaterialContextProvider({children, metadata}: MaterialContextProviderProps) {
    return <MaterialContext.Provider value={{metadata}}>{children}</MaterialContext.Provider>;
}
