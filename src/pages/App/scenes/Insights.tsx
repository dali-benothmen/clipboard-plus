import React from 'react';
import { Avatar, Card, Col, Row, Statistic } from 'antd';
import { useAppContext } from '../hooks/useAppContext';
import { Category, ClipboardItem, Source } from '../../../types';

export function getTopSourceWebsite(
  clipboardItems: ClipboardItem[]
): Source | null {
  if (!clipboardItems || clipboardItems.length === 0) return null;

  const sourceCounts: Record<string, number> = clipboardItems.reduce(
    (acc, item) => {
      const hostname = item.source?.hostname;

      if (hostname) {
        acc[hostname] = (acc[hostname] || 0) + 1;
      }

      return acc;
    },
    {} as Record<string, number>
  );

  const topSourceHostname = Object.keys(sourceCounts).reduce(
    (top, hostname) => {
      return sourceCounts[hostname] > (sourceCounts[top] || 0) ? hostname : top;
    },
    ''
  );

  return (
    clipboardItems.find((item) => item.source?.hostname === topSourceHostname)
      ?.source || null
  );
}

const getTopCategory = (
  items: ClipboardItem[],
  categories: Category[]
): Category | null => {
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

  const nonEmptyGrouped = Object.fromEntries(
    Object.entries(grouped).filter(([, items]) => items.length > 0)
  );

  const topCategoryName = Object.entries(nonEmptyGrouped).reduce(
    (topCategory, [categoryName, items]) => {
      if (items.length > (topCategory?.items.length || 0)) {
        return { name: categoryName, items };
      }
      return topCategory;
    },
    { name: '', items: [] } as { name: string; items: ClipboardItem[] }
  );

  const topCategory = categories.find(
    (category) => category.name === topCategoryName.name
  );

  return topCategory || null;
};

const Insights = () => {
  const { clipboardItems, categories } = useAppContext();
  const totalItems = clipboardItems.filter((item) => !item.isTrashed);
  const pinnedItems = clipboardItems.filter((item) => item.pinned);
  const trashedItems = clipboardItems.filter((item) => item.isTrashed);
  const topSourceWebsite = getTopSourceWebsite(clipboardItems);
  const topCategory = getTopCategory(clipboardItems, categories);

  console.log({ topCategory });

  return (
    <Row gutter={8}>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Total"
            value={totalItems.length}
            valueStyle={{ fontSize: 16 }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Pinned"
            value={pinnedItems.length}
            valueStyle={{ fontSize: 16 }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Top Category"
            value={topCategory?.name}
            valueStyle={{ fontSize: 16 }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Top Source Website"
            value={topSourceWebsite?.hostname}
            valueStyle={{ fontSize: 16 }}
            prefix={
              <Avatar
                shape="square"
                size="small"
                src={topSourceWebsite?.favicon}
              />
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Insights;
