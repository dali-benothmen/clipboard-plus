import React, { createContext, useState, useMemo } from 'react';
import { SetStateDispatcher } from '../../../types';

export interface ModalContextType {
  isClearClipboardModalOpen: boolean;
  setIsClearClipboardModalOpen: SetStateDispatcher<boolean>;
  isModalOpen: boolean;
  setIsModalOpen: SetStateDispatcher<boolean>;
  isCreateCategoryFormVisible: boolean;
  setIsCreateCategoryFormVisible: SetStateDispatcher<boolean>;
}

const defaultContext: ModalContextType = {
  isClearClipboardModalOpen: false,
  setIsClearClipboardModalOpen: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  isCreateCategoryFormVisible: false,
  setIsCreateCategoryFormVisible: () => {},
};

export const ModalContext = createContext<ModalContextType>(defaultContext);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isClearClipboardModalOpen, setIsClearClipboardModalOpen] =
    useState<boolean>(false);
  const [isCreateCategoryFormVisible, setIsCreateCategoryFormVisible] =
    useState<boolean>(false);

  const value = useMemo(
    () => ({
      isModalOpen,
      isCreateCategoryFormVisible,
      isClearClipboardModalOpen,
      setIsClearClipboardModalOpen,
      setIsModalOpen,
      setIsCreateCategoryFormVisible,
    }),
    [isModalOpen, isCreateCategoryFormVisible, isClearClipboardModalOpen]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
