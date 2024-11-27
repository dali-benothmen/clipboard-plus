import React, { createContext, useState, useMemo } from 'react';
import { ClipboardItem, SetStateDispatcher } from '../../../types';

export interface DrawerContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: SetStateDispatcher<boolean>;
  clipboardDetails: ClipboardItem;
  setClipboardDetails: SetStateDispatcher<ClipboardItem>;
}

const defaultContext: DrawerContextType = {
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  clipboardDetails: {} as ClipboardItem,
  setClipboardDetails: () => {},
};

export const DrawerContext = createContext<DrawerContextType>(defaultContext);

interface DrawerProviderProps {
  children: React.ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [clipboardDetails, setClipboardDetails] = useState<ClipboardItem>(
    {} as ClipboardItem
  );

  const value = useMemo(
    () => ({
      isDrawerOpen,
      setIsDrawerOpen,
      clipboardDetails,
      setClipboardDetails,
    }),
    [isDrawerOpen, clipboardDetails]
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};
