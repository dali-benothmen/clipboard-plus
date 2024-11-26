import React, { createContext, useState, useMemo } from 'react';
import { Category, ClipboardItem, SetStateDispatcher } from '../../../types';

export enum Scenes {
  HISTORY = 'History',
  INSIGHTS = 'Insights',
  TRASH = 'Trash',
  SETTINGS = 'Settings',
}

export type Scene =
  | Scenes.HISTORY
  | Scenes.INSIGHTS
  | Scenes.TRASH
  | Scenes.SETTINGS;

export interface AppContextType {
  scene: Scene;
  setScene: (scene: Scene) => void;
  clipboardItems: ClipboardItem[];
  setClipboardItems: SetStateDispatcher<ClipboardItem[]>;
  checkedItems: string[];
  setCheckedItems: SetStateDispatcher<string[]>;
  categories: Category[];
  setCategories: SetStateDispatcher<Category[]>;
  savedClipboardId: string;
  setSavedClipboardId: SetStateDispatcher<string>;
  filteredClipboardItems: ClipboardItem[];
  setFilteredClipboardItems: SetStateDispatcher<ClipboardItem[]>;
}

const defaultContext: AppContextType = {
  scene: Scenes.HISTORY,
  setScene: () => {},
  clipboardItems: [],
  setClipboardItems: () => {},
  checkedItems: [],
  setCheckedItems: () => {},
  categories: [],
  setCategories: () => {},
  savedClipboardId: '',
  setSavedClipboardId: () => {},
  filteredClipboardItems: [],
  setFilteredClipboardItems: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [scene, setScene] = useState<Scene>(Scenes.HISTORY);
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);
  const [filteredClipboardItems, setFilteredClipboardItems] = useState<
    ClipboardItem[]
  >([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [savedClipboardId, setSavedClipboardId] = useState<string>('');

  const value = useMemo(
    () => ({
      scene,
      setScene,
      clipboardItems,
      setClipboardItems,
      checkedItems,
      setCheckedItems,
      categories,
      setCategories,
      savedClipboardId,
      setSavedClipboardId,
      filteredClipboardItems,
      setFilteredClipboardItems,
    }),
    [
      scene,
      clipboardItems,
      checkedItems,
      categories,
      savedClipboardId,
      filteredClipboardItems,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
