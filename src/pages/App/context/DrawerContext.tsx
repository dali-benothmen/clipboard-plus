import React, { createContext, useState, useMemo } from 'react';
import { SetStateDispatcher } from '../../../types';

export interface DrawerContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: SetStateDispatcher<boolean>;
}

const defaultContext: DrawerContextType = {
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
};

export const DrawerContext = createContext<DrawerContextType>(defaultContext);

interface DrawerProviderProps {
  children: React.ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      isDrawerOpen,
      setIsDrawerOpen,
    }),
    [isDrawerOpen]
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};
