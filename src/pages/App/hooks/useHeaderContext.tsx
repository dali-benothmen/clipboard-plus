import React, { useContext } from 'react';
import { HeaderContext, HeaderContextType } from '../context/HeaderContext';

export const useHeaderContext = (): HeaderContextType => {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error('useHeaderContext must be used within an AppProvider');
  }

  return context;
};
