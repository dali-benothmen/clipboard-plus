import React, { createContext, useState, useMemo } from 'react';

export interface ModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateCategoryFormVisible: boolean;
  setIsCreateCategoryFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContext: ModalContextType = {
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
  const [isCreateCategoryFormVisible, setIsCreateCategoryFormVisible] =
    useState<boolean>(false);

  const value = useMemo(
    () => ({
      isModalOpen,
      isCreateCategoryFormVisible,
      setIsModalOpen,
      setIsCreateCategoryFormVisible,
    }),
    [isModalOpen, isCreateCategoryFormVisible]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
