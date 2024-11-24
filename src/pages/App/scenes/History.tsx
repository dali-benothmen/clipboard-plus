import React, { useEffect, useMemo } from 'react';
import { message, Tabs } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';

import GroupedItems, { GroupedItemsType } from '../components/GroupedItems';
import SaveClipboardModal from '../components/SaveClipboardModal';
import { useAppContext } from '../hooks/useAppContext';
import { useModalContext } from '../hooks/useModalContext';
import { uuid } from '../../../utils/uuid';
import { Category, ClipboardItem } from '../../../types';

const groupItemsByDate = (items: ClipboardItem[]) => {
  return items.reduce((acc, item) => {
    const date = item.timestamp.split('T')[0];

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {} as Record<string, ClipboardItem[]>);
};

const groupItemsByCategory = (items: ClipboardItem[]) => {
  return items.reduce((acc, item) => {
    const { category } = item;

    if (category && category.name) {
      const categoryName = category.name;

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(item);
    }

    return acc;
  }, {} as Record<string, ClipboardItem[]>);
};

const History = () => {
  const {
    clipboardItems,
    setClipboardItems,
    categories,
    setCategories,
    savedClipboardId,
  } = useAppContext();
  const { setIsModalOpen } = useModalContext();
  const [messageApi, contextHolder] = message.useMessage();

  const groupedItemsByDate = useMemo(
    () => groupItemsByDate(clipboardItems),
    [clipboardItems]
  );
  const groupedItemsByCategory = useMemo(
    () => groupItemsByCategory(clipboardItems),
    [clipboardItems]
  );

  useEffect(() => {
    const fetchClipboardHistory = () => {
      chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
        if (clipboardHistory) {
          setClipboardItems(clipboardHistory);
        }
      });
    };

    fetchClipboardHistory();
  }, []);

  useEffect(() => {
    const fetchCategories = () => {
      chrome.storage.local.get(['categories'], ({ categories }) => {
        if (categories) {
          setCategories(categories);
        }
      });
    };

    fetchCategories();
  }, [setCategories]);

  const handleCreateCategory = (categoryName: string) => {
    const trimmedCategoryName = categoryName.trim().toLowerCase();

    chrome.storage.local.get(['categories'], ({ categories }) => {
      const categoryExists = categories.some(
        (category: Category) =>
          category.name.trim().toLowerCase() === trimmedCategoryName
      );

      if (categoryExists) {
        alert(`Category "${categoryName}" already exists.`);
        return null;
      }

      const newCategory: Category = {
        id: uuid(),
        name: categoryName.trim(),
      };

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

    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
        item.id === itemId ? { ...item, category } : item
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
        setIsModalOpen(false);
      });
    });
  };

  const ensureCategoryExists = async (
    categoryName: string
  ): Promise<Category | null> => {
    try {
      const trimmedCategoryName = categoryName.trim().toLowerCase();

      const result = await chrome.storage.local.get(['categories']);
      const categories: Category[] = Array.isArray(result.categories)
        ? result.categories
        : [];

      let category = categories.find(
        (c) => c.name.trim().toLowerCase() === trimmedCategoryName
      );

      if (!category) {
        category = {
          id: uuid(),
          name: categoryName.trim(),
        };

        const updatedCategories = [...categories, category];

        await chrome.storage.local.set({ categories: updatedCategories });
      }

      return category;
    } catch (error) {
      console.error('Error ensuring category existence:', error);
      return null;
    }
  };

  const GroupedByDate: React.FC<{
    groupedItems: GroupedItemsType;
  }> = ({ groupedItems }) => {
    return <GroupedItems groupedItems={groupedItems} groupName="date" />;
  };

  const GroupedByCategory: React.FC<{
    groupedItems: GroupedItemsType;
  }> = ({ groupedItems }) => {
    return <GroupedItems groupedItems={groupedItems} groupName="category" />;
  };

  return (
    <>
      <SaveClipboardModal
        onCreateCategory={handleCreateCategory}
        onSaveClipboard={handleSaveClipboardItemToCategory}
      />
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'By date',
            children: <GroupedByDate groupedItems={groupedItemsByDate} />,
            icon: <BarsOutlined />,
          },
          {
            key: '2',
            label: 'By category',
            children: (
              <GroupedByCategory groupedItems={groupedItemsByCategory} />
            ),
            icon: <AppstoreOutlined />,
          },
        ]}
      />
    </>
  );
};

export default History;
