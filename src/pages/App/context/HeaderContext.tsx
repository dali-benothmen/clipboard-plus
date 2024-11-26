import React, { createContext, useState, useMemo } from 'react';
import { SetStateDispatcher } from '../../../types';

export interface HeaderContextType {
  searchQuery: string;
  setSearchQuery: SetStateDispatcher<string>;
}

const defaultContext: HeaderContextType = {
  searchQuery: '',
  setSearchQuery: () => {},
};

export const HeaderContext = createContext<HeaderContextType>(defaultContext);

interface HeaderProviderProps {
  children: React.ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
    }),
    [searchQuery]
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
};
