import React, { useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';

import GroupedItems, { GroupedItemsType } from '../components/GroupedItems';
import { ClipboardItem } from '../../../types';

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
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

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

  const GroupedByDate: React.FC<{ groupedItems: GroupedItemsType }> = ({
    groupedItems,
  }) => {
    return <GroupedItems groupedItems={groupedItems} groupName="date" />;
  };

  const GroupedByCategory: React.FC<{ groupedItems: GroupedItemsType }> = ({
    groupedItems,
  }) => {
    return <GroupedItems groupedItems={groupedItems} groupName="category" />;
  };

  return (
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
          children: <GroupedByCategory groupedItems={groupedItemsByCategory} />,
          icon: <AppstoreOutlined />,
        },
      ]}
    />
  );
};

export default History;
