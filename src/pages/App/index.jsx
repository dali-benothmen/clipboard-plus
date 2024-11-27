import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { AppProvider } from './context/AppContext';
import { ModalProvider } from './context/ModalContext';
import { HeaderProvider } from './context/HeaderContext';
import { DrawerProvider } from './context/DrawerContext';

import './index.css';

const container = document.getElementById('app-container');
const root = createRoot(container);

root.render(
  <AppProvider>
    <ModalProvider>
      <HeaderProvider>
        <DrawerProvider>
          <App />
        </DrawerProvider>
      </HeaderProvider>
    </ModalProvider>
  </AppProvider>
);
