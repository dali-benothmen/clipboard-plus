import React, { useRef } from 'react';
import { Layout, theme } from 'antd';

import CheckedItemsToolbar from './components/CheckedItemsToolbar';
import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';
import AppScene, { Scenes } from './scenes';
import ClipboardDetailsPanel from './components/ClipboardDetailsPanel';
import { useAppContext } from './hooks/useAppContext';
import FilteredItemsList from './components/FilteredItemsList';
import SaveClipboardModal from './components/SaveClipboardModal';
import { useModalContext } from './hooks/useModalContext';
import { uuid } from '../../utils/uuid';
import { Category, ClipboardItem } from '../../types';

import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  const {
    checkedItems,
    scene,
    setScene,
    setCheckedItems,
    setClipboardItems,
    filteredClipboardItems,
    setFilteredClipboardItems,
    setCategories,
  } = useAppContext();
  const { setIsModalOpen } = useModalContext();

  const nodeRef = useRef(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMoveToTrash = (checkedItems: string[]) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
        checkedItems.includes(item.id)
          ? { ...item, isTrashed: !item.isTrashed }
          : item
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
        setCheckedItems([]);
      });
    });
  };

  const handleDelete = (checkedItems: string[]) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.filter(
        (item: ClipboardItem) => !checkedItems.includes(item.id)
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
        setCheckedItems([]);
      });
    });
  };

  const handleCreateCategory = (categoryName: string) => {
    const trimmedName = categoryName.trim().toLowerCase();

    chrome.storage.local.get(['categories'], ({ categories = [] }) => {
      const isDuplicate = categories.some(
        (category: Category) =>
          category.name.trim().toLowerCase() === trimmedName
      );

      if (isDuplicate)
        return alert(`Category "${categoryName}" already exists.`);

      const newCategory = { id: uuid(), name: categoryName.trim() };
      const updatedCategories = [...categories, newCategory];

      chrome.storage.local.set({ categories: updatedCategories }, () => {
        setCategories(updatedCategories);
      });
    });
  };

  const handleSaveClipboardItemToCategory = async (
    itemId: string,
    categoryName: string
  ) => {
    const category = await ensureCategoryExists(categoryName);
    const isFilteredListEmpty = filteredClipboardItems.length === 0;

    if (category) {
      chrome.storage.local.get(
        ['clipboardHistory'],
        ({ clipboardHistory = [] }) => {
          const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
            item.id === itemId ? { ...item, category, pinned: true } : item
          );

          const updatedFilteredItems = !isFilteredListEmpty
            ? filteredClipboardItems.map((item: ClipboardItem) =>
                item.id === itemId ? { ...item, category, pinned: true } : item
              )
            : [];

          chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
            setClipboardItems(updatedItems);

            if (!isFilteredListEmpty) {
              setFilteredClipboardItems(updatedFilteredItems);
            }

            setIsModalOpen(false);
          });
        }
      );
    }
  };

  const ensureCategoryExists = async (
    categoryName: string
  ): Promise<Category | null> => {
    const trimmedName = categoryName.trim().toLowerCase();

    try {
      const result = await chrome.storage.local.get(['categories']);
      const categories: Category[] = result.categories || [];

      let category = categories.find(
        (c) => c.name.trim().toLowerCase() === trimmedName
      );

      if (!category) {
        category = { id: uuid(), name: categoryName.trim() };
        const updatedCategories = [...categories, category];

        await chrome.storage.local.set({ categories: updatedCategories });
        setCategories(updatedCategories);
      }

      return category;
    } catch (error) {
      console.error('Error ensuring category existence:', error);
      return null;
    }
  };

  return (
    <>
      <ClipboardDetailsPanel onMoveToTrash={handleMoveToTrash} />
      <SaveClipboardModal
        onCreateCategory={handleCreateCategory}
        onSaveClipboard={handleSaveClipboardItemToCategory}
      />
      <Layout>
        <SidebarMenu onSceneChange={setScene} />
        <Layout style={{ position: 'relative' }}>
          <CheckedItemsToolbar
            visible={checkedItems.length > 0}
            checkedItemsCount={checkedItems.length}
            onClearSelection={() => setCheckedItems([])}
            onDelete={() => handleDelete(checkedItems)}
            onMoveToTrash={() => handleMoveToTrash(checkedItems)}
            nodeRef={nodeRef}
          />
          <Header scene={scene} />
          <Content
            style={{
              margin: '24px 90px',
              padding: 24,
              minHeight: 280,
              overflowY: 'scroll',
              background: scene === Scenes.INSIGHTS ? 'none' : colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {filteredClipboardItems.length > 0 ? (
              <FilteredItemsList filteredItems={filteredClipboardItems} />
            ) : (
              <AppScene scene={scene} />
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
