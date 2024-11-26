import React, { useEffect, useMemo, useState } from 'react';
import { Skeleton, Tabs } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import GroupedItems from '../components/GroupedItems';
import { useAppContext } from '../hooks/useAppContext';
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
  const { clipboardItems, setClipboardItems, categories, setCategories } =
    useAppContext();

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

  return (
    <>
      {isLoading && <Skeleton active paragraph={{ rows: 10 }} />}
      {!isLoading && (
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
    </>
  );
};

export default History;
