import React, { useContext } from 'react';
import { DrawerContext, DrawerContextType } from '../context/DrawerContext';

export const useDrawerContext = (): DrawerContextType => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawerContext must be used within an DrawerProvider');
  }

  return context;
};
