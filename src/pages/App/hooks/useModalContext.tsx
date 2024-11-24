import React, { useContext } from 'react';
import { ModalContext, ModalContextType } from '../context/ModalContext';

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext must be used within an ModalProvider');
  }

  return context;
};
