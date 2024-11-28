import React, { useEffect, useMemo, useState } from 'react';
import { Button, Skeleton, Tabs } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import GroupedItems from '../components/GroupedItems';
import { useAppContext } from '../hooks/useAppContext';
import { useModalContext } from '../hooks/useModalContext';
import ClearClipboardModal from '../components/ClearClipboardModal';
import AssignLabelModal from '../components/AssignLabelModal';
import { Category, ClipboardItem } from '../../../types';

const groupItemsByDate = (items: ClipboardItem[]) => {
  const grouped = items.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString('en-CA');

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {} as Record<string, ClipboardItem[]>);

  return Object.fromEntries(
    Object.entries(grouped).filter(([_, items]) => items.length > 0)
  );
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
  const { isClearClipboardModalOpen, setIsClearClipboardModalOpen } =
    useModalContext();

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
      <AssignLabelModal />
      <ClearClipboardModal />
      {isLoading && <Skeleton active paragraph={{ rows: 10 }} />}
      {!isLoading && (
        <Tabs
          defaultActiveKey="1"
          tabBarExtraContent={
            <Button
              type="default"
              variant="outlined"
              onClick={() => setIsClearClipboardModalOpen(true)}
            >
              Clear Clipboard Data
            </Button>
          }
        >
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
