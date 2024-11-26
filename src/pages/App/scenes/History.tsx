import React, { useEffect, useMemo, useState } from 'react';
import { Spin, Tabs } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import GroupedItems from '../components/GroupedItems';
import SaveClipboardModal from '../components/SaveClipboardModal';
import { useAppContext } from '../hooks/useAppContext';
import { useModalContext } from '../hooks/useModalContext';
import FilteredItemsList from '../components/FilteredItemsList';
import { uuid } from '../../../utils/uuid';
import { Category, ClipboardItem } from '../../../types';

const groupItemsByDate = (items: ClipboardItem[]) => {
  return items.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString('en-CA');

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {} as Record<string, ClipboardItem[]>);
};

const groupItemsByCategory = (
  items: ClipboardItem[],
  categories: Category[]
) => {
  const grouped = categories.reduce((acc, category) => {
    acc[category.name] = [];
    return acc;
  }, {} as Record<string, ClipboardItem[]>);

  items.forEach((item) => {
    const categoryName = item.category?.name;
    if (categoryName && grouped[categoryName]) {
      grouped[categoryName].push(item);
    }
  });

  return Object.fromEntries(
    Object.entries(grouped).filter(([, items]) => items.length > 0)
  );
};

const GroupedByDate = ({
  groupedItems,
}: {
  groupedItems: Record<string, ClipboardItem[]>;
}) => <GroupedItems groupedItems={groupedItems} groupName="date" />;

const GroupedByCategory = ({
  groupedItems,
}: {
  groupedItems: Record<string, ClipboardItem[]>;
}) => <GroupedItems groupedItems={groupedItems} groupName="category" />;

const History = () => {
  const {
    clipboardItems,
    setClipboardItems,
    categories,
    setCategories,
    filteredClipboardItems,
    isSearching,
  } = useAppContext();
  const { setIsModalOpen } = useModalContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const groupedItemsByDate = useMemo(
    () => groupItemsByDate(clipboardItems),
    [clipboardItems]
  );
  const groupedItemsByCategory = useMemo(
    () => groupItemsByCategory(clipboardItems, categories),
    [clipboardItems, categories]
  );

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      chrome.storage.local.get(
        ['clipboardHistory', 'categories'],
        ({ clipboardHistory, categories }) => {
          if (clipboardHistory) {
            setClipboardItems(clipboardHistory);
          }

          if (categories) {
            setCategories(categories);
          }

          setIsLoading(false);
        }
      );
    };

    fetchData();
  }, [setClipboardItems, setCategories]);

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

    if (category) {
      chrome.storage.local.get(
        ['clipboardHistory'],
        ({ clipboardHistory = [] }) => {
          const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
            item.id === itemId ? { ...item, category } : item
          );

          chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
            setClipboardItems(updatedItems);
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
      <SaveClipboardModal
        onCreateCategory={handleCreateCategory}
        onSaveClipboard={handleSaveClipboardItemToCategory}
      />
      {isLoading && <Spin tip="Loading" size="default" />}
      {!isLoading && !isSearching && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            key="1"
            tab={
              <span>
                <BarsOutlined /> By date
              </span>
            }
            children={<GroupedByDate groupedItems={groupedItemsByDate} />}
          />
          <Tabs.TabPane
            key="2"
            tab={
              <span>
                <AppstoreOutlined /> By category
              </span>
            }
            children={
              <GroupedByCategory groupedItems={groupedItemsByCategory} />
            }
          />
        </Tabs>
      )}
      {isSearching && (
        <FilteredItemsList filteredItems={filteredClipboardItems} />
      )}
    </>
  );
};

export default History;
